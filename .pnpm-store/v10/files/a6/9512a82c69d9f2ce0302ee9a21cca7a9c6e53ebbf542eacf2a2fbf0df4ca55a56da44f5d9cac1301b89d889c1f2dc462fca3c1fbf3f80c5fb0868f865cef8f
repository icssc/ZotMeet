const require_chunk = require('./chunk-CdAKIUsw.js');
const require_client = require('./client-BsEbA1K3.js');
const require_dist_cjs$3 = require('./dist-cjs-CxAZshVx.js');
const require_dist_cjs$4 = require('./dist-cjs-DrUzD-Vw.js');

//#region ../node_modules/.pnpm/@aws-sdk+credential-provider-process@3.940.0/node_modules/@aws-sdk/credential-provider-process/dist-cjs/index.js
var require_dist_cjs = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var sharedIniFileLoader = require_dist_cjs$4.require_dist_cjs();
	var propertyProvider = require_dist_cjs$3.require_dist_cjs();
	var child_process = require("child_process");
	var util = require("util");
	var client = (require_client.init_client(), require_chunk.__toCommonJS(require_client.client_exports));
	const getValidatedProcessCredentials = (profileName, data, profiles) => {
		if (data.Version !== 1) throw Error(`Profile ${profileName} credential_process did not return Version 1.`);
		if (data.AccessKeyId === void 0 || data.SecretAccessKey === void 0) throw Error(`Profile ${profileName} credential_process returned invalid credentials.`);
		if (data.Expiration) {
			const currentTime = /* @__PURE__ */ new Date();
			if (new Date(data.Expiration) < currentTime) throw Error(`Profile ${profileName} credential_process returned expired credentials.`);
		}
		let accountId = data.AccountId;
		if (!accountId && profiles?.[profileName]?.aws_account_id) accountId = profiles[profileName].aws_account_id;
		const credentials = {
			accessKeyId: data.AccessKeyId,
			secretAccessKey: data.SecretAccessKey,
			...data.SessionToken && { sessionToken: data.SessionToken },
			...data.Expiration && { expiration: new Date(data.Expiration) },
			...data.CredentialScope && { credentialScope: data.CredentialScope },
			...accountId && { accountId }
		};
		client.setCredentialFeature(credentials, "CREDENTIALS_PROCESS", "w");
		return credentials;
	};
	const resolveProcessCredentials = async (profileName, profiles, logger) => {
		const profile = profiles[profileName];
		if (profiles[profileName]) {
			const credentialProcess = profile["credential_process"];
			if (credentialProcess !== void 0) {
				const execPromise = util.promisify(sharedIniFileLoader.externalDataInterceptor?.getTokenRecord?.().exec ?? child_process.exec);
				try {
					const { stdout } = await execPromise(credentialProcess);
					let data;
					try {
						data = JSON.parse(stdout.trim());
					} catch {
						throw Error(`Profile ${profileName} credential_process returned invalid JSON.`);
					}
					return getValidatedProcessCredentials(profileName, data, profiles);
				} catch (error) {
					throw new propertyProvider.CredentialsProviderError(error.message, { logger });
				}
			} else throw new propertyProvider.CredentialsProviderError(`Profile ${profileName} did not contain credential_process.`, { logger });
		} else throw new propertyProvider.CredentialsProviderError(`Profile ${profileName} could not be found in shared credentials file.`, { logger });
	};
	const fromProcess = (init = {}) => async ({ callerClientConfig } = {}) => {
		init.logger?.debug("@aws-sdk/credential-provider-process - fromProcess");
		const profiles = await sharedIniFileLoader.parseKnownFiles(init);
		return resolveProcessCredentials(sharedIniFileLoader.getProfileName({ profile: init.profile ?? callerClientConfig?.profile }), profiles, init.logger);
	};
	exports.fromProcess = fromProcess;
}));

//#endregion
Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function () {
    return require_dist_cjs();
  }
});