const require_chunk = require('./chunk-CdAKIUsw.js');
let drizzle_orm_casing = require("drizzle-orm/casing");
require("drizzle-orm/cockroach-core");
require("drizzle-orm/mssql-core");
let drizzle_orm_mysql_core = require("drizzle-orm/mysql-core");
let drizzle_orm_pg_core = require("drizzle-orm/pg-core");
let drizzle_orm_sqlite_core = require("drizzle-orm/sqlite-core");

//#region src/dialects/drizzle.ts
const extractPostgresExisting = (schemas, views, matViews) => {
	const existingSchemas = schemas.filter((x) => x.isExisting).map((x) => ({
		type: "schema",
		name: x.schemaName
	}));
	const existingViews = views.map((x) => (0, drizzle_orm_pg_core.getViewConfig)(x)).filter((x) => x.isExisting).map((x) => ({
		type: "table",
		schema: x.schema ?? "public",
		name: x.name
	}));
	const existingMatViews = matViews.map((x) => (0, drizzle_orm_pg_core.getMaterializedViewConfig)(x)).filter((x) => x.isExisting).map((x) => ({
		type: "table",
		schema: x.schema ?? "public",
		name: x.name
	}));
	return [
		...existingSchemas,
		...existingViews,
		...existingMatViews
	];
};
const getColumnCasing = (column, casing) => {
	if (!column.name) return "";
	return !column.keyAsName || casing === void 0 ? column.name : casing === "camelCase" ? (0, drizzle_orm_casing.toCamelCase)(column.name) : (0, drizzle_orm_casing.toSnakeCase)(column.name);
};

//#endregion
Object.defineProperty(exports, 'extractPostgresExisting', {
  enumerable: true,
  get: function () {
    return extractPostgresExisting;
  }
});
Object.defineProperty(exports, 'getColumnCasing', {
  enumerable: true,
  get: function () {
    return getColumnCasing;
  }
});