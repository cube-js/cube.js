export interface CacheDriverInterface {
  get(key: string): Promise<any>;
  set(key: string, value, expiration): Promise<any>;
  remove(key: string): Promise<void>;
  keysStartingWith(prefix: string): Promise<any[]>;
  cleanup(): Promise<void>;
  testConnection(): Promise<void>;
}
