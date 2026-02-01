const require_rolldown_runtime = require('./_virtual/rolldown_runtime.cjs');
const require_entity = require('./entity.cjs');
const require_column = require('./column.cjs');
const require_sql_sql = require('./sql/sql.cjs');
const require_alias = require('./alias.cjs');
const require_errors = require('./errors.cjs');
const require_sql_expressions_conditions = require('./sql/expressions/conditions.cjs');
const require_sql_expressions_select = require('./sql/expressions/select.cjs');
let __table_ts = require("./table.cjs");

//#region src/relations.ts
function processRelations(tablesConfig, tables) {
	for (const tableConfig of Object.values(tablesConfig)) for (const [relationFieldName, relation] of Object.entries(tableConfig.relations)) {
		if (!require_entity.is(relation, Relation)) continue;
		relation.sourceTable = tableConfig.table;
		relation.fieldName = relationFieldName;
	}
	for (const [sourceTableName, tableConfig] of Object.entries(tablesConfig)) for (const [relationFieldName, relation] of Object.entries(tableConfig.relations)) {
		if (!require_entity.is(relation, Relation)) continue;
		let reverseRelation;
		const { targetTableName, alias, sourceColumns, targetColumns, throughTable, sourceTable, through, targetTable, where, sourceColumnTableNames, targetColumnTableNames } = relation;
		const relationPrintName = `relations -> ${tableConfig.name}: { ${relationFieldName}: r.${require_entity.is(relation, One) ? "one" : "many"}.${targetTableName}(...) }`;
		if (relationFieldName in tableConfig.table[__table_ts.TableColumns]) throw new Error(`${relationPrintName}: relation name collides with column "${relationFieldName}" of table "${tableConfig.name}"`);
		if (typeof alias === "string" && !alias) throw new Error(`${relationPrintName}: "alias" cannot be an empty string - omit it if you don't need it`);
		if (sourceColumns?.length === 0) throw new Error(`${relationPrintName}: "from" cannot be empty`);
		if (targetColumns?.length === 0) throw new Error(`${relationPrintName}: "to" cannot be empty`);
		if (sourceColumns && targetColumns) {
			if (sourceColumns.length !== targetColumns.length && !throughTable) throw new Error(`${relationPrintName}: "from" and "to" fields without "through" must have the same length`);
			for (const sName of sourceColumnTableNames) if (sName !== sourceTableName) throw new Error(`${relationPrintName}: all "from" columns must belong to table "${sourceTableName}", found column of table "${sName}"`);
			for (const tName of targetColumnTableNames) if (tName !== targetTableName) throw new Error(`${relationPrintName}: all "to" columns must belong to table "${targetTable}", found column of table "${tName}"`);
			if (through) {
				if (through.source.length !== sourceColumns.length || through.target.length !== targetColumns.length) throw new Error(`${relationPrintName}: ".through(column)" must be used either on all columns in "from" and "to" or not defined on any of them`);
				for (const column of through.source) if (tables[column._.tableName] !== throughTable) throw new Error(`${relationPrintName}: ".through(column)" must be used on the same table by all columns of the relation`);
				for (const column of through.target) if (tables[column._.tableName] !== throughTable) throw new Error(`${relationPrintName}: ".through(column)" must be used on the same table by all columns of the relation`);
			}
			continue;
		}
		if (sourceColumns || targetColumns) throw new Error(`${relationPrintName}: relation must have either both "from" and "to" defined, or none of them`);
		const reverseTableConfig = tablesConfig[targetTableName];
		if (!reverseTableConfig) throw new Error(`${relationPrintName}: not enough data provided to build the relation - "from"/"to" are not defined, and no reverse relations of table "${targetTableName}" were found"`);
		if (alias) {
			const reverseRelations = Object.values(reverseTableConfig.relations).filter((it) => require_entity.is(it, Relation) && it.alias === alias && it !== relation);
			if (reverseRelations.length > 1) throw new Error(`${relationPrintName}: not enough data provided to build the relation - "from"/"to" are not defined, and multiple relations with alias "${alias}" found in table "${targetTableName}": ${reverseRelations.map((it) => `"${it.fieldName}"`).join(", ")}`);
			reverseRelation = reverseRelations[0];
			if (!reverseRelation) throw new Error(`${relationPrintName}: not enough data provided to build the relation - "from"/"to" are not defined, and there is no reverse relation of table "${targetTableName}" with alias "${alias}"`);
		} else {
			const reverseRelations = Object.values(reverseTableConfig.relations).filter((it) => require_entity.is(it, Relation) && it.targetTable === sourceTable && !it.alias && it !== relation);
			if (reverseRelations.length > 1) throw new Error(`${relationPrintName}: not enough data provided to build the relation - "from"/"to" are not defined, and multiple relations between "${targetTableName}" and "${sourceTableName}" were found.\nHint: you can specify "alias" on both sides of the relation with the same value`);
			reverseRelation = reverseRelations[0];
			if (!reverseRelation) throw new Error(`${relationPrintName}: not enough data provided to build the relation - "from"/"to" are not defined, and no reverse relation of table "${targetTableName}" with target table "${sourceTableName}" was found`);
		}
		if (!reverseRelation.sourceColumns || !reverseRelation.targetColumns) throw new Error(`${relationPrintName}: not enough data provided to build the relation - "from"/"to" are not defined, and reverse relation "${targetTableName}.${reverseRelation.fieldName}" does not have "from"/"to" defined`);
		relation.sourceColumns = reverseRelation.targetColumns;
		relation.targetColumns = reverseRelation.sourceColumns;
		relation.through = reverseRelation.through ? {
			source: reverseRelation.through.target,
			target: reverseRelation.through.source
		} : void 0;
		relation.throughTable = reverseRelation.throughTable;
		relation.isReversed = !where;
		relation.where = where ?? reverseRelation.where;
	}
	return tablesConfig;
}
/** Builds relational config for every table in schema */
function buildRelations(tables, config) {
	const tablesConfig = {};
	for (const [tsName, table] of Object.entries(tables)) tablesConfig[tsName] = {
		table,
		name: tsName,
		relations: config[tsName] ?? {}
	};
	return processRelations(tablesConfig, tables);
}
/** Builds relational config only for tables present in relational config */
function buildRelationsParts(tables, config) {
	const tablesConfig = {};
	for (const [tsName, relations] of Object.entries(config)) {
		if (!relations || !tables[tsName]) continue;
		tablesConfig[tsName] = {
			table: tables[tsName],
			name: tsName,
			relations
		};
	}
	return processRelations(tablesConfig, tables);
}
var Relation = class {
	static [require_entity.entityKind] = "RelationV2";
	fieldName;
	sourceColumns;
	targetColumns;
	alias;
	where;
	sourceTable;
	targetTable;
	through;
	throughTable;
	isReversed;
	/** @internal */
	sourceColumnTableNames = [];
	/** @internal */
	targetColumnTableNames = [];
	constructor(targetTable, targetTableName) {
		this.targetTableName = targetTableName;
		this.targetTable = targetTable;
	}
};
var One = class extends Relation {
	static [require_entity.entityKind] = "OneV2";
	relationType = "one";
	optional;
	constructor(tables, targetTable, targetTableName, config) {
		super(targetTable, targetTableName);
		this.alias = config?.alias;
		this.where = config?.where;
		if (config?.from) this.sourceColumns = (Array.isArray(config.from) ? config.from : [config.from]).map((it) => {
			this.throughTable ??= it._.through ? tables[it._.through._.tableName] : void 0;
			this.sourceColumnTableNames.push(it._.tableName);
			return it._.column;
		});
		if (config?.to) this.targetColumns = (Array.isArray(config.to) ? config.to : [config.to]).map((it) => {
			this.throughTable ??= it._.through ? tables[it._.through._.tableName] : void 0;
			this.targetColumnTableNames.push(it._.tableName);
			return it._.column;
		});
		if (this.throughTable) this.through = {
			source: (Array.isArray(config?.from) ? config.from : config?.from ? [config.from] : []).map((c) => c._.through),
			target: (Array.isArray(config?.to) ? config.to : config?.to ? [config.to] : []).map((c) => c._.through)
		};
		this.optional = config?.optional ?? true;
	}
};
var Many = class extends Relation {
	static [require_entity.entityKind] = "ManyV2";
	relationType = "many";
	constructor(tables, targetTable, targetTableName, config) {
		super(targetTable, targetTableName);
		this.config = config;
		this.alias = config?.alias;
		this.where = config?.where;
		if (config?.from) this.sourceColumns = (Array.isArray(config.from) ? config.from : [config.from]).map((it) => {
			this.throughTable ??= it._.through ? tables[it._.through._.tableName] : void 0;
			this.sourceColumnTableNames.push(it._.tableName);
			return it._.column;
		});
		if (config?.to) this.targetColumns = (Array.isArray(config.to) ? config.to : [config.to]).map((it) => {
			this.throughTable ??= it._.through ? tables[it._.through._.tableName] : void 0;
			this.targetColumnTableNames.push(it._.tableName);
			return it._.column;
		});
		if (this.throughTable) this.through = {
			source: (Array.isArray(config?.from) ? config.from : config?.from ? [config.from] : []).map((c) => c._.through),
			target: (Array.isArray(config?.to) ? config.to : config?.to ? [config.to] : []).map((c) => c._.through)
		};
	}
};
var AggregatedField = class {
	static [require_entity.entityKind] = "AggregatedField";
	table;
	onTable(table) {
		this.table = table;
		return this;
	}
};
var Count = class extends AggregatedField {
	static [require_entity.entityKind] = "AggregatedFieldCount";
	query;
	getSQL() {
		if (!this.query) {
			if (!this.table) throw new Error("Table must be set before building aggregate field");
			this.query = require_sql_sql.sql`select count(*) as ${require_sql_sql.sql.identifier("r")} from ${getTableAsAliasSQL(this.table)}`.mapWith(Number);
		}
		return this.query;
	}
};
const operators = {
	and: require_sql_expressions_conditions.and,
	between: require_sql_expressions_conditions.between,
	eq: require_sql_expressions_conditions.eq,
	exists: require_sql_expressions_conditions.exists,
	gt: require_sql_expressions_conditions.gt,
	gte: require_sql_expressions_conditions.gte,
	ilike: require_sql_expressions_conditions.ilike,
	inArray: require_sql_expressions_conditions.inArray,
	arrayContains: require_sql_expressions_conditions.arrayContains,
	arrayContained: require_sql_expressions_conditions.arrayContained,
	arrayOverlaps: require_sql_expressions_conditions.arrayOverlaps,
	isNull: require_sql_expressions_conditions.isNull,
	isNotNull: require_sql_expressions_conditions.isNotNull,
	like: require_sql_expressions_conditions.like,
	lt: require_sql_expressions_conditions.lt,
	lte: require_sql_expressions_conditions.lte,
	ne: require_sql_expressions_conditions.ne,
	not: require_sql_expressions_conditions.not,
	notBetween: require_sql_expressions_conditions.notBetween,
	notExists: require_sql_expressions_conditions.notExists,
	notLike: require_sql_expressions_conditions.notLike,
	notIlike: require_sql_expressions_conditions.notIlike,
	notInArray: require_sql_expressions_conditions.notInArray,
	or: require_sql_expressions_conditions.or,
	sql: require_sql_sql.sql
};
const orderByOperators = {
	sql: require_sql_sql.sql,
	asc: require_sql_expressions_select.asc,
	desc: require_sql_expressions_select.desc
};
function getOrderByOperators() {
	return orderByOperators;
}
function mapRelationalRow(row, buildQueryResultSelection, mapColumnValue = (value) => value, parseJson = false, parseJsonIfString = false, path) {
	for (const selectionItem of buildQueryResultSelection) {
		if (selectionItem.selection) {
			const currentPath = `${path ? `${path}.` : ""}${selectionItem.key}`;
			if (row[selectionItem.key] === null) continue;
			if (parseJson) {
				row[selectionItem.key] = JSON.parse(row[selectionItem.key]);
				if (row[selectionItem.key] === null) continue;
			}
			if (parseJsonIfString && typeof row[selectionItem.key] === "string") row[selectionItem.key] = JSON.parse(row[selectionItem.key]);
			if (selectionItem.isArray) {
				for (const item of row[selectionItem.key]) mapRelationalRow(item, selectionItem.selection, mapColumnValue, false, parseJsonIfString, currentPath);
				continue;
			}
			mapRelationalRow(row[selectionItem.key], selectionItem.selection, mapColumnValue, false, parseJsonIfString, currentPath);
			continue;
		}
		const field = selectionItem.field;
		const value = mapColumnValue(row[selectionItem.key]);
		if (value === null) continue;
		let decoder;
		if (require_entity.is(field, require_column.Column)) decoder = field;
		else if (require_entity.is(field, require_sql_sql.SQL)) decoder = field.decoder;
		else if (require_entity.is(field, require_sql_sql.SQL.Aliased)) decoder = field.sql.decoder;
		else if (require_entity.is(field, __table_ts.Table) || require_entity.is(field, require_sql_sql.View)) decoder = require_sql_sql.noopDecoder;
		else decoder = field.getSQL().decoder;
		row[selectionItem.key] = "mapFromJsonValue" in decoder ? decoder.mapFromJsonValue(value) : decoder.mapFromDriverValue(value);
	}
	return row;
}
var RelationsBuilderTable = class {
	static [require_entity.entityKind] = "RelationsBuilderTable";
	_;
	constructor(table, name) {
		this._ = {
			name,
			table
		};
	}
};
var RelationsBuilderColumn = class {
	static [require_entity.entityKind] = "RelationsBuilderColumn";
	_;
	constructor(column, tableName, key) {
		this._ = {
			tableName,
			column,
			key
		};
	}
	through(column) {
		return new RelationsBuilderJunctionColumn(this._.column, this._.tableName, this._.key, column);
	}
};
var RelationsBuilderJunctionColumn = class {
	static [require_entity.entityKind] = "RelationsBuilderColumn";
	_;
	constructor(column, tableName, key, through) {
		this._ = {
			tableName,
			column,
			through,
			key
		};
	}
};
var RelationsHelperStatic = class {
	static [require_entity.entityKind] = "RelationsHelperStatic";
	_;
	constructor(tables) {
		this._ = { tables };
		const one = {};
		const many = {};
		for (const [tableName, table] of Object.entries(tables)) {
			one[tableName] = (config) => {
				return new One(tables, table, tableName, config);
			};
			many[tableName] = (config) => {
				return new Many(tables, table, tableName, config);
			};
		}
		this.one = one;
		this.many = many;
	}
	one;
	many;
	/** @internal - to be reworked */
	aggs = { count() {
		return new Count();
	} };
};
function createRelationsHelper(tables) {
	const helperStatic = new RelationsHelperStatic(tables);
	const relationsTables = Object.entries(tables).reduce((acc, [tKey, value]) => {
		const rTable = new RelationsBuilderTable(value, tKey);
		const columns = Object.entries(value[__table_ts.TableColumns]).reduce((acc$1, [cKey, column]) => {
			acc$1[cKey] = new RelationsBuilderColumn(column, tKey, cKey);
			return acc$1;
		}, {});
		acc[tKey] = Object.assign(rTable, columns);
		return acc;
	}, {});
	return Object.assign(helperStatic, relationsTables);
}
function extractTablesFromSchema(schema) {
	return Object.fromEntries(Object.entries(schema).filter(([_, e]) => require_entity.is(e, __table_ts.Table) || require_entity.is(e, require_sql_sql.View)));
}
function defineRelations(schema, relations) {
	const tables = extractTablesFromSchema(schema);
	return buildRelations(tables, relations ? relations(createRelationsHelper(tables)) : {});
}
function defineRelationsPart(schema, relations) {
	const tables = extractTablesFromSchema(schema);
	return buildRelationsParts(tables, relations ? relations(createRelationsHelper(tables)) : Object.fromEntries(Object.keys(tables).map((k) => [k, {}])));
}
/** @internal */
function fieldSelectionToSQL(table, target) {
	const field = table[__table_ts.TableColumns][target];
	return field ? require_entity.is(field, require_column.Column) ? field : require_entity.is(field, require_sql_sql.SQL.Aliased) ? require_sql_sql.sql`${table}.${require_sql_sql.sql.identifier(field.fieldAlias)}` : require_sql_sql.sql`${table}.${require_sql_sql.sql.identifier(target)}` : require_sql_sql.sql`${table}.${require_sql_sql.sql.identifier(target)}`;
}
function relationsFieldFilterToSQL(column, filter) {
	if (typeof filter !== "object" || require_entity.is(filter, require_sql_sql.Placeholder)) return require_sql_expressions_conditions.eq(column, filter);
	const entries = Object.entries(filter);
	if (!entries.length) return void 0;
	const parts = [];
	for (const [target, value] of entries) {
		if (value === void 0) continue;
		switch (target) {
			case "NOT": {
				const res = relationsFieldFilterToSQL(column, value);
				if (!res) continue;
				parts.push(require_sql_expressions_conditions.not(res));
				continue;
			}
			case "OR":
				if (!value.length) continue;
				parts.push(require_sql_expressions_conditions.or(...value.map((subFilter) => relationsFieldFilterToSQL(column, subFilter))));
				continue;
			case "AND":
				if (!value.length) continue;
				parts.push(require_sql_expressions_conditions.and(...value.map((subFilter) => relationsFieldFilterToSQL(column, subFilter))));
				continue;
			case "isNotNull":
			case "isNull":
				if (!value) continue;
				parts.push(operators[target](column));
				continue;
			case "in":
				parts.push(operators.inArray(column, value));
				continue;
			case "notIn":
				parts.push(operators.notInArray(column, value));
				continue;
			default:
				parts.push(operators[target](column, value));
				continue;
		}
	}
	if (!parts.length) return void 0;
	return require_sql_expressions_conditions.and(...parts);
}
function relationsFilterToSQL(table, filter, tableRelations = {}, tablesRelations = {}, casing, depth = 0) {
	const entries = Object.entries(filter);
	if (!entries.length) return void 0;
	const parts = [];
	for (const [target, value] of entries) {
		if (value === void 0) continue;
		switch (target) {
			case "RAW": {
				const processed = typeof value === "function" ? value(table, operators) : value.getSQL();
				parts.push(processed);
				continue;
			}
			case "OR":
				if (!value?.length) continue;
				parts.push(require_sql_expressions_conditions.or(...value.map((subFilter) => relationsFilterToSQL(table, subFilter, tableRelations, tablesRelations, casing, depth))));
				continue;
			case "AND":
				if (!value?.length) continue;
				parts.push(require_sql_expressions_conditions.and(...value.map((subFilter) => relationsFilterToSQL(table, subFilter, tableRelations, tablesRelations, casing, depth))));
				continue;
			case "NOT": {
				if (value === void 0) continue;
				const built = relationsFilterToSQL(table, value, tableRelations, tablesRelations, casing, depth);
				if (!built) continue;
				parts.push(require_sql_expressions_conditions.not(built));
				continue;
			}
			default: {
				if (table[__table_ts.TableColumns][target]) {
					const colFilter = relationsFieldFilterToSQL(fieldSelectionToSQL(table, target), value);
					if (colFilter) parts.push(colFilter);
					continue;
				}
				const relation = tableRelations[target];
				if (!relation) throw new require_errors.DrizzleError({ message: `Unknown relational filter field: "${target}"` });
				const targetTable = require_alias.aliasedTable(relation.targetTable, `f${depth}`);
				const throughTable = relation.throughTable ? require_alias.aliasedTable(relation.throughTable, `ft${depth}`) : void 0;
				const targetConfig = tablesRelations[relation.targetTableName];
				const { filter: relationFilter, joinCondition } = relationToSQL(casing, relation, table, targetTable, throughTable);
				const filter$1 = require_sql_expressions_conditions.and(relationFilter, typeof value === "boolean" ? void 0 : relationsFilterToSQL(targetTable, value, targetConfig.relations, tablesRelations, casing, depth + 1));
				const subquery = throughTable ? require_sql_sql.sql`(select * from ${getTableAsAliasSQL(targetTable)} inner join ${getTableAsAliasSQL(throughTable)} on ${joinCondition}${require_sql_sql.sql` where ${filter$1}`.if(filter$1)} limit 1)` : require_sql_sql.sql`(select * from ${getTableAsAliasSQL(targetTable)}${require_sql_sql.sql` where ${filter$1}`.if(filter$1)} limit 1)`;
				if (filter$1) parts.push((value ? require_sql_expressions_conditions.exists : require_sql_expressions_conditions.notExists)(subquery));
			}
		}
	}
	return require_sql_expressions_conditions.and(...parts);
}
function relationsOrderToSQL(table, orders) {
	if (typeof orders === "function") {
		const data = orders(table, orderByOperators);
		return require_entity.is(data, require_sql_sql.SQL) ? data : Array.isArray(data) ? data.length ? require_sql_sql.sql.join(data.map((o) => require_entity.is(o, require_sql_sql.SQL) ? o : require_sql_expressions_select.asc(o)), require_sql_sql.sql`, `) : void 0 : require_entity.is(data, require_column.Column) ? require_sql_expressions_select.asc(data) : void 0;
	}
	const entries = Object.entries(orders).filter(([_, value]) => value);
	if (!entries.length) return void 0;
	return require_sql_sql.sql.join(entries.map(([target, value]) => (value === "asc" ? require_sql_expressions_select.asc : require_sql_expressions_select.desc)(fieldSelectionToSQL(table, target))), require_sql_sql.sql`, `);
}
function relationExtrasToSQL(table, extras) {
	const subqueries = [];
	const selection = [];
	for (const [key, field] of Object.entries(extras)) {
		if (!field) continue;
		const extra = typeof field === "function" ? field(table, { sql: operators.sql }) : field;
		const query = require_sql_sql.sql`(${extra.getSQL()}) as ${require_sql_sql.sql.identifier(key)}`;
		query.decoder = extra.getSQL().decoder;
		subqueries.push(query);
		selection.push({
			key,
			field: query
		});
	}
	return {
		sql: subqueries.length ? require_sql_sql.sql.join(subqueries, require_sql_sql.sql`, `) : void 0,
		selection
	};
}
function relationToSQL(casing, relation, sourceTable, targetTable, throughTable) {
	if (relation.through) {
		const outerColumnWhere = relation.sourceColumns.map((s, i) => {
			const t = relation.through.source[i];
			return require_sql_expressions_conditions.eq(require_sql_sql.sql`${sourceTable}.${require_sql_sql.sql.identifier(casing.getColumnCasing(s))}`, require_sql_sql.sql`${throughTable}.${require_sql_sql.sql.identifier(require_entity.is(t._.column, require_column.Column) ? casing.getColumnCasing(t._.column) : t._.key)}`);
		});
		const innerColumnWhere = relation.targetColumns.map((s, i) => {
			const t = relation.through.target[i];
			return require_sql_expressions_conditions.eq(require_sql_sql.sql`${throughTable}.${require_sql_sql.sql.identifier(require_entity.is(t._.column, require_column.Column) ? casing.getColumnCasing(t._.column) : t._.key)}`, require_sql_sql.sql`${targetTable}.${require_sql_sql.sql.identifier(casing.getColumnCasing(s))}`);
		});
		return {
			filter: require_sql_expressions_conditions.and(relation.where ? relationsFilterToSQL(relation.isReversed ? sourceTable : targetTable, relation.where) : void 0, ...outerColumnWhere),
			joinCondition: require_sql_expressions_conditions.and(...innerColumnWhere)
		};
	}
	return { filter: require_sql_expressions_conditions.and(...relation.sourceColumns.map((s, i) => {
		const t = relation.targetColumns[i];
		return require_sql_expressions_conditions.eq(require_sql_sql.sql`${sourceTable}.${require_sql_sql.sql.identifier(casing.getColumnCasing(s))}`, require_sql_sql.sql`${targetTable}.${require_sql_sql.sql.identifier(casing.getColumnCasing(t))}`);
	}), relation.where ? relationsFilterToSQL(relation.isReversed ? sourceTable : targetTable, relation.where) : void 0) };
}
function getTableAsAliasSQL(table) {
	return require_sql_sql.sql`${table[__table_ts.IsAlias] ? require_sql_sql.sql`${require_sql_sql.sql`${require_sql_sql.sql.identifier(table[__table_ts.TableSchema] ?? "")}.`.if(table[__table_ts.TableSchema])}${require_sql_sql.sql.identifier(table[__table_ts.OriginalName])} as ${table}` : table}`;
}

