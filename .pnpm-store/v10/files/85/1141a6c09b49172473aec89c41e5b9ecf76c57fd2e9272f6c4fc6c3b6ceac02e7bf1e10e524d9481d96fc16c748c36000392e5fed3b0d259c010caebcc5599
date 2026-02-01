
//#region src/utils/index.ts
const originUUID = "00000000-0000-0000-0000-000000000000";
function assertUnreachable(_x) {
	throw new Error("Didn't expect to get here");
}
function escapeSingleQuotes(str) {
	return str.replace(/'/g, "''");
}
const prepareMigrationRenames = (renames) => {
	return renames.map((it) => {
		const schema1 = it.from.schema ? `${it.from.schema}.` : "";
		const schema2 = it.to.schema ? `${it.to.schema}.` : "";
		const table1 = it.from.table ? `${it.from.table}.` : "";
		const table2 = it.to.table ? `${it.to.table}.` : "";
		return `${schema1}${table1}${it.from.name}->${schema2}${table2}${it.to.name}`;
	});
};
function stringifyArray(value, mode, mapCallback, depth = 0) {
	if (!Array.isArray(value)) return mapCallback(value, depth);
	depth += 1;
	const res = value.map((e) => {
		if (Array.isArray(e)) return stringifyArray(e, mode, mapCallback, depth);
		return mapCallback(e, depth);
	}).join(",");
	return mode === "ts" ? `[${res}]` : mode === "geometry-sql" ? `ARRAY[${res}]` : `{${res}}`;
}
function stringifyTuplesArray(array, mode, mapCallback, depth = 0) {
	if (!array.find((n) => Array.isArray(n))) return mapCallback(array, depth);
	depth += 1;
	const res = array.map((e) => {
		if (Array.isArray(e) && e.find((n) => Array.isArray(n))) return stringifyTuplesArray(e, mode, mapCallback, depth);
		return mapCallback(e, depth);
	}).join(",");
	return mode === "ts" ? `[${res}]` : mode === "geometry-sql" ? `ARRAY[${res}]` : `{${res}}`;
}
const trimChar = (str, char) => {
	if (str.length < 2) return str;
	if (typeof char === "string" && str.startsWith(char) && str.endsWith(char)) return str.substring(1, str.length - 1);
	if (Array.isArray(char) && str.startsWith(char[0]) && str.endsWith(char[1])) return str.substring(1, str.length - 1);
	return str;
};
const splitExpressions = (input) => {
	if (!input) return [];
	const expressions = [];
	let parenDepth = 0;
	let inSingleQuotes = false;
	let inDoubleQuotes = false;
	let currentExpressionStart = 0;
	for (let i = 0; i < input.length; i++) {
		const char = input[i];
		if (char === "'" && input[i + 1] === "'") {
			i++;
			continue;
		}
		if (char === "\"" && input[i + 1] === "\"") {
			i++;
			continue;
		}
		if (char === "'") {
			if (!inDoubleQuotes) inSingleQuotes = !inSingleQuotes;
			continue;
		}
		if (char === "\"") {
			if (!inSingleQuotes) inDoubleQuotes = !inDoubleQuotes;
			continue;
		}
		if (!inSingleQuotes && !inDoubleQuotes) {
			if (char === "(") parenDepth++;
			else if (char === ")") parenDepth = Math.max(0, parenDepth - 1);
			else if (char === "," && parenDepth === 0) {
				expressions.push(input.substring(currentExpressionStart, i).trim());
				currentExpressionStart = i + 1;
			}
		}
	}
	if (currentExpressionStart < input.length) expressions.push(input.substring(currentExpressionStart).trim());
	return expressions.filter((s) => s.length > 0);
};
const wrapWith = (it, char) => {
	if (!it.startsWith(char) || !it.endsWith(char)) return `${char}${it}${char}`;
	return it;
};
const timeTzRegex = /\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}(?::?\d{2})?)?/;
const isTime = (it) => {
	return timeTzRegex.test(it);
};
const dateExtractRegex = /^\d{4}-\d{2}-\d{2}/;
const isDate = (it) => {
	return dateExtractRegex.test(it);
};
const timestampRegexp = /^(\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}(?::?\d{2})?)?|\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}(?::?\d{2})?)?)$/;
const isTimestamp = (it) => {
	return timestampRegexp.test(it);
};
const timezoneSuffixRegexp = /([+-]\d{2}(:\d{2})?|Z)$/i;
function hasTimeZoneSuffix(s) {
	return timezoneSuffixRegexp.test(s);
}
const possibleIntervals = [
	"year",
	"month",
	"day",
	"hour",
	"minute",
	"second",
	"year to month",
	"day to hour",
	"day to minute",
	"day to second",
	"hour to minute",
	"hour to second",
	"minute to second"
];
function parseIntervalFields(type) {
	const options = {};
	const splitted = type.split(" ");
	if (splitted.length === 1) return options;
	const rest = splitted.slice(1, splitted.length).join(" ");
	if (possibleIntervals.includes(rest)) return {
		...options,
		fields: rest
	};
	for (const s of possibleIntervals) if (rest.startsWith(`${s}(`)) return {
		...options,
		fields: s
	};
	return options;
}
function parseEWKB(hex) {
	const hexToBytes = (hex$1) => {
		const bytes$1 = [];
		for (let c = 0; c < hex$1.length; c += 2) bytes$1.push(Number.parseInt(hex$1.slice(c, c + 2), 16));
		return new Uint8Array(bytes$1);
	};
	const bytesToFloat64 = (bytes$1, offset$1) => {
		const buffer = /* @__PURE__ */ new ArrayBuffer(8);
		const view$1 = new DataView(buffer);
		for (let i = 0; i < 8; i++) view$1.setUint8(i, bytes$1[offset$1 + i]);
		return view$1.getFloat64(0, true);
	};
	const bytes = hexToBytes(hex);
	let offset = 0;
	const byteOrder = bytes[offset];
	offset += 1;
	const view = new DataView(bytes.buffer);
	const geomType = view.getUint32(offset, byteOrder === 1);
	offset += 4;
	let srid;
	if (geomType & 536870912) {
		srid = view.getUint32(offset, byteOrder === 1);
		offset += 4;
	}
	if ((geomType & 65535) === 1) {
		const x = bytesToFloat64(bytes, offset);
		offset += 8;
		const y = bytesToFloat64(bytes, offset);
		offset += 8;
		return {
			srid,
			point: [x, y]
		};
	}
	throw new Error("Unsupported geometry type");
}

