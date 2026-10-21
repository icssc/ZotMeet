import type { NativeRedirectUriOptions } from "@zotmeet/shared";
import Constants from "expo-constants";

/**
 * The app's answer to "which callback links are mine" — the same allowlist
 * the web app applies (`isAllowedNativeRedirectUri`), fed from the app's
 * side: development links are fine in a dev bundle, and an EAS Update link
 * is fine for the project this bundle was published under. The project id
 * is what `app.config.ts` put in `extra.eas.projectId` at export time, so a
 * PR preview knows it and a plain `expo start` (which needs no EAS) does not.
 */
export function nativeRedirectUriOptions(): NativeRedirectUriOptions {
	const projectId: unknown = Constants.expoConfig?.extra?.eas?.projectId;
	return {
		allowDevelopment: __DEV__,
		easProjectId: typeof projectId === "string" ? projectId : null,
	};
}