//#endregion
exports.AggregatedField = AggregatedField;
exports.Count = Count;
exports.Many = Many;
exports.One = One;
exports.Relation = Relation;
exports.RelationsBuilderColumn = RelationsBuilderColumn;
exports.RelationsBuilderJunctionColumn = RelationsBuilderJunctionColumn;
exports.RelationsBuilderTable = RelationsBuilderTable;
exports.RelationsHelperStatic = RelationsHelperStatic;
exports.buildRelations = buildRelations;
exports.buildRelationsParts = buildRelationsParts;
exports.createRelationsHelper = createRelationsHelper;
exports.defineRelations = defineRelations;
exports.defineRelationsPart = defineRelationsPart;
exports.extractTablesFromSchema = extractTablesFromSchema;
exports.fieldSelectionToSQL = fieldSelectionToSQL;
exports.getOrderByOperators = getOrderByOperators;
exports.getTableAsAliasSQL = getTableAsAliasSQL;
exports.mapRelationalRow = mapRelationalRow;
exports.operators = operators;
exports.orderByOperators = orderByOperators;
exports.processRelations = processRelations;
exports.relationExtrasToSQL = relationExtrasToSQL;
exports.relationToSQL = relationToSQL;
exports.relationsFilterToSQL = relationsFilterToSQL;
exports.relationsOrderToSQL = relationsOrderToSQL;
//# sourceMappingURL=relations.cjs.map