import {
  BaseDriver,
  DriverInterface,
  StreamOptions,
  QueryOptions, StreamTableData,
} from '@cubejs-backend/base-driver';
import { assertDataSource, getEnv } from '@cubejs-backend/shared';
import { promisify } from 'util';
import * as stream from 'stream';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Connection, Database } from 'duckdb';

import { DucksDBQuery } from './DucksDBQuery';
import { HydrationStream } from './HydrationStream';

export type DucksDBDriverConfiguration = {
  dataSource?: string,
  enableHttpFs?: boolean,
  initSql?: string,
};

export class DucksDBDriver extends BaseDriver implements DriverInterface {
  protected readonly config: DucksDBDriverConfiguration;

  protected initPromise: Promise<Database> | null = null;

  public constructor(
    config: DucksDBDriverConfiguration,
  ) {
    super();

    const dataSource =
      config.dataSource ||
      assertDataSource('default');

    this.config = {
      enableHttpFs: getEnv('ducksdbHttpFs', { dataSource }) || true,
      ...config,
    };
  }

  protected async initDatabase(): Promise<Database> {
    const db = new Database(':memory:');
    const conn = db.connect();

    if (this.config.enableHttpFs) {
      try {
        await this.handleQuery(conn, 'INSTALL httpfs', []);
      } catch (e) {
        if (this.logger) {
          console.error('DucksDB - error on httpfs installation', {
            e
          });
        }
      }
    }

    if (this.config.initSql) {
      try {
        await this.handleQuery(conn, this.config.initSql, []);
      } catch (e) {
        if (this.logger) {
          console.error('DucksDB - error on init sql (skipping)', {
            e
          });
        }
      }
    }

    return db;
  }

  protected async getConnection() {
    if (!this.initPromise) {
      this.initPromise = this.initDatabase();
    }

    return (await this.initPromise).connect();
  }

  public static dialectClass() {
    return DucksDBQuery;
  }

  protected handleQuery<R = unknown>(connection: Connection, query: string, values: unknown[], _options?: QueryOptions): Promise<R[]> {
    const executeQuery: (sql: string, ...args: any[]) => Promise<R[]> = promisify(connection.all).bind(connection) as any;

    return executeQuery(query, ...(values || []));
  }

  public async query<R = unknown>(query: string, values: unknown[], _options?: QueryOptions): Promise<R[]> {
    return this.handleQuery(await this.getConnection(), query, values, _options);
  }

  public async stream(
    query: string,
    values: unknown[],
    { highWaterMark }: StreamOptions
  ): Promise<StreamTableData> {
    const connection = await this.getConnection();

    const asyncIterator = connection.stream(query, ...(values || []));
    const rowStream = stream.Readable.from(asyncIterator, { highWaterMark }).pipe(new HydrationStream());

    return {
      rowStream,
    };
  }

  public async testConnection(): Promise<void> {
    // nothing to do
  }

  public readOnly() {
    return false;
  }

  public async release(): Promise<void> {
    if (this.initPromise) {
      await promisify((await this.initPromise).close).bind(this);
    }
  }
}
