import type { Database, Sqlite3Static } from "@libsql/libsql-wasm-experimental";
import type { Config, IntMode, Client, Transaction, TransactionMode, ResultSet, InStatement, InArgs, Replicated } from "@libsql/core/api";
import type { ExpandedConfig } from "@libsql/core/config";
export * from "@libsql/core/api";
export declare function createClient(config: Config): Client;
/** @private */
export declare function _createClient(config: ExpandedConfig): Client;
export declare class Sqlite3Client implements Client {
    #private;
    closed: boolean;
    protocol: "file";
    /** @private */
    constructor(sqlite3: Sqlite3Static, path: string, db: Database, intMode: IntMode);
    execute(stmtOrSql: InStatement | string, args?: InArgs): Promise<ResultSet>;
    batch(stmts: Array<InStatement>, mode?: TransactionMode): Promise<Array<ResultSet>>;
    migrate(stmts: Array<InStatement>): Promise<Array<ResultSet>>;
    transaction(mode?: TransactionMode): Promise<Transaction>;
    executeMultiple(sql: string): Promise<void>;
    sync(): Promise<Replicated>;
    reconnect(): Promise<void>;
    close(): void;
}
export declare class Sqlite3Transaction implements Transaction {
    #private;
    /** @private */
    constructor(database: Database, intMode: IntMode);
    execute(stmt: InStatement): Promise<ResultSet>;
    batch(stmts: Array<InStatement>): Promise<Array<ResultSet>>;
    executeMultiple(sql: string): Promise<void>;
    rollback(): Promise<void>;
    commit(): Promise<void>;
    close(): void;
    get closed(): boolean;
}
