import * as __sql_sql_ts0 from "../sql/sql.js";
import * as __pg_core_index_ts0 from "../pg-core/index.js";
import * as __pg_core_roles_ts0 from "../pg-core/roles.js";

//#region src/supabase/rls.d.ts
declare const anonRole: __pg_core_roles_ts0.PgRole;
declare const authenticatedRole: __pg_core_roles_ts0.PgRole;
declare const serviceRole: __pg_core_roles_ts0.PgRole;
declare const postgresRole: __pg_core_roles_ts0.PgRole;
declare const supabaseAuthAdminRole: __pg_core_roles_ts0.PgRole;
declare const authUsers: __pg_core_index_ts0.PgTableWithColumns<{
  name: "users";
  schema: "auth";
  columns: {
    id: __pg_core_index_ts0.PgBuildColumn<"users", __pg_core_index_ts0.SetNotNull<__pg_core_index_ts0.SetIsPrimaryKey<__pg_core_index_ts0.PgUUIDBuilder>>, {
      name: string;
      tableName: "users";
      dataType: "string uuid";
      data: string;
      driverParam: string;
      notNull: true;
      hasDefault: false;
      isPrimaryKey: false;
      isAutoincrement: false;
      hasRuntimeDefault: false;
      enumValues: undefined;
      identity: undefined;
      generated: undefined;
    }>;
    email: __pg_core_index_ts0.PgBuildColumn<"users", __pg_core_index_ts0.PgVarcharBuilder<[string, ...string[]]>, {
      name: string;
      tableName: "users";
      dataType: "string";
      data: string;
      driverParam: string;
      notNull: false;
      hasDefault: false;
      isPrimaryKey: false;
      isAutoincrement: false;
      hasRuntimeDefault: false;
      enumValues: undefined;
      identity: undefined;
      generated: undefined;
    }>;
    phone: __pg_core_index_ts0.PgBuildColumn<"users", __pg_core_index_ts0.PgTextBuilder<[string, ...string[]]>, {
      name: string;
      tableName: "users";
      dataType: "string";
      data: string;
      driverParam: string;
      notNull: false;
      hasDefault: false;
      isPrimaryKey: false;
      isAutoincrement: false;
      hasRuntimeDefault: false;
      enumValues: undefined;
      identity: undefined;
      generated: undefined;
    }>;
    emailConfirmedAt: __pg_core_index_ts0.PgBuildColumn<"users", __pg_core_index_ts0.PgTimestampBuilder, {
      name: string;
      tableName: "users";
      dataType: "object date";
      data: Date;
      driverParam: string;
      notNull: false;
      hasDefault: false;
      isPrimaryKey: false;
      isAutoincrement: false;
      hasRuntimeDefault: false;
      enumValues: undefined;
      identity: undefined;
      generated: undefined;
    }>;
    phoneConfirmedAt: __pg_core_index_ts0.PgBuildColumn<"users", __pg_core_index_ts0.PgTimestampBuilder, {
      name: string;
      tableName: "users";
      dataType: "object date";
      data: Date;
      driverParam: string;
      notNull: false;
      hasDefault: false;
      isPrimaryKey: false;
      isAutoincrement: false;
      hasRuntimeDefault: false;
      enumValues: undefined;
      identity: undefined;
      generated: undefined;
    }>;
    lastSignInAt: __pg_core_index_ts0.PgBuildColumn<"users", __pg_core_index_ts0.PgTimestampBuilder, {
      name: string;
      tableName: "users";
      dataType: "object date";
      data: Date;
      driverParam: string;
      notNull: false;
      hasDefault: false;
      isPrimaryKey: false;
      isAutoincrement: false;
      hasRuntimeDefault: false;
      enumValues: undefined;
      identity: undefined;
      generated: undefined;
    }>;
    createdAt: __pg_core_index_ts0.PgBuildColumn<"users", __pg_core_index_ts0.PgTimestampBuilder, {
      name: string;
      tableName: "users";
      dataType: "object date";
      data: Date;
      driverParam: string;
      notNull: false;
      hasDefault: false;
      isPrimaryKey: false;
      isAutoincrement: false;
      hasRuntimeDefault: false;
      enumValues: undefined;
      identity: undefined;
      generated: undefined;
    }>;
    updatedAt: __pg_core_index_ts0.PgBuildColumn<"users", __pg_core_index_ts0.PgTimestampBuilder, {
      name: string;
      tableName: "users";
      dataType: "object date";
      data: Date;
      driverParam: string;
      notNull: false;
      hasDefault: false;
      isPrimaryKey: false;
      isAutoincrement: false;
      hasRuntimeDefault: false;
      enumValues: undefined;
      identity: undefined;
      generated: undefined;
    }>;
  };
  dialect: "pg";
}>;
declare const realtimeMessages: __pg_core_index_ts0.PgTableWithColumns<{
  name: "messages";
  schema: "realtime";
  columns: {
    id: __pg_core_index_ts0.PgBuildColumn<"messages", __pg_core_index_ts0.SetIsPrimaryKey<__pg_core_index_ts0.PgBigSerial64Builder>, {
      name: string;
      tableName: "messages";
      dataType: "bigint int64";
      data: bigint;
      driverParam: string;
      notNull: true;
      hasDefault: true;
      isPrimaryKey: false;
      isAutoincrement: false;
      hasRuntimeDefault: false;
      enumValues: undefined;
      identity: undefined;
      generated: undefined;
    }>;
    topic: __pg_core_index_ts0.PgBuildColumn<"messages", __pg_core_index_ts0.SetNotNull<__pg_core_index_ts0.PgTextBuilder<[string, ...string[]]>>, {
      name: string;
      tableName: "messages";
      dataType: "string";
      data: string;
      driverParam: string;
      notNull: true;
      hasDefault: false;
      isPrimaryKey: false;
      isAutoincrement: false;
      hasRuntimeDefault: false;
      enumValues: undefined;
      identity: undefined;
      generated: undefined;
    }>;
    extension: __pg_core_index_ts0.PgBuildColumn<"messages", __pg_core_index_ts0.SetNotNull<__pg_core_index_ts0.PgTextBuilder<["presence", "broadcast", "postgres_changes"]>>, {
      name: string;
      tableName: "messages";
      dataType: "string enum";
      data: "presence" | "broadcast" | "postgres_changes";
      driverParam: string;
      notNull: true;
      hasDefault: false;
      isPrimaryKey: false;
      isAutoincrement: false;
      hasRuntimeDefault: false;
      enumValues: ["presence", "broadcast", "postgres_changes"];
      identity: undefined;
      generated: undefined;
    }>;
  };
  dialect: "pg";
}>;
declare const authUid: __sql_sql_ts0.SQL<unknown>;
declare const realtimeTopic: __sql_sql_ts0.SQL<unknown>;
//#endregion
export { anonRole, authUid, authUsers, authenticatedRole, postgresRole, realtimeMessages, realtimeTopic, serviceRole, supabaseAuthAdminRole };
//# sourceMappingURL=rls.d.ts.map