const require_chunk = require('./chunk-CdAKIUsw.js');

//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/client/emitWarningIfUnsupportedVersion.js
var state, emitWarningIfUnsupportedVersion;
var init_emitWarningIfUnsupportedVersion = require_chunk.__esmMin((() => {
	state = { warningEmitted: false };
	emitWarningIfUnsupportedVersion = (version) => {
		if (version && !state.warningEmitted && parseInt(version.substring(1, version.indexOf("."))) < 18) {
			state.warningEmitted = true;
			process.emitWarning(`NodeDeprecationWarning: The AWS SDK for JavaScript (v3) will
no longer support Node.js 16.x on January 6, 2025.

To continue receiving updates to AWS services, bug fixes, and security
updates please upgrade to a supported Node.js LTS version.

More information can be found at: https://a.co/74kJMmI`);
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/client/setCredentialFeature.js
function setCredentialFeature(credentials, feature, value) {
	if (!credentials.$source) credentials.$source = {};
	credentials.$source[feature] = value;
	return credentials;
}
var init_setCredentialFeature = require_chunk.__esmMin((() => {}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/client/setFeature.js
function setFeature(context, feature, value) {
	if (!context.__aws_sdk_context) context.__aws_sdk_context = { features: {} };
	else if (!context.__aws_sdk_context.features) context.__aws_sdk_context.features = {};
	context.__aws_sdk_context.features[feature] = value;
}
var init_setFeature = require_chunk.__esmMin((() => {}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/client/setTokenFeature.js
function setTokenFeature(token, feature, value) {
	if (!token.$source) token.$source = {};
	token.$source[feature] = value;
	return token;
}
var init_setTokenFeature = require_chunk.__esmMin((() => {}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/client/index.js
var client_exports = /* @__PURE__ */ require_chunk.__exportAll({
	emitWarningIfUnsupportedVersion: () => emitWarningIfUnsupportedVersion,
	setCredentialFeature: () => setCredentialFeature,
	setFeature: () => setFeature,
	setTokenFeature: () => setTokenFeature,
	state: () => state
});
var init_client = require_chunk.__esmMin((() => {
	init_emitWarningIfUnsupportedVersion();
	init_setCredentialFeature();
	init_setFeature();
	init_setTokenFeature();
}));

//#endregion
Object.defineProperty(exports, 'client_exports', {
  enumerable: true,
  get: function () {
    return client_exports;
  }
});
Object.defineProperty(exports, 'emitWarningIfUnsupportedVersion', {
  enumerable: true,
  get: function () {
    return emitWarningIfUnsupportedVersion;
  }
});
Object.defineProperty(exports, 'init_client', {
  enumerable: true,
  get: function () {
    return init_client;
  }
});
Object.defineProperty(exports, 'setCredentialFeature', {
  enumerable: true,
  get: function () {
    return setCredentialFeature;
  }
});
Object.defineProperty(exports, 'setFeature', {
  enumerable: true,
  get: function () {
    return setFeature;
  }
});
Object.defineProperty(exports, 'setTokenFeature', {
  enumerable: true,
  get: function () {
    return setTokenFeature;
  }
});
Object.defineProperty(exports, 'state', {
  enumerable: true,
  get: function () {
    return state;
  }
});