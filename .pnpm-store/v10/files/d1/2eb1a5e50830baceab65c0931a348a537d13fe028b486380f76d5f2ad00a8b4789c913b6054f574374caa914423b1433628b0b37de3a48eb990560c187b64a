const require_chunk = require('./chunk-CdAKIUsw.js');

//#region ../node_modules/.pnpm/balanced-match@1.0.2/node_modules/balanced-match/index.js
var require_balanced_match = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	module.exports = balanced;
	function balanced(a, b, str) {
		if (a instanceof RegExp) a = maybeMatch(a, str);
		if (b instanceof RegExp) b = maybeMatch(b, str);
		var r = range(a, b, str);
		return r && {
			start: r[0],
			end: r[1],
			pre: str.slice(0, r[0]),
			body: str.slice(r[0] + a.length, r[1]),
			post: str.slice(r[1] + b.length)
		};
	}
	function maybeMatch(reg, str) {
		var m = str.match(reg);
		return m ? m[0] : null;
	}
	balanced.range = range;
	function range(a, b, str) {
		var begs, beg, left, right, result;
		var ai = str.indexOf(a);
		var bi = str.indexOf(b, ai + 1);
		var i = ai;
		if (ai >= 0 && bi > 0) {
			if (a === b) return [ai, bi];
			begs = [];
			left = str.length;
			while (i >= 0 && !result) {
				if (i == ai) {
					begs.push(i);
					ai = str.indexOf(a, i + 1);
				} else if (begs.length == 1) result = [begs.pop(), bi];
				else {
					beg = begs.pop();
					if (beg < left) {
						left = beg;
						right = bi;
					}
					bi = str.indexOf(b, i + 1);
				}
				i = ai < bi && ai >= 0 ? ai : bi;
			}
			if (begs.length) result = [left, right];
		}
		return result;
	}
}));

//#endregion
//#region ../node_modules/.pnpm/brace-expansion@2.0.2/node_modules/brace-expansion/index.js
var require_brace_expansion = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var balanced = require_balanced_match();
	module.exports = expandTop;
	var escSlash = "\0SLASH" + Math.random() + "\0";
	var escOpen = "\0OPEN" + Math.random() + "\0";
	var escClose = "\0CLOSE" + Math.random() + "\0";
	var escComma = "\0COMMA" + Math.random() + "\0";
	var escPeriod = "\0PERIOD" + Math.random() + "\0";
	function numeric(str) {
		return parseInt(str, 10) == str ? parseInt(str, 10) : str.charCodeAt(0);
	}
	function escapeBraces(str) {
		return str.split("\\\\").join(escSlash).split("\\{").join(escOpen).split("\\}").join(escClose).split("\\,").join(escComma).split("\\.").join(escPeriod);
	}
	function unescapeBraces(str) {
		return str.split(escSlash).join("\\").split(escOpen).join("{").split(escClose).join("}").split(escComma).join(",").split(escPeriod).join(".");
	}
	function parseCommaParts(str) {
		if (!str) return [""];
		var parts = [];
		var m = balanced("{", "}", str);
		if (!m) return str.split(",");
		var pre = m.pre;
		var body = m.body;
		var post = m.post;
		var p = pre.split(",");
		p[p.length - 1] += "{" + body + "}";
		var postParts = parseCommaParts(post);
		if (post.length) {
			p[p.length - 1] += postParts.shift();
			p.push.apply(p, postParts);
		}
		parts.push.apply(parts, p);
		return parts;
	}
	function expandTop(str) {
		if (!str) return [];
		if (str.substr(0, 2) === "{}") str = "\\{\\}" + str.substr(2);
		return expand(escapeBraces(str), true).map(unescapeBraces);
	}
	function embrace(str) {
		return "{" + str + "}";
	}
	function isPadded(el) {
		return /^-?0\d/.test(el);
	}
	function lte(i, y) {
		return i <= y;
	}
	function gte(i, y) {
		return i >= y;
	}
	function expand(str, isTop) {
		var expansions = [];
		var m = balanced("{", "}", str);
		if (!m) return [str];
		var pre = m.pre;
		var post = m.post.length ? expand(m.post, false) : [""];
		if (/\$$/.test(m.pre)) for (var k = 0; k < post.length; k++) {
			var expansion = pre + "{" + m.body + "}" + post[k];
			expansions.push(expansion);
		}
		else {
			var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
			var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
			var isSequence = isNumericSequence || isAlphaSequence;
			var isOptions = m.body.indexOf(",") >= 0;
			if (!isSequence && !isOptions) {
				if (m.post.match(/,(?!,).*\}/)) {
					str = m.pre + "{" + m.body + escClose + m.post;
					return expand(str);
				}
				return [str];
			}
			var n;
			if (isSequence) n = m.body.split(/\.\./);
			else {
				n = parseCommaParts(m.body);
				if (n.length === 1) {
					n = expand(n[0], false).map(embrace);
					if (n.length === 1) return post.map(function(p) {
						return m.pre + n[0] + p;
					});
				}
			}
			var N;
			if (isSequence) {
				var x = numeric(n[0]);
				var y = numeric(n[1]);
				var width = Math.max(n[0].length, n[1].length);
				var incr = n.length == 3 ? Math.abs(numeric(n[2])) : 1;
				var test = lte;
				if (y < x) {
					incr *= -1;
					test = gte;
				}
				var pad = n.some(isPadded);
				N = [];
				for (var i = x; test(i, y); i += incr) {
					var c;
					if (isAlphaSequence) {
						c = String.fromCharCode(i);
						if (c === "\\") c = "";
					} else {
						c = String(i);
						if (pad) {
							var need = width - c.length;
							if (need > 0) {
								var z = new Array(need + 1).join("0");
								if (i < 0) c = "-" + z + c.slice(1);
								else c = z + c;
							}
						}
					}
					N.push(c);
				}
			} else {
				N = [];
				for (var j = 0; j < n.length; j++) N.push.apply(N, expand(n[j], false));
			}
			for (var j = 0; j < N.length; j++) for (var k = 0; k < post.length; k++) {
				var expansion = pre + N[j] + post[k];
				if (!isTop || isSequence || expansion) expansions.push(expansion);
			}
		}
		return expansions;
	}
}));

//#endregion
Object.defineProperty(exports, 'require_brace_expansion', {
  enumerable: true,
  get: function () {
    return require_brace_expansion;
  }
});