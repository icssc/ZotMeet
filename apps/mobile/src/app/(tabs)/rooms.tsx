import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Screen } from "@/components/ui/screen";

/**
 * Route: `/rooms`. Placeholder for the web app's `/studyrooms`. Shown in the
 * tab bar only while signed out, where it takes Availability's slot.
 */
export default function RoomsScreen() {
	return (
		<Screen title="Rooms" subtitle="Route: /rooms">
			<Card>
				<CardTitle>Nothing here yet</CardTitle>
				<CardDescription>
					Study room search is future work; this tab mirrors the web's Rooms
					entry for signed-out visitors.
				</CardDescription>
			</Card>
		</Screen>
	);
}
