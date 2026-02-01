const require_chunk = require('./chunk-CdAKIUsw.js');
const require_utils = require('./utils-D2E5ChQ0.js');
const require_brace_expansion$1 = require('./brace-expansion-BfFnz-Zg.js');

//#region ../node_modules/.pnpm/minimatch@7.4.6/node_modules/minimatch/dist/mjs/brace-expressions.js
const posixClasses = {
	"[:alnum:]": ["\\p{L}\\p{Nl}\\p{Nd}", true],
	"[:alpha:]": ["\\p{L}\\p{Nl}", true],
	"[:ascii:]": ["\\x00-\\x7f", false],
	"[:blank:]": ["\\p{Zs}\\t", true],
	"[:cntrl:]": ["\\p{Cc}", true],
	"[:digit:]": ["\\p{Nd}", true],
	"[:graph:]": [
		"\\p{Z}\\p{C}",
		true,
		true
	],
	"[:lower:]": ["\\p{Ll}", true],
	"[:print:]": ["\\p{C}", true],
	"[:punct:]": ["\\p{P}", true],
	"[:space:]": ["\\p{Z}\\t\\r\\n\\v\\f", true],
	"[:upper:]": ["\\p{Lu}", true],
	"[:word:]": ["\\p{L}\\p{Nl}\\p{Nd}\\p{Pc}", true],
	"[:xdigit:]": ["A-Fa-f0-9", false]
};
const braceEscape = (s) => s.replace(/[[\]\\-]/g, "\\$&");
const regexpEscape = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
const rangesToString = (ranges) => ranges.join("");
const parseClass = (glob, position) => {
	const pos = position;
	/* c8 ignore start */
	if (glob.charAt(pos) !== "[") throw new Error("not in a brace expression");
	/* c8 ignore stop */
	const ranges = [];
	const negs = [];
	let i = pos + 1;
	let sawStart = false;
	let uflag = false;
	let escaping = false;
	let negate = false;
	let endPos = pos;
	let rangeStart = "";
	WHILE: while (i < glob.length) {
		const c = glob.charAt(i);
		if ((c === "!" || c === "^") && i === pos + 1) {
			negate = true;
			i++;
			continue;
		}
		if (c === "]" && sawStart && !escaping) {
			endPos = i + 1;
			break;
		}
		sawStart = true;
		if (c === "\\") {
			if (!escaping) {
				escaping = true;
				i++;
				continue;
			}
		}
		if (c === "[" && !escaping) {
			for (const [cls, [unip, u, neg]] of Object.entries(posixClasses)) if (glob.startsWith(cls, i)) {
				if (rangeStart) return [
					"$.",
					false,
					glob.length - pos,
					true
				];
				i += cls.length;
				if (neg) negs.push(unip);
				else ranges.push(unip);
				uflag = uflag || u;
				continue WHILE;
			}
		}
		escaping = false;
		if (rangeStart) {
			if (c > rangeStart) ranges.push(braceEscape(rangeStart) + "-" + braceEscape(c));
			else if (c === rangeStart) ranges.push(braceEscape(c));
			rangeStart = "";
			i++;
			continue;
		}
		if (glob.startsWith("-]", i + 1)) {
			ranges.push(braceEscape(c + "-"));
			i += 2;
			continue;
		}
		if (glob.startsWith("-", i + 1)) {
			rangeStart = c;
			i += 2;
			continue;
		}
		ranges.push(braceEscape(c));
		i++;
	}
	if (endPos < i) return [
		"",
		false,
		0,
		false
	];
	if (!ranges.length && !negs.length) return [
		"$.",
		false,
		glob.length - pos,
		true
	];
	if (negs.length === 0 && ranges.length === 1 && /^\\?.$/.test(ranges[0]) && !negate) return [
		regexpEscape(ranges[0].length === 2 ? ranges[0].slice(-1) : ranges[0]),
		false,
		endPos - pos,
		false
	];
	const sranges = "[" + (negate ? "^" : "") + rangesToString(ranges) + "]";
	const snegs = "[" + (negate ? "" : "^") + rangesToString(negs) + "]";
	return [
		ranges.length && negs.length ? "(" + sranges + "|" + snegs + ")" : ranges.length ? sranges : snegs,
		uflag,
		endPos - pos,
		true
	];
};

//#endregion
//#region ../node_modules/.pnpm/minimatch@7.4.6/node_modules/minimatch/dist/mjs/escape.js
/**
* Escape all magic characters in a glob pattern.
*
* If the {@link windowsPathsNoEscape | GlobOptions.windowsPathsNoEscape}
* option is used, then characters are escaped by wrapping in `[]`, because
* a magic character wrapped in a character class can only be satisfied by
* that exact character.  In this mode, `\` is _not_ escaped, because it is
* not interpreted as a magic character, but instead as a path separator.
*/
const escape = (s, { windowsPathsNoEscape = false } = {}) => {
	return windowsPathsNoEscape ? s.replace(/[?*()[\]]/g, "[$&]") : s.replace(/[?*()[\]\\]/g, "\\$&");
};

