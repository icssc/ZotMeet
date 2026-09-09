import { useColorScheme } from "nativewind";
import { useState } from "react";
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

/**
 * Route: `/profile`. Placeholder. Carries the rn-primitives Dialog demo and a
 * theme toggle, which is the quickest way to eyeball the light/dark tokens.
 */
export default function ProfileScreen() {
	const { colorScheme, toggleColorScheme } = useColorScheme();
	const [open, setOpen] = useState(false);

	return (
		<Screen title="Profile" subtitle="Route: /profile">
			<Card>
				<CardTitle>Theme</CardTitle>
				<CardDescription>
					Currently {colorScheme === "dark" ? "dark" : "light"}.
				</CardDescription>
				<Button
					className="mt-3"
					variant="outline"
					size="sm"
					label="Toggle theme"
					onPress={toggleColorScheme}
				/>
			</Card>

			{/* Smoke test for the rn-primitives Dialog + PortalHost wiring. */}
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button label="Open dialog" variant="secondary" />
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
							<Button label="Close" variant="outline" size="sm" />
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</Screen>
	);
}
