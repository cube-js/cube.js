import R from 'ramda';
import uuid from 'uuid/v4';

import { CubejsServerCore } from './server';
import { CompilerApi } from './CompilerApi';
import { RequestContext } from './types';

export class RefreshScheduler {
  public constructor(
    protected readonly serverCore: CubejsServerCore,
  ) {
  }

  protected async refreshQueriesForPreAggregation(context, compilerApi: CompilerApi, preAggregation, queryingOptions) {
    const compilers = await compilerApi.getCompilers();
    const query = await compilerApi.createQueryByDataSource(compilers, queryingOptions);
    if (preAggregation.preAggregation.partitionGranularity) {
      const dataSource = query.cubeDataSource(preAggregation.cube);

      const orchestratorApi = this.serverCore.getOrchestratorApi(context);
      const queryWithDataSource = await compilerApi.createQueryByDataSource(compilers, queryingOptions, dataSource);
      const [startDate, endDate] =
        await Promise.all(queryWithDataSource.preAggregationStartEndQueries(preAggregation.cube, preAggregation.preAggregation)
            .map(sql => orchestratorApi.executeQuery({
              query: sql[0],
              values: sql[1],
              continueWait: true,
              cacheKeyQueries: [],
              dataSource,
              scheduledRefresh: true,
            }))
        );

      const extractDate = ({ data }: any) => {
        // TODO some backends return dates as objects here. Use ApiGateway data transformation ?
        data = JSON.parse(JSON.stringify(data));
        return data[0] && data[0][Object.keys(data[0])[0]];
      };

      const dateRange = [extractDate(startDate), extractDate(endDate)];
      if (!dateRange[0] || !dateRange[1]) {
        // Empty table. Nothing to refresh.
        return [];
      }

      const baseQuery = {
        ...queryingOptions,
        ...preAggregation.references,
        timeDimensions: [{
          ...preAggregation.references.timeDimensions[0],
          dateRange
        }]
      };
      const partitionQuery = await compilerApi.createQueryByDataSource(compilers, baseQuery);
      const { partitionDimension } = partitionQuery.preAggregations.partitionDimension(preAggregation);
      return partitionDimension.timeSeries().map(range => ({
        ...baseQuery,
        timeDimensions: [{
          ...preAggregation.references.timeDimensions[0],
          dateRange: range
        }]
      }));
    } else if (preAggregation.preAggregation.type === 'rollup') {
      return [{ ...queryingOptions, ...preAggregation.references }];
    } else if (preAggregation.preAggregation.type === 'originalSql') {
      const cubeFromPath = query.cubeEvaluator.cubeFromPath(preAggregation.cube);
      const measuresCount = Object.keys(cubeFromPath.measures || {}).length;
      const dimensionsCount = Object.keys(cubeFromPath.dimensions || {}).length;
      if (measuresCount === 0 && dimensionsCount === 0) {
        throw new Error(
          `Can't refresh pre-aggregation without measures and dimensions: ${preAggregation.preAggregationName}`
        );
      }
      return [{
        ...queryingOptions,
        ...(
          measuresCount &&
            { measures: [`${preAggregation.cube}.${Object.keys(cubeFromPath.measures)[0]}`] }
        ),
        ...(
          dimensionsCount &&
            { dimensions: [`${preAggregation.cube}.${Object.keys(cubeFromPath.dimensions)[0]}`] }
        )
      }];
    } else {
      throw new Error(
        `Scheduled refresh is unsupported for ${preAggregation.preAggregation.type} of ${preAggregation.preAggregationName}`
      );
    }
  }

  public async runScheduledRefresh(ctx: RequestContext | null, queryingOptions) {
    queryingOptions = { timezones: [queryingOptions.timezone || 'UTC'], ...queryingOptions };
    const { throwErrors, ...restOptions } = queryingOptions;

    const context: RequestContext = {
      authInfo: null,
      securityContext: null,
      ...ctx,
      requestId: `scheduler-${ctx && ctx.requestId || uuid()}`,
    };

    this.serverCore.logger('Refresh Scheduler Run', {
      securityContext: context.securityContext,
      requestId: context.requestId
    });

    try {
      const compilerApi = this.serverCore.getCompilerApi(context);
      await Promise.all([
        this.refreshCubesRefreshKey(context, compilerApi, restOptions),
        this.refreshPreAggregations(context, compilerApi, restOptions)
      ]);
      return {
        finished: true
      };
    } catch (e) {
      if (e.error !== 'Continue wait') {
        this.serverCore.logger('Refresh Scheduler Error', {
          error: e.error || e.stack || e.toString(),
          securityContext: context.securityContext,
          requestId: context.requestId
        });
      }
      if (throwErrors) {
        throw e;
      }
    }
    return { finished: false };
  }