//#endregion
//#region ../node_modules/.pnpm/minimatch@7.4.6/node_modules/minimatch/dist/mjs/unescape.js
/**
* Un-escape a string that has been escaped with {@link escape}.
*
* If the {@link windowsPathsNoEscape} option is used, then square-brace
* escapes are removed, but not backslash escapes.  For example, it will turn
* the string `'[*]'` into `*`, but it will not turn `'\\*'` into `'*'`,
* becuase `\` is a path separator in `windowsPathsNoEscape` mode.
*
* When `windowsPathsNoEscape` is not set, then both brace escapes and
* backslash escapes are removed.
*
* Slashes (and backslashes in `windowsPathsNoEscape` mode) cannot be escaped
* or unescaped.
*/
const unescape = (s, { windowsPathsNoEscape = false } = {}) => {
	return windowsPathsNoEscape ? s.replace(/\[([^\/\\])\]/g, "$1") : s.replace(/((?!\\).|^)\[([^\/\\])\]/g, "$1$2").replace(/\\([^\/])/g, "$1");
};

//#endregion
//#region ../node_modules/.pnpm/minimatch@7.4.6/node_modules/minimatch/dist/mjs/index.js
var import_brace_expansion = /* @__PURE__ */ require_chunk.__toESM(require_brace_expansion$1.require_brace_expansion(), 1);
const minimatch = (p, pattern, options = {}) => {
	assertValidPattern(pattern);
	if (!options.nocomment && pattern.charAt(0) === "#") return false;
	return new Minimatch(pattern, options).match(p);
};
const starDotExtRE = /^\*+([^+@!?\*\[\(]*)$/;
const starDotExtTest = (ext$1) => (f) => !f.startsWith(".") && f.endsWith(ext$1);
const starDotExtTestDot = (ext$1) => (f) => f.endsWith(ext$1);
const starDotExtTestNocase = (ext$1) => {
	ext$1 = ext$1.toLowerCase();
	return (f) => !f.startsWith(".") && f.toLowerCase().endsWith(ext$1);
};
const starDotExtTestNocaseDot = (ext$1) => {
	ext$1 = ext$1.toLowerCase();
	return (f) => f.toLowerCase().endsWith(ext$1);
};
const starDotStarRE = /^\*+\.\*+$/;
const starDotStarTest = (f) => !f.startsWith(".") && f.includes(".");
const starDotStarTestDot = (f) => f !== "." && f !== ".." && f.includes(".");
const dotStarRE = /^\.\*+$/;
const dotStarTest = (f) => f !== "." && f !== ".." && f.startsWith(".");
const starRE = /^\*+$/;
const starTest = (f) => f.length !== 0 && !f.startsWith(".");
const starTestDot = (f) => f.length !== 0 && f !== "." && f !== "..";
const qmarksRE = /^\?+([^+@!?\*\[\(]*)?$/;
const qmarksTestNocase = ([$0, ext$1 = ""]) => {
	const noext = qmarksTestNoExt([$0]);
	if (!ext$1) return noext;
	ext$1 = ext$1.toLowerCase();
	return (f) => noext(f) && f.toLowerCase().endsWith(ext$1);
};
const qmarksTestNocaseDot = ([$0, ext$1 = ""]) => {
	const noext = qmarksTestNoExtDot([$0]);
	if (!ext$1) return noext;
	ext$1 = ext$1.toLowerCase();
	return (f) => noext(f) && f.toLowerCase().endsWith(ext$1);
};
const qmarksTestDot = ([$0, ext$1 = ""]) => {
	const noext = qmarksTestNoExtDot([$0]);
	return !ext$1 ? noext : (f) => noext(f) && f.endsWith(ext$1);
};
const qmarksTest = ([$0, ext$1 = ""]) => {
	const noext = qmarksTestNoExt([$0]);
	return !ext$1 ? noext : (f) => noext(f) && f.endsWith(ext$1);
};
const qmarksTestNoExt = ([$0]) => {
	const len = $0.length;
	return (f) => f.length === len && !f.startsWith(".");
};
const qmarksTestNoExtDot = ([$0]) => {
	const len = $0.length;
	return (f) => f.length === len && f !== "." && f !== "..";
};
/* c8 ignore start */
const defaultPlatform = typeof process === "object" && process ? typeof process.env === "object" && process.env && process.env.__MINIMATCH_TESTING_PLATFORM__ || process.platform : "posix";
const path = {
	win32: { sep: "\\" },
	posix: { sep: "/" }
};
/* c8 ignore stop */
const sep = defaultPlatform === "win32" ? path.win32.sep : path.posix.sep;
minimatch.sep = sep;
const GLOBSTAR = Symbol("globstar **");
minimatch.GLOBSTAR = GLOBSTAR;
const plTypes = {
	"!": {
		open: "(?:(?!(?:",
		close: "))[^/]*?)"
	},
	"?": {
		open: "(?:",
		close: ")?"
	},
	"+": {
		open: "(?:",
		close: ")+"
	},
	"*": {
		open: "(?:",
		close: ")*"
	},
	"@": {
		open: "(?:",
		close: ")"
	}
};
const qmark = "[^/]";
const star = qmark + "*?";
const twoStarDot = "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?";
const twoStarNoDot = "(?:(?!(?:\\/|^)\\.).)*?";
const charSet = (s) => s.split("").reduce((set, c) => {
	set[c] = true;
	return set;
}, {});
const reSpecials = charSet("().*{}+?[]^$\\!");
const addPatternStartSet = charSet("[.(");
const filter = (pattern, options = {}) => (p) => minimatch(p, pattern, options);
minimatch.filter = filter;
const ext = (a, b = {}) => Object.assign({}, a, b);
const defaults = (def) => {
	if (!def || typeof def !== "object" || !Object.keys(def).length) return minimatch;
	const orig = minimatch;
	const m = (p, pattern, options = {}) => orig(p, pattern, ext(def, options));
	return Object.assign(m, {
		Minimatch: class Minimatch$1 extends orig.Minimatch {
			constructor(pattern, options = {}) {
				super(pattern, ext(def, options));
			}
			static defaults(options) {
				return orig.defaults(ext(def, options)).Minimatch;
			}
		},
		unescape: (s, options = {}) => orig.unescape(s, ext(def, options)),
		escape: (s, options = {}) => orig.escape(s, ext(def, options)),
		filter: (pattern, options = {}) => orig.filter(pattern, ext(def, options)),
		defaults: (options) => orig.defaults(ext(def, options)),
		makeRe: (pattern, options = {}) => orig.makeRe(pattern, ext(def, options)),
		braceExpand: (pattern, options = {}) => orig.braceExpand(pattern, ext(def, options)),
		match: (list, pattern, options = {}) => orig.match(list, pattern, ext(def, options)),
		sep: orig.sep,
		GLOBSTAR
	});
};
minimatch.defaults = defaults;
const braceExpand = (pattern, options = {}) => {
	assertValidPattern(pattern);
	if (options.nobrace || !/\{(?:(?!\{).)*\}/.test(pattern)) return [pattern];
	return (0, import_brace_expansion.default)(pattern);
};
minimatch.braceExpand = braceExpand;
const MAX_PATTERN_LENGTH = 1024 * 64;
const assertValidPattern = (pattern) => {
	if (typeof pattern !== "string") throw new TypeError("invalid pattern");
	if (pattern.length > MAX_PATTERN_LENGTH) throw new TypeError("pattern is too long");
};
const makeRe = (pattern, options = {}) => new Minimatch(pattern, options).makeRe();
minimatch.makeRe = makeRe;
const match = (list, pattern, options = {}) => {
	const mm = new Minimatch(pattern, options);
	list = list.filter((f) => mm.match(f));
	if (mm.options.nonull && !list.length) list.push(pattern);
	return list;
};
minimatch.match = match;
const globUnescape = (s) => s.replace(/\\(.)/g, "$1");
const globMagic = /[?*]|[+@!]\(.*?\)|\[|\]/;
const regExpEscape = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
var Minimatch = class {
	options;
	set;
	pattern;
	windowsPathsNoEscape;
	nonegate;
	negate;
	comment;
	empty;
	preserveMultipleSlashes;
	partial;
	globSet;
	globParts;
	nocase;
	isWindows;
	platform;
	windowsNoMagicRoot;
	regexp;
	constructor(pattern, options = {}) {
		assertValidPattern(pattern);
		options = options || {};
		this.options = options;
		this.pattern = pattern;
		this.platform = options.platform || defaultPlatform;
		this.isWindows = this.platform === "win32";
		this.windowsPathsNoEscape = !!options.windowsPathsNoEscape || options.allowWindowsEscape === false;
		if (this.windowsPathsNoEscape) this.pattern = this.pattern.replace(/\\/g, "/");
		this.preserveMultipleSlashes = !!options.preserveMultipleSlashes;
		this.regexp = null;
		this.negate = false;
		this.nonegate = !!options.nonegate;
		this.comment = false;
		this.empty = false;
		this.partial = !!options.partial;
		this.nocase = !!this.options.nocase;
		this.windowsNoMagicRoot = options.windowsNoMagicRoot !== void 0 ? options.windowsNoMagicRoot : !!(this.isWindows && this.nocase);
		this.globSet = [];
		this.globParts = [];
		this.set = [];
		this.make();
	}
	hasMagic() {
		if (this.options.magicalBraces && this.set.length > 1) return true;
		for (const pattern of this.set) for (const part of pattern) if (typeof part !== "string") return true;
		return false;
	}
	debug(..._) {}
	make() {
		const pattern = this.pattern;
		const options = this.options;
		if (!options.nocomment && pattern.charAt(0) === "#") {
			this.comment = true;
			return;
		}
		if (!pattern) {
			this.empty = true;
			return;
		}
		this.parseNegate();
		this.globSet = [...new Set(this.braceExpand())];
		if (options.debug) this.debug = (...args) => console.error(...args);
		this.debug(this.pattern, this.globSet);
		const rawGlobParts = this.globSet.map((s) => this.slashSplit(s));
		this.globParts = this.preprocess(rawGlobParts);
		this.debug(this.pattern, this.globParts);
		let set = this.globParts.map((s, _, __) => {
			if (this.isWindows && this.windowsNoMagicRoot) {
				const isUNC = s[0] === "" && s[1] === "" && (s[2] === "?" || !globMagic.test(s[2])) && !globMagic.test(s[3]);
				const isDrive = /^[a-z]:/i.test(s[0]);
				if (isUNC) return [...s.slice(0, 4), ...s.slice(4).map((ss) => this.parse(ss))];
				else if (isDrive) return [s[0], ...s.slice(1).map((ss) => this.parse(ss))];
			}
			return s.map((ss) => this.parse(ss));
		});
		this.debug(this.pattern, set);
		this.set = set.filter((s) => s.indexOf(false) === -1);
		if (this.isWindows) for (let i = 0; i < this.set.length; i++) {
			const p = this.set[i];
			if (p[0] === "" && p[1] === "" && this.globParts[i][2] === "?" && typeof p[3] === "string" && /^[a-z]:$/i.test(p[3])) p[2] = "?";
		}
		this.debug(this.pattern, this.set);
	}
	preprocess(globParts) {
		if (this.options.noglobstar) {
			for (let i = 0; i < globParts.length; i++) for (let j = 0; j < globParts[i].length; j++) if (globParts[i][j] === "**") globParts[i][j] = "*";
		}
		const { optimizationLevel = 1 } = this.options;
		if (optimizationLevel >= 2) {
			globParts = this.firstPhasePreProcess(globParts);
			globParts = this.secondPhasePreProcess(globParts);
		} else if (optimizationLevel >= 1) globParts = this.levelOneOptimize(globParts);
		else globParts = this.adjascentGlobstarOptimize(globParts);
		return globParts;
	}
	adjascentGlobstarOptimize(globParts) {
		return globParts.map((parts) => {
			let gs = -1;
			while (-1 !== (gs = parts.indexOf("**", gs + 1))) {
				let i = gs;
				while (parts[i + 1] === "**") i++;
				if (i !== gs) parts.splice(gs, i - gs);
			}
			return parts;
		});
	}
	levelOneOptimize(globParts) {
		return globParts.map((parts) => {
			parts = parts.reduce((set, part) => {
				const prev = set[set.length - 1];
				if (part === "**" && prev === "**") return set;
				if (part === "..") {
					if (prev && prev !== ".." && prev !== "." && prev !== "**") {
						set.pop();
						return set;
					}
				}
				set.push(part);
				return set;
			}, []);
			return parts.length === 0 ? [""] : parts;
		});
	}
	levelTwoFileOptimize(parts) {
		if (!Array.isArray(parts)) parts = this.slashSplit(parts);
		let didSomething = false;
		do {
			didSomething = false;
			if (!this.preserveMultipleSlashes) {
				for (let i = 1; i < parts.length - 1; i++) {
					const p = parts[i];
					if (i === 1 && p === "" && parts[0] === "") continue;
					if (p === "." || p === "") {
						didSomething = true;
						parts.splice(i, 1);
						i--;
					}
				}
				if (parts[0] === "." && parts.length === 2 && (parts[1] === "." || parts[1] === "")) {
					didSomething = true;
					parts.pop();
				}
			}
			let dd = 0;
			while (-1 !== (dd = parts.indexOf("..", dd + 1))) {
				const p = parts[dd - 1];
				if (p && p !== "." && p !== ".." && p !== "**") {
					didSomething = true;
					parts.splice(dd - 1, 2);
					dd -= 2;
				}
			}
		} while (didSomething);
		return parts.length === 0 ? [""] : parts;
	}
	firstPhasePreProcess(globParts) {
		let didSomething = false;
		do {
			didSomething = false;
			for (let parts of globParts) {
				let gs = -1;
				while (-1 !== (gs = parts.indexOf("**", gs + 1))) {
					let gss = gs;
					while (parts[gss + 1] === "**") gss++;
					if (gss > gs) parts.splice(gs + 1, gss - gs);
					let next = parts[gs + 1];
					const p = parts[gs + 2];
					const p2 = parts[gs + 3];
					if (next !== "..") continue;
					if (!p || p === "." || p === ".." || !p2 || p2 === "." || p2 === "..") continue;
					didSomething = true;
					parts.splice(gs, 1);
					const other = parts.slice(0);
					other[gs] = "**";
					globParts.push(other);
					gs--;
				}
				if (!this.preserveMultipleSlashes) {
					for (let i = 1; i < parts.length - 1; i++) {
						const p = parts[i];
						if (i === 1 && p === "" && parts[0] === "") continue;
						if (p === "." || p === "") {
							didSomething = true;
							parts.splice(i, 1);
							i--;
						}
					}
					if (parts[0] === "." && parts.length === 2 && (parts[1] === "." || parts[1] === "")) {
						didSomething = true;
						parts.pop();
					}
				}
				let dd = 0;
				while (-1 !== (dd = parts.indexOf("..", dd + 1))) {
					const p = parts[dd - 1];
					if (p && p !== "." && p !== ".." && p !== "**") {
						didSomething = true;
						const splin = dd === 1 && parts[dd + 1] === "**" ? ["."] : [];
						parts.splice(dd - 1, 2, ...splin);
						if (parts.length === 0) parts.push("");
						dd -= 2;
					}
				}
			}
		} while (didSomething);
		return globParts;
	}
	secondPhasePreProcess(globParts) {
		for (let i = 0; i < globParts.length - 1; i++) for (let j = i + 1; j < globParts.length; j++) {
			const matched = this.partsMatch(globParts[i], globParts[j], !this.preserveMultipleSlashes);
			if (!matched) continue;
			globParts[i] = matched;
			globParts[j] = [];
		}
		return globParts.filter((gs) => gs.length);
	}
	partsMatch(a, b, emptyGSMatch = false) {
		let ai = 0;
		let bi = 0;
		let result = [];
		let which = "";
		while (ai < a.length && bi < b.length) if (a[ai] === b[bi]) {
			result.push(which === "b" ? b[bi] : a[ai]);
			ai++;
			bi++;
		} else if (emptyGSMatch && a[ai] === "**" && b[bi] === a[ai + 1]) {
			result.push(a[ai]);
			ai++;
		} else if (emptyGSMatch && b[bi] === "**" && a[ai] === b[bi + 1]) {
			result.push(b[bi]);
			bi++;
		} else if (a[ai] === "*" && b[bi] && (this.options.dot || !b[bi].startsWith(".")) && b[bi] !== "**") {
			if (which === "b") return false;
			which = "a";
			result.push(a[ai]);
			ai++;
			bi++;
		} else if (b[bi] === "*" && a[ai] && (this.options.dot || !a[ai].startsWith(".")) && a[ai] !== "**") {
			if (which === "a") return false;
			which = "b";
			result.push(b[bi]);
			ai++;
			bi++;
		} else return false;
		return a.length === b.length && result;
	}
	parseNegate() {
		if (this.nonegate) return;
		const pattern = this.pattern;
		let negate = false;
		let negateOffset = 0;
		for (let i = 0; i < pattern.length && pattern.charAt(i) === "!"; i++) {
			negate = !negate;
			negateOffset++;
		}
		if (negateOffset) this.pattern = pattern.slice(negateOffset);
		this.negate = negate;
	}
	matchOne(file, pattern, partial = false) {
		const options = this.options;
		if (this.isWindows) {
			const fileUNC = file[0] === "" && file[1] === "" && file[2] === "?" && typeof file[3] === "string" && /^[a-z]:$/i.test(file[3]);
			const patternUNC = pattern[0] === "" && pattern[1] === "" && pattern[2] === "?" && typeof pattern[3] === "string" && /^[a-z]:$/i.test(pattern[3]);
			if (fileUNC && patternUNC) {
				const fd = file[3];
				const pd = pattern[3];
				if (fd.toLowerCase() === pd.toLowerCase()) file[3] = pd;
			} else if (patternUNC && typeof file[0] === "string") {
				const pd = pattern[3];
				const fd = file[0];
				if (pd.toLowerCase() === fd.toLowerCase()) {
					pattern[3] = fd;
					pattern = pattern.slice(3);
				}
			} else if (fileUNC && typeof pattern[0] === "string") {
				const fd = file[3];
				if (fd.toLowerCase() === pattern[0].toLowerCase()) {
					pattern[0] = fd;
					file = file.slice(3);
				}
			}
		}
		const { optimizationLevel = 1 } = this.options;
		if (optimizationLevel >= 2) file = this.levelTwoFileOptimize(file);
		this.debug("matchOne", this, {
			file,
			pattern
		});
		this.debug("matchOne", file.length, pattern.length);
		for (var fi = 0, pi = 0, fl = file.length, pl = pattern.length; fi < fl && pi < pl; fi++, pi++) {
			this.debug("matchOne loop");
			var p = pattern[pi];
			var f = file[fi];
			this.debug(pattern, p, f);
			/* c8 ignore start */
			if (p === false) return false;
			/* c8 ignore stop */
			if (p === GLOBSTAR) {
				this.debug("GLOBSTAR", [
					pattern,
					p,
					f
				]);
				var fr = fi;
				var pr = pi + 1;
				if (pr === pl) {
					this.debug("** at the end");
					for (; fi < fl; fi++) if (file[fi] === "." || file[fi] === ".." || !options.dot && file[fi].charAt(0) === ".") return false;
					return true;
				}
				while (fr < fl) {
					var swallowee = file[fr];
					this.debug("\nglobstar while", file, fr, pattern, pr, swallowee);
					if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
						this.debug("globstar found match!", fr, fl, swallowee);
						return true;
					} else {
						if (swallowee === "." || swallowee === ".." || !options.dot && swallowee.charAt(0) === ".") {
							this.debug("dot detected!", file, fr, pattern, pr);
							break;
						}
						this.debug("globstar swallow a segment, and continue");
						fr++;
					}
				}
				/* c8 ignore start */
				if (partial) {
					this.debug("\n>>> no match, partial?", file, fr, pattern, pr);
					if (fr === fl) return true;
				}
				/* c8 ignore stop */
				return false;
			}
			let hit;
			if (typeof p === "string") {
				hit = f === p;
				this.debug("string match", p, f, hit);
			} else {
				hit = p.test(f);
				this.debug("pattern match", p, f, hit);
			}
			if (!hit) return false;
		}
		if (fi === fl && pi === pl) return true;
		else if (fi === fl) return partial;
		else if (pi === pl) return fi === fl - 1 && file[fi] === "";
		else throw new Error("wtf?");
		/* c8 ignore stop */
	}
	braceExpand() {
		return braceExpand(this.pattern, this.options);
	}
	parse(pattern) {
		assertValidPattern(pattern);
		const options = this.options;
		if (pattern === "**") return GLOBSTAR;
		if (pattern === "") return "";
		let m;
		let fastTest = null;
		if (m = pattern.match(starRE)) fastTest = options.dot ? starTestDot : starTest;
		else if (m = pattern.match(starDotExtRE)) fastTest = (options.nocase ? options.dot ? starDotExtTestNocaseDot : starDotExtTestNocase : options.dot ? starDotExtTestDot : starDotExtTest)(m[1]);
		else if (m = pattern.match(qmarksRE)) fastTest = (options.nocase ? options.dot ? qmarksTestNocaseDot : qmarksTestNocase : options.dot ? qmarksTestDot : qmarksTest)(m);
		else if (m = pattern.match(starDotStarRE)) fastTest = options.dot ? starDotStarTestDot : starDotStarTest;
		else if (m = pattern.match(dotStarRE)) fastTest = dotStarTest;
		let re = "";
		let hasMagic = false;
		let escaping = false;
		const patternListStack = [];
		const negativeLists = [];
		let stateChar = false;
		let uflag = false;
		let pl;
		let dotTravAllowed = pattern.charAt(0) === ".";
		let dotFileAllowed = options.dot || dotTravAllowed;
		const patternStart = () => dotTravAllowed ? "" : dotFileAllowed ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)";
		const subPatternStart = (p) => p.charAt(0) === "." ? "" : options.dot ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)";
		const clearStateChar = () => {
			if (stateChar) {
				switch (stateChar) {
					case "*":
						re += star;
						hasMagic = true;
						break;
					case "?":
						re += qmark;
						hasMagic = true;
						break;
					default:
						re += "\\" + stateChar;
						break;
				}
				this.debug("clearStateChar %j %j", stateChar, re);
				stateChar = false;
			}
		};
		for (let i = 0, c; i < pattern.length && (c = pattern.charAt(i)); i++) {
			this.debug("%s	%s %s %j", pattern, i, re, c);
			if (escaping) {
				/* c8 ignore start */
				if (c === "/") return false;
				/* c8 ignore stop */
				if (reSpecials[c]) re += "\\";
				re += c;
				escaping = false;
				continue;
			}
			switch (c) {
				case "/": return false;
				case "\\":
					clearStateChar();
					escaping = true;
					continue;
				case "?":
				case "*":
				case "+":
				case "@":
				case "!":
					this.debug("%s	%s %s %j <-- stateChar", pattern, i, re, c);
					this.debug("call clearStateChar %j", stateChar);
					clearStateChar();
					stateChar = c;
					if (options.noext) clearStateChar();
					continue;
				case "(": {
					if (!stateChar) {
						re += "\\(";
						continue;
					}
					const plEntry = {
						type: stateChar,
						start: i - 1,
						reStart: re.length,
						open: plTypes[stateChar].open,
						close: plTypes[stateChar].close
					};
					this.debug(this.pattern, "	", plEntry);
					patternListStack.push(plEntry);
					re += plEntry.open;
					if (plEntry.start === 0 && plEntry.type !== "!") {
						dotTravAllowed = true;
						re += subPatternStart(pattern.slice(i + 1));
					}
					this.debug("plType %j %j", stateChar, re);
					stateChar = false;
					continue;
				}
				case ")": {
					const plEntry = patternListStack[patternListStack.length - 1];
					if (!plEntry) {
						re += "\\)";
						continue;
					}
					patternListStack.pop();
					clearStateChar();
					hasMagic = true;
					pl = plEntry;
					re += pl.close;
					if (pl.type === "!") negativeLists.push(Object.assign(pl, { reEnd: re.length }));
					continue;
				}
				case "|": {
					const plEntry = patternListStack[patternListStack.length - 1];
					if (!plEntry) {
						re += "\\|";
						continue;
					}
					clearStateChar();
					re += "|";
					if (plEntry.start === 0 && plEntry.type !== "!") {
						dotTravAllowed = true;
						re += subPatternStart(pattern.slice(i + 1));
					}
					continue;
				}
				case "[":
					clearStateChar();
					const [src, needUflag, consumed, magic] = parseClass(pattern, i);
					if (consumed) {
						re += src;
						uflag = uflag || needUflag;
						i += consumed - 1;
						hasMagic = hasMagic || magic;
					} else re += "\\[";
					continue;
				case "]":
					re += "\\" + c;
					continue;
				default:
					clearStateChar();
					re += regExpEscape(c);
					break;
			}
		}
		for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
			let tail;
			tail = re.slice(pl.reStart + pl.open.length);
			this.debug(this.pattern, "setting tail", re, pl);
			tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, (_, $1, $2) => {
				if (!$2) $2 = "\\";
				/* c8 ignore stop */
				return $1 + $1 + $2 + "|";
			});
			this.debug("tail=%j\n   %s", tail, tail, pl, re);
			const t = pl.type === "*" ? star : pl.type === "?" ? qmark : "\\" + pl.type;
			hasMagic = true;
			re = re.slice(0, pl.reStart) + t + "\\(" + tail;
		}
		clearStateChar();
		if (escaping) re += "\\\\";
		const addPatternStart = addPatternStartSet[re.charAt(0)];
		for (let n = negativeLists.length - 1; n > -1; n--) {
			const nl = negativeLists[n];
			const nlBefore = re.slice(0, nl.reStart);
			const nlFirst = re.slice(nl.reStart, nl.reEnd - 8);
			let nlAfter = re.slice(nl.reEnd);
			const nlLast = re.slice(nl.reEnd - 8, nl.reEnd) + nlAfter;
			const closeParensBefore = nlBefore.split(")").length;
			const openParensBefore = nlBefore.split("(").length - closeParensBefore;
			let cleanAfter = nlAfter;
			for (let i = 0; i < openParensBefore; i++) cleanAfter = cleanAfter.replace(/\)[+*?]?/, "");
			nlAfter = cleanAfter;
			const dollar = nlAfter === "" ? "(?:$|\\/)" : "";
			re = nlBefore + nlFirst + nlAfter + dollar + nlLast;
		}
		if (re !== "" && hasMagic) re = "(?=.)" + re;
		if (addPatternStart) re = patternStart() + re;
		if (options.nocase && !hasMagic && !options.nocaseMagicOnly) hasMagic = pattern.toUpperCase() !== pattern.toLowerCase();
		if (!hasMagic) return globUnescape(re);
		const flags = (options.nocase ? "i" : "") + (uflag ? "u" : "");
		try {
			const ext$1 = fastTest ? {
				_glob: pattern,
				_src: re,
				test: fastTest
			} : {
				_glob: pattern,
				_src: re
			};
			return Object.assign(new RegExp("^" + re + "$", flags), ext$1);
		} catch (er) {
			this.debug("invalid regexp", er);
			return /* @__PURE__ */ new RegExp("$.");
		}
		/* c8 ignore stop */
	}
	makeRe() {
		if (this.regexp || this.regexp === false) return this.regexp;
		const set = this.set;
		if (!set.length) {
			this.regexp = false;
			return this.regexp;
		}
		const options = this.options;
		const twoStar = options.noglobstar ? star : options.dot ? twoStarDot : twoStarNoDot;
		const flags = options.nocase ? "i" : "";
		let re = set.map((pattern) => {
			const pp = pattern.map((p) => typeof p === "string" ? regExpEscape(p) : p === GLOBSTAR ? GLOBSTAR : p._src);
			pp.forEach((p, i) => {
				const next = pp[i + 1];
				const prev = pp[i - 1];
				if (p !== GLOBSTAR || prev === GLOBSTAR) return;
				if (prev === void 0) if (next !== void 0 && next !== GLOBSTAR) pp[i + 1] = "(?:\\/|" + twoStar + "\\/)?" + next;
				else pp[i] = twoStar;
				else if (next === void 0) pp[i - 1] = prev + "(?:\\/|" + twoStar + ")?";
				else if (next !== GLOBSTAR) {
					pp[i - 1] = prev + "(?:\\/|\\/" + twoStar + "\\/)" + next;
					pp[i + 1] = GLOBSTAR;
				}
			});
			return pp.filter((p) => p !== GLOBSTAR).join("/");
		}).join("|");
		re = "^(?:" + re + ")$";
		if (this.negate) re = "^(?!" + re + ").*$";
		try {
			this.regexp = new RegExp(re, flags);
		} catch (ex) {
			this.regexp = false;
		}
		/* c8 ignore stop */
		return this.regexp;
	}
	slashSplit(p) {
		if (this.preserveMultipleSlashes) return p.split("/");
		else if (this.isWindows && /^\/\/[^\/]+/.test(p)) return ["", ...p.split(/\/+/)];
		else return p.split(/\/+/);
	}
	match(f, partial = this.partial) {
		this.debug("match", f, this.pattern);
		if (this.comment) return false;
		if (this.empty) return f === "";
		if (f === "/" && partial) return true;
		const options = this.options;
		if (this.isWindows) f = f.split("\\").join("/");
		const ff = this.slashSplit(f);
		this.debug(this.pattern, "split", ff);
		const set = this.set;
		this.debug(this.pattern, "set", set);
		let filename = ff[ff.length - 1];
		if (!filename) for (let i = ff.length - 2; !filename && i >= 0; i--) filename = ff[i];
		for (let i = 0; i < set.length; i++) {
			const pattern = set[i];
			let file = ff;
			if (options.matchBase && pattern.length === 1) file = [filename];
			if (this.matchOne(file, pattern, partial)) {
				if (options.flipNegate) return true;
				return !this.negate;
			}
		}
		if (options.flipNegate) return false;
		return this.negate;
	}
	static defaults(def) {
		return minimatch.defaults(def).Minimatch;
	}
};
/* c8 ignore stop */
minimatch.Minimatch = Minimatch;
minimatch.escape = escape;
minimatch.unescape = unescape;

