import { useColorScheme } from "nativewind";
import { useState } from "react";
import { SignIn } from "@/components/auth/sign-in";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Screen } from "@/components/ui/screen";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Route: `/profile`. Signed out, this is the sign-in page — the tab itself
 * reads "Sign In" then, as on the web. Signed in, a placeholder that carries
 * the rn-primitives Dialog demo and a theme toggle, which is the quickest way
 * to eyeball the light/dark tokens.
 */
export default function ProfileScreen() {
	const { colorScheme, toggleColorScheme } = useColorScheme();
	const [open, setOpen] = useState(false);
	const user = useAuthStore((state) => state.user);
	const signOut = useAuthStore((state) => state.signOut);

	if (!user) {
		return <SignIn />;
	}

	return (
		<Screen title="Profile" subtitle={user.email}>
			<Card>
				<CardTitle>{user.displayName}</CardTitle>
				<CardDescription>{user.email}</CardDescription>
				<Button
					className="mt-3"
					variant="outlined"
					size="small"
					label="Sign out"
					onPress={signOut}
				/>
			</Card>

			<Card>
				<CardTitle>Theme</CardTitle>
				<CardDescription>
					Currently {colorScheme === "dark" ? "dark" : "light"}.
				</CardDescription>
				<Button
					className="mt-3"
					variant="outlined"
					size="small"
					label="Toggle theme"
					onPress={toggleColorScheme}
				/>
			</Card>

			{/* Smoke test for the rn-primitives Dialog + PortalHost wiring. */}
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button color="secondary" label="Open dialog" variant="contained" />
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>rn-primitives Dialog</DialogTitle>
						<DialogDescription>
							Rendered through the PortalHost in the root layout.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<DialogClose asChild>
							<Button label="Close" size="small" variant="outlined" />
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</Screen>
	);
}
