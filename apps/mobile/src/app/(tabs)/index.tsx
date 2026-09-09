import { useState } from "react";
import { Screen } from "@/components/ui/screen";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
	TabsTriggerText,
} from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";

/**
 * Route: `/` (the first tab).
 *
 * Placeholder only. The rn-primitives Tabs are here to prove the headless
 * primitive + NativeWind pattern works, not to build the real Meetings UI.
 */
export default function MeetingsScreen() {
	const [tab, setTab] = useState("upcoming");

	return (
		<Screen title="Meetings" subtitle="Route: /">
			<Tabs value={tab} onValueChange={setTab}>
				<TabsList>
					<TabsTrigger value="upcoming">
						<TabsTriggerText>Upcoming</TabsTriggerText>
					</TabsTrigger>
					<TabsTrigger value="past">
						<TabsTriggerText>Past</TabsTriggerText>
					</TabsTrigger>
				</TabsList>
				<TabsContent value="upcoming">
					<Text className="text-muted-foreground">
						Upcoming meetings go here.
					</Text>
				</TabsContent>
				<TabsContent value="past">
					<Text className="text-muted-foreground">Past meetings go here.</Text>
				</TabsContent>
			</Tabs>
		</Screen>
	);
}
