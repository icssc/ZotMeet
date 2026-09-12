import { create } from "zustand";

/**
 * Who is signed in, if anyone. Front-end only for now: nothing here talks to
 * the API, and the mocked `signIn` exists so both the signed-out and
 * signed-in chrome can be eyeballed before a real native OAuth flow lands
 * (see `src/lib/api/client.ts` for the bearer-token story).
 */
export type AuthProvider = "google" | "apple";

export interface AuthUser {
	displayName: string;
	email: string;
}

interface AuthStore {
	user: AuthUser | null;
	/** TODO(mobile-auth): kick off the provider's OAuth flow. */
	signIn: (provider: AuthProvider) => void;
	/** TODO(mobile-auth): revoke the session token. */
	signOut: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
	user: null,
	signIn: (provider) =>
		set({
			user: {
				displayName: "Peter Anteater",
				email: `peter@${provider}.example`,
			},
		}),
	signOut: () => set({ user: null }),
}));