//#endregion
//#region src/dialects/pull-utils.ts
const prepareEntityFilter = (dialect, params, existingEntities) => {
	const tablesConfig = typeof params.tables === "undefined" ? [] : typeof params.tables === "string" ? [params.tables] : params.tables;
	const schemasFilter = prepareSchemasFitler(typeof params.schemas === "undefined" ? [] : typeof params.schemas === "string" ? [params.schemas] : params.schemas, existingEntities.filter((x) => x.type === "schema").map((x) => x.name));
	const postgisTablesGlobs = [
		"!geography_columns",
		"!geometry_columns",
		"!spatial_ref_sys"
	];
	for (const ext$1 of params.extensions ?? []) if (ext$1 === "postgis") tablesConfig.push(...postgisTablesGlobs);
	else require_utils.assertUnreachable(ext$1);
	const tablesFilter = prepareTablesFilter(tablesConfig, existingEntities.filter((x) => x.type === "table").map((x) => ({
		schema: x.schema,
		name: x.name
	})));
	const rolesFilter = prepareRolesFilter(params.entities);
	const filter$1 = (it) => {
		if (it.type === "schema") return schemasFilter(it);
		if (it.type === "table") {
			if (it.schema === false) return tablesFilter(it);
			return schemasFilter({
				type: "schema",
				name: it.schema
			}) && tablesFilter(it);
		}
		if (it.type === "role") return rolesFilter(it);
		require_utils.assertUnreachable(it);
	};
	return (it) => {
		return filter$1(it);
	};
};
const prepareSchemasFitler = (globs, schemasExisting) => {
	const filterForExisting = (it) => {
		return !schemasExisting.some((x) => it.name === x);
	};
	const matchers = globs.map((it) => {
		return new Minimatch(it);
	});
	if (matchers.length === 0 && schemasExisting.length === 0) return () => true;
	if (matchers.length === 0) return filterForExisting;
	return (it) => {
		if (!filterForExisting(it)) return false;
		const flags = [];
		for (let matcher of matchers) if (matcher.negate && !matcher.match(it.name)) flags.push(false);
		else if (matcher.match(it.name)) flags.push(true);
		if (flags.length > 0) return flags.every(Boolean);
		return false;
	};
};
const prepareTablesFilter = (globs, existingViews) => {
	const existingFilter = (it) => {
		if (it.schema === false) return !existingViews.some((x) => x.name === it.name);
		return !existingViews.some((x) => x.schema === it.schema && x.name === it.name);
	};
	const matchers = globs.map((it) => {
		return new Minimatch(it);
	});
	if (matchers.length === 0 && existingViews.length === 0) return () => true;
	if (matchers.length === 0) return existingFilter;
	const filter$1 = (it) => {
		if (!existingFilter(it)) return false;
		let flags = [];
		for (let matcher of matchers) if (matcher.negate && !matcher.match(it.name)) flags.push(false);
		else if (matcher.match(it.name)) flags.push(true);
		if (flags.length > 0) return flags.every(Boolean);
		return false;
	};
	return filter$1;
};
const prepareRolesFilter = (entities) => {
	if (!entities || !entities.roles) return () => false;
	const roles = entities.roles;
	const include = typeof roles === "object" ? roles.include ?? [] : [];
	const exclude = typeof roles === "object" ? roles.exclude ?? [] : [];
	const provider = typeof roles === "object" ? roles.provider : void 0;
	if (provider === "supabase") exclude.push("anon", "authenticator", "authenticated", "service_role", "supabase_auth_admin", "supabase_storage_admin", "dashboard_user", "supabase_admin");
	if (provider === "neon") exclude.push("authenticated", "anonymous");
	if (!(typeof roles === "boolean" ? roles : include.length > 0 || exclude.length > 0)) return () => false;
	if (!include.length && !exclude.length) return () => true;
	const rolesFilter = (it) => {
		const notExcluded = !exclude.length || !exclude.includes(it.name);
		const included = !include.length || include.includes(it.name);
		return notExcluded && included;
	};
	return rolesFilter;
};

//#endregion
Object.defineProperty(exports, 'prepareEntityFilter', {
  enumerable: true,
  get: function () {
    return prepareEntityFilter;
  }
});