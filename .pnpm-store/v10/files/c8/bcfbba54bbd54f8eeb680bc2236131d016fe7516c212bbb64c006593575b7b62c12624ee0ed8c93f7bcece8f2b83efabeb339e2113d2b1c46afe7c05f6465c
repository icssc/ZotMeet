import { entityKind } from "../../entity.js";
import { Column } from "../../column.js";
import { iife } from "../../tracing-utils.js";
import { ColumnBuilder } from "../../column-builder.js";
import { ForeignKeyBuilder } from "../foreign-keys.js";

//#region src/gel-core/columns/common.ts
var GelColumnBuilder = class extends ColumnBuilder {
	foreignKeyConfigs = [];
	static [entityKind] = "GelColumnBuilder";
	array(length) {
		return new GelArrayBuilder(this.config.name, this, length);
	}
	references(ref, actions = {}) {
		this.foreignKeyConfigs.push({
			ref,
			actions
		});
		return this;
	}
	unique(name, config) {
		this.config.isUnique = true;
		this.config.uniqueName = name;
		this.config.uniqueType = config?.nulls;
		return this;
	}
	generatedAlwaysAs(as) {
		this.config.generated = {
			as,
			type: "always",
			mode: "stored"
		};
		return this;
	}
	/** @internal */
	buildForeignKeys(column, table) {
		return this.foreignKeyConfigs.map(({ ref, actions }) => {
			return iife((ref$1, actions$1) => {
				const builder = new ForeignKeyBuilder(() => {
					const foreignColumn = ref$1();
					return {
						columns: [column],
						foreignColumns: [foreignColumn]
					};
				});
				if (actions$1.onUpdate) builder.onUpdate(actions$1.onUpdate);
				if (actions$1.onDelete) builder.onDelete(actions$1.onDelete);
				return builder.build(table);
			}, ref, actions);
		});
	}
	/** @internal */
	buildExtraConfigColumn(table) {
		return new GelExtraConfigColumn(table, this.config);
	}
};
var GelColumn = class extends Column {
	static [entityKind] = "GelColumn";
	/** @internal */
	table;
	constructor(table, config) {
		super(table, config);
		this.table = table;
	}
};
var GelExtraConfigColumn = class extends GelColumn {
	static [entityKind] = "GelExtraConfigColumn";
	getSQLType() {
		return this.getSQLType();
	}
	indexConfig = {
		order: this.config.order ?? "asc",
		nulls: this.config.nulls ?? "last",
		opClass: this.config.opClass
	};
	defaultConfig = {
		order: "asc",
		nulls: "last",
		opClass: void 0
	};
	asc() {
		this.indexConfig.order = "asc";
		return this;
	}
	desc() {
		this.indexConfig.order = "desc";
		return this;
	}
	nullsFirst() {
		this.indexConfig.nulls = "first";
		return this;
	}
	nullsLast() {
		this.indexConfig.nulls = "last";
		return this;
	}
	/**
	* ### PostgreSQL documentation quote
	*
	* > An operator class with optional parameters can be specified for each column of an index.
	* The operator class identifies the operators to be used by the index for that column.
	* For example, a B-tree index on four-byte integers would use the int4_ops class;
	* this operator class includes comparison functions for four-byte integers.
	* In practice the default operator class for the column's data type is usually sufficient.
	* The main point of having operator classes is that for some data types, there could be more than one meaningful ordering.
	* For example, we might want to sort a complex-number data type either by absolute value or by real part.
	* We could do this by defining two operator classes for the data type and then selecting the proper class when creating an index.
	* More information about operator classes check:
	*
	* ### Useful links
	* https://www.postgresql.org/docs/current/sql-createindex.html
	*
	* https://www.postgresql.org/docs/current/indexes-opclass.html
	*
	* https://www.postgresql.org/docs/current/xindex.html
	*
	* ### Additional types
	* If you have the `Gel_vector` extension installed in your database, you can use the
	* `vector_l2_ops`, `vector_ip_ops`, `vector_cosine_ops`, `vector_l1_ops`, `bit_hamming_ops`, `bit_jaccard_ops`, `halfvec_l2_ops`, `sparsevec_l2_ops` options, which are predefined types.
	*
	* **You can always specify any string you want in the operator class, in case Drizzle doesn't have it natively in its types**
	*
	* @param opClass
	* @returns
	*/
	op(opClass) {
		this.indexConfig.opClass = opClass;
		return this;
	}
};
var IndexedColumn = class {
	static [entityKind] = "IndexedColumn";
	constructor(name, keyAsName, type, indexConfig) {
		this.name = name;
		this.keyAsName = keyAsName;
		this.type = type;
		this.indexConfig = indexConfig;
	}
	name;
	keyAsName;
	type;
	indexConfig;
};
var GelArrayBuilder = class extends GelColumnBuilder {
	static [entityKind] = "GelArrayBuilder";
	constructor(name, baseBuilder, length) {
		super(name, "array basecolumn", "GelArray");
		this.config.baseBuilder = baseBuilder;
		this.config.length = length;
	}
	/** @internal */
	build(table) {
		const baseColumn = this.config.baseBuilder.build(table);
		return new GelArray(table, this.config, baseColumn);
	}
};
var GelArray = class extends GelColumn {
	static [entityKind] = "GelArray";
	constructor(table, config, baseColumn, range) {
		super(table, config);
		this.baseColumn = baseColumn;
		this.range = range;
	}
	mapFromDriverValue(value) {
		return value.map((v) => this.baseColumn.mapFromDriverValue(v));
	}
	mapFromJsonValue(value) {
		const base = this.baseColumn;
		return "mapFromJsonValue" in base ? value.map((v) => base.mapFromJsonValue(v)) : value.map((v) => base.mapFromDriverValue(v));
	}
	getSQLType() {
		return `${this.baseColumn.getSQLType()}[${typeof this.length === "number" ? this.length : ""}]`;
	}
};

//#endregion
export { GelArray, GelArrayBuilder, GelColumn, GelColumnBuilder, GelExtraConfigColumn, IndexedColumn };
//# sourceMappingURL=common.js.map