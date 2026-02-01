import { CacheConfig, WithCacheConfig } from "./types.cjs";
import { entityKind } from "../../entity.cjs";
import { Table } from "../../table.cjs";

//#region src/cache/core/cache.d.ts
declare abstract class Cache {
  static readonly [entityKind]: string;
  abstract strategy(): 'explicit' | 'all';
  /**
   * Invoked if we should check cache for cached response
   * @param sql
   * @param tables
   */
  abstract get(key: string, tables: string[], isTag: boolean, isAutoInvalidate?: boolean): Promise<any[] | undefined>;
  /**
   * Invoked if new query should be inserted to cache
   * @param sql
   * @param tables
   */
  abstract put(hashedQuery: string, response: any, tables: string[], isTag: boolean, config?: CacheConfig): Promise<void>;
  /**
   * Invoked if insert, update, delete was invoked
   * @param tables
   */
  abstract onMutate(params: MutationOption): Promise<void>;
}
declare class NoopCache extends Cache {
  static readonly [entityKind]: string;
  strategy(): "all";
  get(_key: string): Promise<any[] | undefined>;
  put(_hashedQuery: string, _response: any, _tables: string[], _config?: any): Promise<void>;
  onMutate(_params: MutationOption): Promise<void>;
}
declare const strategyFor: (query: string, params: any[] | undefined, queryMetadata: {
  type: "select" | "update" | "delete" | "insert";
  tables: string[];
} | undefined, withCacheConfig?: WithCacheConfig) => Promise<{
  type: "skip";
  tables?: undefined;
  key?: undefined;
  isTag?: undefined;
  autoInvalidate?: undefined;
  config?: undefined;
} | {
  type: "invalidate";
  tables: string[];
  key?: undefined;
  isTag?: undefined;
  autoInvalidate?: undefined;
  config?: undefined;
} | {
  type: "try";
  key: string;
  isTag: boolean;
  autoInvalidate: boolean | undefined;
  tables: string[];
  config: CacheConfig | undefined;
}>;
type MutationOption = {
  tags?: string | string[];
  tables?: Table<any> | Table<any>[] | string | string[];
};
declare function hashQuery(sql: string, params?: any[]): Promise<string>;
//#endregion
export { Cache, MutationOption, NoopCache, hashQuery, strategyFor };
//# sourceMappingURL=cache.d.cts.map