import { RedisPool } from './RedisPool';
import { CacheDriverInterface } from './cache-driver.interface';

interface RedisCacheDriverOptions {
  pool: RedisPool,
}

export class RedisCacheDriver implements CacheDriverInterface {
  protected readonly redisPool: RedisPool;

  public constructor({ pool }: RedisCacheDriverOptions) {
    this.redisPool = pool;
  }

  protected async getClient() {
    return this.redisPool.getClient();
  }

  public async get(key: string) {
    const client = await this.getClient();

    try {
      const res = await client.get(key);
      return res && JSON.parse(res);
    } finally {
      this.redisPool.release(client);
    }
  }

  public async set(key: string, value, expiration) {
    const client = await this.getClient();

    try {
      return await client.set(key, JSON.stringify(value), 'EX', expiration);
    } finally {
      this.redisPool.release(client);
    }
  }

  public async remove(key: string) {
    const client = await this.getClient();

    try {
      return await client.del(key).then(_ => undefined);
    } finally {
      this.redisPool.release(client);
    }
  }

  public async keysStartingWith(prefix: string) {
    const client = await this.getClient();

    try {
      return await client.keys(`${prefix}*`);
    } finally {
      this.redisPool.release(client);
    }
  }

  public async cleanup(): Promise<void> {
    return this.redisPool.cleanup();
  }

  public async testConnection(): Promise<void> {
    const client = await this.getClient();

    try {
      await client.ping();
    } finally {
      this.redisPool.release(client);
    }
  }
}