  protected async refreshCubesRefreshKey(context, compilerApi: CompilerApi, queryingOptions) {
    const compilers = await compilerApi.getCompilers();
    const queryForEvaluation = await compilerApi.createQueryByDataSource(compilers, {});
    await Promise.all(queryForEvaluation.cubeEvaluator.cubeNames().map(async cube => {
      const cubeFromPath = queryForEvaluation.cubeEvaluator.cubeFromPath(cube);
      const measuresCount = Object.keys(cubeFromPath.measures || {}).length;
      const dimensionsCount = Object.keys(cubeFromPath.dimensions || {}).length;
      if (measuresCount === 0 && dimensionsCount === 0) {
        return;
      }
      await Promise.all(queryingOptions.timezones.map(async timezone => {
        const query = {
          ...queryingOptions,
          ...(
            measuresCount &&
            { measures: [`${cube}.${Object.keys(cubeFromPath.measures)[0]}`] }
          ),
          ...(
            dimensionsCount &&
            { dimensions: [`${cube}.${Object.keys(cubeFromPath.dimensions)[0]}`] }
          ),
          timezone
        };
        const sqlQuery = await compilerApi.getSql(query);
        const orchestratorApi = this.serverCore.getOrchestratorApi(context);
        await orchestratorApi.executeQuery({
          ...sqlQuery,
          preAggregations: [],
          continueWait: true,
          renewQuery: true,
          requestId: context.requestId,
          scheduledRefresh: true,
          loadRefreshKeysOnly: true
        });
      }));
    }));
  }

  protected async roundRobinRefreshPreAggregationsQueryIterator(context, compilerApi: CompilerApi, queryingOptions) {
    const { timezones } = queryingOptions;
    const scheduledPreAggregations = await compilerApi.scheduledPreAggregations();

    let preAggregationCursor = null;
    let timezoneCursor = 0;
    let partitionCursor = 0;

    const queriesCache = {};
    const finishedPartitions = {};
    scheduledPreAggregations.forEach((p, pi) => {
      timezones.forEach((t, ti) => {
        finishedPartitions[`${pi}_${ti}`] = false;
      });
    });
    const queriesForPreAggregation = async (preAggregationIndex, timezone) => {
      const key = `${preAggregationIndex}_${timezone}`;
      if (!queriesCache[key]) {
        const preAggregation = scheduledPreAggregations[preAggregationIndex];
        queriesCache[key] = this.refreshQueriesForPreAggregation(
          context, compilerApi, preAggregation, { ...queryingOptions, timezone }
        );
      }
      return queriesCache[key];
    };

    const advance = async () => {
      preAggregationCursor = preAggregationCursor != null ? preAggregationCursor + 1 : 0;
      if (preAggregationCursor >= scheduledPreAggregations.length) {
        preAggregationCursor = 0;
        timezoneCursor += 1;
      }

      if (timezoneCursor >= timezones.length) {
        timezoneCursor = 0;
        partitionCursor += 1;
      }

      const queries = await queriesForPreAggregation(preAggregationCursor, timezones[timezoneCursor]);
      if (partitionCursor < queries.length) {
        const queryCursor = queries.length - 1 - partitionCursor;
        const query = queries[queryCursor];
        const sqlQuery = await compilerApi.getSql(query);
        return {
          ...sqlQuery,
          preAggregations: sqlQuery.preAggregations.map(
            (p) => ({ ...p, priority: queryCursor - queries.length })
          ),
          continueWait: true,
          renewQuery: true,
          requestId: context.requestId,
          timezone: timezones[timezoneCursor],
          scheduledRefresh: true,
        };
      } else {
        finishedPartitions[`${preAggregationCursor}_${timezoneCursor}`] = true;
        return null;
      }
    };

    return {
      next: async () => {
        let next;
        while (Object.keys(finishedPartitions).find(k => !finishedPartitions[k])) {
          next = await advance();
          if (next) {
            return next;
          }
        }
        return null;
      }
    };
  }

  protected async refreshPreAggregations(context, compilerApi: CompilerApi, queryingOptions) {
    let { concurrency, workerIndices } = queryingOptions;
    concurrency = concurrency || 1;
    workerIndices = workerIndices || R.range(0, concurrency);
    return Promise.all(R.range(0, concurrency)
      .filter(workerIndex => workerIndices.indexOf(workerIndex) !== -1)
      .map(async workerIndex => {
        const queryIterator = await this.roundRobinRefreshPreAggregationsQueryIterator(
          context, compilerApi, queryingOptions
        );
        for (;;) {
          for (let i = 0; i < concurrency; i++) {
            const nextQuery = await queryIterator.next();
            if (!nextQuery) {
              return;
            }
            if (i === workerIndex) {
              const orchestratorApi = this.serverCore.getOrchestratorApi(context);
              await orchestratorApi.executeQuery(nextQuery);
            }
          }
        }
      }));
  }
}
