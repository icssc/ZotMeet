const require_chunk = require('./chunk-CdAKIUsw.js');
require('./dist-cjs-B9UsuYCY.js');
require('./dist-cjs-BMOAUmMP.js');
const require_client = require('./client-BsEbA1K3.js');
const require_dist_cjs$5 = require('./dist-cjs-CxAZshVx.js');
const require_dist_cjs$6 = require('./dist-cjs-DrUzD-Vw.js');
const require_sts = require('./sts-DO-EJLRz.js');

//#region ../node_modules/.pnpm/@aws-sdk+credential-provider-web-identity@3.940.0/node_modules/@aws-sdk/credential-provider-web-identity/dist-cjs/fromWebToken.js
var require_fromWebToken = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || (function() {
		var ownKeys = function(o) {
			ownKeys = Object.getOwnPropertyNames || function(o$1) {
				var ar = [];
				for (var k in o$1) if (Object.prototype.hasOwnProperty.call(o$1, k)) ar[ar.length] = k;
				return ar;
			};
			return ownKeys(o);
		};
		return function(mod) {
			if (mod && mod.__esModule) return mod;
			var result = {};
			if (mod != null) {
				for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
			}
			__setModuleDefault(result, mod);
			return result;
		};
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.fromWebToken = void 0;
	const fromWebToken = (init) => async (awsIdentityProperties) => {
		init.logger?.debug("@aws-sdk/credential-provider-web-identity - fromWebToken");
		const { roleArn, roleSessionName, webIdentityToken, providerId, policyArns, policy, durationSeconds } = init;
		let { roleAssumerWithWebIdentity } = init;
		if (!roleAssumerWithWebIdentity) {
			const { getDefaultRoleAssumerWithWebIdentity } = await Promise.resolve().then(() => __importStar((require_sts.init_sts(), require_chunk.__toCommonJS(require_sts.sts_exports))));
			roleAssumerWithWebIdentity = getDefaultRoleAssumerWithWebIdentity({
				...init.clientConfig,
				credentialProviderLogger: init.logger,
				parentClientConfig: {
					...awsIdentityProperties?.callerClientConfig,
					...init.parentClientConfig
				}
			}, init.clientPlugins);
		}
		return roleAssumerWithWebIdentity({
			RoleArn: roleArn,
			RoleSessionName: roleSessionName ?? `aws-sdk-js-session-${Date.now()}`,
			WebIdentityToken: webIdentityToken,
			ProviderId: providerId,
			PolicyArns: policyArns,
			Policy: policy,
			DurationSeconds: durationSeconds
		});
	};
	exports.fromWebToken = fromWebToken;
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+credential-provider-web-identity@3.940.0/node_modules/@aws-sdk/credential-provider-web-identity/dist-cjs/fromTokenFile.js
var require_fromTokenFile = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.fromTokenFile = void 0;
	const client_1 = (require_client.init_client(), require_chunk.__toCommonJS(require_client.client_exports));
	const property_provider_1 = require_dist_cjs$5.require_dist_cjs();
	const shared_ini_file_loader_1 = require_dist_cjs$6.require_dist_cjs();
	const fs_1 = require("fs");
	const fromWebToken_1 = require_fromWebToken();
	const ENV_TOKEN_FILE = "AWS_WEB_IDENTITY_TOKEN_FILE";
	const ENV_ROLE_ARN = "AWS_ROLE_ARN";
	const ENV_ROLE_SESSION_NAME = "AWS_ROLE_SESSION_NAME";
	const fromTokenFile = (init = {}) => async (awsIdentityProperties) => {
		init.logger?.debug("@aws-sdk/credential-provider-web-identity - fromTokenFile");
		const webIdentityTokenFile = init?.webIdentityTokenFile ?? process.env[ENV_TOKEN_FILE];
		const roleArn = init?.roleArn ?? process.env[ENV_ROLE_ARN];
		const roleSessionName = init?.roleSessionName ?? process.env[ENV_ROLE_SESSION_NAME];
		if (!webIdentityTokenFile || !roleArn) throw new property_provider_1.CredentialsProviderError("Web identity configuration not specified", { logger: init.logger });
		const credentials = await (0, fromWebToken_1.fromWebToken)({
			...init,
			webIdentityToken: shared_ini_file_loader_1.externalDataInterceptor?.getTokenRecord?.()[webIdentityTokenFile] ?? (0, fs_1.readFileSync)(webIdentityTokenFile, { encoding: "ascii" }),
			roleArn,
			roleSessionName
		})(awsIdentityProperties);
		if (webIdentityTokenFile === process.env[ENV_TOKEN_FILE]) (0, client_1.setCredentialFeature)(credentials, "CREDENTIALS_ENV_VARS_STS_WEB_ID_TOKEN", "h");
		return credentials;
	};
	exports.fromTokenFile = fromTokenFile;
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+credential-provider-web-identity@3.940.0/node_modules/@aws-sdk/credential-provider-web-identity/dist-cjs/index.js
var require_dist_cjs = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var fromTokenFile = require_fromTokenFile();
	var fromWebToken = require_fromWebToken();
	Object.keys(fromTokenFile).forEach(function(k) {
		if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
			enumerable: true,
			get: function() {
				return fromTokenFile[k];
			}
		});
	});
	Object.keys(fromWebToken).forEach(function(k) {
		if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
			enumerable: true,
			get: function() {
				return fromWebToken[k];
			}
		});
	});
}));

//#endregion
Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function () {
    return require_dist_cjs();
  }
});