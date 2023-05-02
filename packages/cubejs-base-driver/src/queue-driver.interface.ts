export type QueryDef = unknown;
export type QueryKey = (string | [string, any[]]) & {
  persistent?: true,
};
export interface QueryKeyHash extends String {
  __type: 'QueryKeyHash'
}

export type GetActiveAndToProcessResponse = [active: string[], toProcess: string[]];
export type AddToQueueResponse = [added: number, _b: any, _c: any, queueSize: number, addedToQueueTime: number];
export type QueryStageStateResponse = [active: string[], toProcess: string[]] | [active: string[], toProcess: string[], defs: Record<string, QueryDef>];
export type RetrieveForProcessingSuccess = [
  added: any /** todo(ovr): Remove, useless */,
  removed: any /** todo(ovr): Remove, useless */,
  active: QueryKeyHash[],
  pending: number,
  def: QueryDef,
  lockAquired: true
];
export type RetrieveForProcessingFail = [
  added: any /** todo(ovr): Remove, useless */,
  removed: any /** todo(ovr): Remove, useless */,
  active: QueryKeyHash[],
  pending: number,
  def: null,
  lockAquired: false
];
export type RetrieveForProcessingResponse = RetrieveForProcessingSuccess | RetrieveForProcessingFail | null;

export interface AddToQueueQuery {
  isJob: boolean,
  orphanedTimeout: unknown
}

export interface AddToQueueOptions {
  stageQueryKey: string,
  requestId: string,
  orphanedTimeout?: number,
}

export interface QueueDriverOptions {
  redisQueuePrefix: string,
  concurrency: number,
  continueWaitTimeout: number,
  orphanedTimeout: number,
  heartBeatTimeout: number,
  getQueueEventsBus?: any,
  processUid?: string;
}

export interface QueueDriverConnectionInterface {
  redisHash(queryKey: QueryKey): QueryKeyHash;
  getResultBlocking(queryKey: QueryKey): Promise<unknown>;
  getResult(queryKey: QueryKey): Promise<any>;
  addToQueue(keyScore: number, queryKey: QueryKey, orphanedTime: any, queryHandler: any, query: AddToQueueQuery, priority: number, options: AddToQueueOptions): Promise<AddToQueueResponse>;
  // Return query keys which was sorted by priority and time
  getToProcessQueries(): Promise<string[]>;
  getActiveQueries(): Promise<string[]>;
  getQueryDef(queryKey: QueryKeyHash): Promise<QueryDef | null>;
  // Queries which was added to queue, but was not processed and not needed
  getOrphanedQueries(): Promise<string[]>;
  // Queries which was not completed with old heartbeat
  getStalledQueries(): Promise<string[]>;
  getQueryStageState(onlyKeys: boolean): Promise<QueryStageStateResponse>;
  updateHeartBeat(hash: QueryKeyHash): Promise<void>;
  getNextProcessingId(): Promise<string | number>;
  // Trying to acquire a lock for processing a queue item, this method can return null when
  // multiple nodes tries to process the same query
  retrieveForProcessing(hash: QueryKeyHash, processingId: number | string): Promise<RetrieveForProcessingResponse>;
  freeProcessingLock(hash: QueryKeyHash, processingId: string | number, activated: unknown): Promise<void>;
  optimisticQueryUpdate(hash: QueryKeyHash, toUpdate, processingId): Promise<boolean>;
  cancelQuery(queryKey: QueryKey): Promise<QueryDef | null>;
  getQueryAndRemove(hash: QueryKeyHash): Promise<[QueryDef]>;
  setResultAndRemoveQuery(hash: QueryKeyHash, executionResult: any, processingId: any): Promise<unknown>;
  release(): void;
  //
  getQueriesToCancel(): Promise<string[]>
  getActiveAndToProcess(): Promise<GetActiveAndToProcessResponse>;
}

export interface QueueDriverInterface {
  redisHash(queryKey: QueryKey): QueryKeyHash;
  createConnection(): Promise<QueueDriverConnectionInterface>;
  release(connection: QueueDriverConnectionInterface): Promise<void>;
}
