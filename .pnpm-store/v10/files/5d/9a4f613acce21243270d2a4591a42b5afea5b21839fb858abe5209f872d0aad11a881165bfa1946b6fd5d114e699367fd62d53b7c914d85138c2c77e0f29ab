const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../entity.cjs");
let __column_ts = require("../column.cjs");
let __table_ts = require("../table.cjs");
let __sql_sql_ts = require("../sql/sql.cjs");

//#region src/row-mappers/index.ts
function resolveDecoder(field) {
	let decoder;
	if ((0, __entity_ts.is)(field, __column_ts.Column)) decoder = field;
	else if ((0, __entity_ts.is)(field, __sql_sql_ts.SQL)) decoder = field.decoder;
	else if ((0, __entity_ts.is)(field, __sql_sql_ts.SQL.Aliased)) decoder = field.sql.decoder;
	else if ((0, __entity_ts.is)(field, __table_ts.Table) || (0, __entity_ts.is)(field, __sql_sql_ts.View)) return null;
	else decoder = field.getSQL().decoder;
	if (decoder.mapFromDriverValue === __sql_sql_ts.noopDecoder.mapFromDriverValue) return null;
	return "mapFromJsonValue" in decoder && decoder.mapFromJsonValue ? decoder.mapFromJsonValue.bind(decoder) : decoder.mapFromDriverValue.bind(decoder);
}
function generateObjectCode(selection, decoders, rowVar, parseJson) {
	const props = [];
	for (const item of selection) {
		const key = item.key;
		const keyLiteral = JSON.stringify(key);
		const accessor = `${rowVar}[${keyLiteral}]`;
		if (item.selection) {
			const innerVar = `i${decoders.length}`;
			const innerObject = generateObjectCode(item.selection, decoders, innerVar, false);
			let nestedCode;
			if (item.isArray) nestedCode = `((a) => {
          const l = a.length, r = Array.from({ length: l });
          for (let j = 0; j < l; j++) { const ${innerVar} = a[j]; r[j] = ${innerObject}; }
          return r;
        })`;
			else nestedCode = `((${innerVar}) => (${innerObject}))`;
			if (parseJson) props.push(`${keyLiteral}: ${accessor} === null ? null : ((v) => {
          const p = JSON.parse(v);
          return p === null ? null : ${nestedCode}(p);
        })(${accessor})`);
			else props.push(`${keyLiteral}: ${accessor} === null ? null : ${nestedCode}(${accessor})`);
		} else {
			const decoder = resolveDecoder(item.field);
			if (decoder === null) props.push(`${keyLiteral}: ${accessor}`);
			else {
				const idx = decoders.length;
				decoders.push(decoder);
				props.push(`${keyLiteral}: d[${idx}](${accessor})`);
			}
		}
	}
	return `{ ${props.join(", ")} }`;
}
/**
* JIT-compiled row mapper generator.
* Uses `new Function()` to generate optimized mapping code at prepare time.
*
* **Note:** This mapper does NOT work in environments that restrict dynamic code evaluation,
* such as Cloudflare Workers, Deno Deploy, or Vercel Edge Functions.
* Use `interpretedRowMapper` in those environments.
*
* @example
* ```ts
* import { jitRowMapper } from 'drizzle-orm/row-mappers';
*
* const db = drizzle({
*   client,
*   schema,
*   relations,
*   rowMapperGenerator: jitRowMapper,
* });
* ```
*/
const jitRowMapper = (selection, parseJson) => {
	const decoders = [];
	const batchCode = `const l = rows.length;
for (let i = 0; i < l; i++) {
  const r = rows[i];
  rows[i] = ${generateObjectCode(selection, decoders, "r", parseJson)};
}
return rows;`;
	const fn = decoders.length > 0 ? new Function("rows", "d", batchCode) : new Function("rows", batchCode);
	return {
		mapper: decoders.length > 0 ? (rows) => fn(rows, decoders) : fn,
		isArrayMode: false,
		code: batchCode
	};
};
function mapRowInterpreted(row, selection, parseJson) {
	const result = {};
	for (const item of selection) {
		const key = item.key;
		let value = row[key];
		if (item.selection) if (value === null) result[key] = null;
		else {
			if (parseJson && typeof value === "string") {
				value = JSON.parse(value);
				if (value === null) {
					result[key] = null;
					continue;
				}
			}
			if (item.isArray) {
				const arr = value;
				const mapped = [];
				for (let i = 0; i < arr.length; i++) mapped[i] = mapRowInterpreted(arr[i], item.selection, false);
				result[key] = mapped;
			} else result[key] = mapRowInterpreted(value, item.selection, false);
		}
		else if (value === null) result[key] = null;
		else {
			const decoder = resolveDecoder(item.field);
			result[key] = decoder ? decoder(value) : value;
		}
	}
	return result;
}
/**
* Interpreted row mapper generator.
* Uses a recursive function to map rows at runtime.
*
* This mapper works in ALL JavaScript environments, including those that
* restrict dynamic code evaluation (Cloudflare Workers, Deno Deploy, Vercel Edge Functions).
*
* Performance is slightly slower than `jitRowMapper`, but the difference
* is negligible for most use cases.
*
* @example
* ```ts
* import { interpretedRowMapper } from 'drizzle-orm/row-mappers';
*
* const db = drizzle({
*   client,
*   schema,
*   relations,
*   rowMapperGenerator: interpretedRowMapper,
* });
* ```
*/
const interpretedRowMapper = (selection, parseJson) => {
	return {
		mapper: (rows) => {
			const l = rows.length;
			for (let i = 0; i < l; i++) rows[i] = mapRowInterpreted(rows[i], selection, parseJson);
			return rows;
		},
		isArrayMode: false,
		code: "[interpreted mode - no generated code]"
	};
};
/**
* Default row mapper generator.
* Currently uses the JIT mapper for best performance.
*/
const defaultRowMapper = jitRowMapper;
function generateArrayObjectCode(selection, decoders, rowVar, indexRef, parseJson) {
	const props = [];
	for (const item of selection) {
		const key = item.key;
		const keyLiteral = JSON.stringify(key);
		if (item.selection) {
			const accessor = `${rowVar}[${indexRef.value++}]`;
			const innerVar = `i${decoders.length}`;
			const innerObject = generateObjectCode(item.selection, decoders, innerVar, false);
			let nestedCode;
			if (item.isArray) nestedCode = `((a) => {
          const l = a.length, r = Array.from({ length: l });
          for (let j = 0; j < l; j++) { const ${innerVar} = a[j]; r[j] = ${innerObject}; }
          return r;
        })`;
			else nestedCode = `((${innerVar}) => (${innerObject}))`;
			if (parseJson) props.push(`${keyLiteral}: ${accessor} === null ? null : ((v) => {
          const p = JSON.parse(v);
          return p === null ? null : ${nestedCode}(p);
        })(${accessor})`);
			else props.push(`${keyLiteral}: ${accessor} === null ? null : ${nestedCode}(${accessor})`);
		} else {
			const accessor = `${rowVar}[${indexRef.value++}]`;
			const decoder = resolveDecoder(item.field);
			if (decoder === null) props.push(`${keyLiteral}: ${accessor}`);
			else {
				const decoderIdx = decoders.length;
				decoders.push(decoder);
				props.push(`${keyLiteral}: d[${decoderIdx}](${accessor})`);
			}
		}
	}
	return `{ ${props.join(", ")} }`;
}
/**
* JIT-compiled array-mode row mapper generator.
* Uses `new Function()` to generate optimized mapping code that works with
* array-based rows from `.values()` queries for maximum performance.
*
* This mapper expects the driver to return rows as arrays (e.g., `[1, "John", "2024-01-01"]`)
* instead of objects (e.g., `{id: 1, name: "John", createdAt: "2024-01-01"}`).
*
* **Note:** This mapper does NOT work in environments that restrict dynamic code evaluation,
* such as Cloudflare Workers, Deno Deploy, or Vercel Edge Functions.
*
* @example
* ```ts
* import { jitArrayRowMapper } from 'drizzle-orm/row-mappers';
*
* const db = drizzle({
*   client,
*   schema,
*   relations,
*   rowMapperGenerator: jitArrayRowMapper,
* });
* ```
*/
const jitArrayRowMapper = (selection, parseJson) => {
	const decoders = [];
	const batchCode = `const l = rows.length;
for (let i = 0; i < l; i++) {
  const r = rows[i];
  rows[i] = ${generateArrayObjectCode(selection, decoders, "r", { value: 0 }, parseJson)};
}
return rows;`;
	const fn = decoders.length > 0 ? new Function("rows", "d", batchCode) : new Function("rows", batchCode);
	return {
		mapper: decoders.length > 0 ? (rows) => fn(rows, decoders) : fn,
		isArrayMode: true,
		code: batchCode
	};
};

//#endregion
exports.defaultRowMapper = defaultRowMapper;
exports.interpretedRowMapper = interpretedRowMapper;
exports.jitArrayRowMapper = jitArrayRowMapper;
exports.jitRowMapper = jitRowMapper;
//# sourceMappingURL=index.cjs.map