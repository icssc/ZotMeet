/**
 * A signed-in user as both apps see them: the `users` row joined to its
 * `members` row, minus anything sensitive. The web app selects exactly these
 * columns (`userProfileProjection` in `src/lib/auth/user.ts`); the mobile app
 * receives the same shape from `GET /api/auth/session`.
 */
export type UserProfile = {
	id: string;
	email: string;
	memberId: string;
	displayName: string;
	googleName: string | null;
	username: string | null;
	year: string | null;
	school: string | null;
	profilePicture: string | null;
};
