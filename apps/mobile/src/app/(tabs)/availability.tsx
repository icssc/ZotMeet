import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Screen } from "@/components/ui/screen";

/** Route: `/availability`. Placeholder — the drag-select grid is future work. */
export default function AvailabilityScreen() {
	return (
		<Screen title="Availability" subtitle="Route: /availability">
			<Card>
				<CardTitle>Nothing here yet</CardTitle>
				<CardDescription>
					The draggable availability grid is deliberately out of scope. The
					gesture/reanimated/haptics dependencies it will need are installed but
					unused.
				</CardDescription>
			</Card>
		</Screen>
	);
}