//#endregion
Object.defineProperty(exports, 'assertUnreachable', {
  enumerable: true,
  get: function () {
    return assertUnreachable;
  }
});
Object.defineProperty(exports, 'escapeSingleQuotes', {
  enumerable: true,
  get: function () {
    return escapeSingleQuotes;
  }
});
Object.defineProperty(exports, 'hasTimeZoneSuffix', {
  enumerable: true,
  get: function () {
    return hasTimeZoneSuffix;
  }
});
Object.defineProperty(exports, 'isDate', {
  enumerable: true,
  get: function () {
    return isDate;
  }
});
Object.defineProperty(exports, 'isTime', {
  enumerable: true,
  get: function () {
    return isTime;
  }
});
Object.defineProperty(exports, 'isTimestamp', {
  enumerable: true,
  get: function () {
    return isTimestamp;
  }
});
Object.defineProperty(exports, 'originUUID', {
  enumerable: true,
  get: function () {
    return originUUID;
  }
});
Object.defineProperty(exports, 'parseEWKB', {
  enumerable: true,
  get: function () {
    return parseEWKB;
  }
});
Object.defineProperty(exports, 'parseIntervalFields', {
  enumerable: true,
  get: function () {
    return parseIntervalFields;
  }
});
Object.defineProperty(exports, 'prepareMigrationRenames', {
  enumerable: true,
  get: function () {
    return prepareMigrationRenames;
  }
});
Object.defineProperty(exports, 'splitExpressions', {
  enumerable: true,
  get: function () {
    return splitExpressions;
  }
});
Object.defineProperty(exports, 'stringifyArray', {
  enumerable: true,
  get: function () {
    return stringifyArray;
  }
});
Object.defineProperty(exports, 'stringifyTuplesArray', {
  enumerable: true,
  get: function () {
    return stringifyTuplesArray;
  }
});
Object.defineProperty(exports, 'trimChar', {
  enumerable: true,
  get: function () {
    return trimChar;
  }
});
Object.defineProperty(exports, 'wrapWith', {
  enumerable: true,
  get: function () {
    return wrapWith;
  }
});