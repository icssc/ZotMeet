import { Link } from "expo-router";
import { Pressable } from "react-native";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Screen } from "@/components/ui/screen";

/** Route: `/groups`. Each row pushes the dynamic `/groups/[id]` route. */
const GROUP_IDS = ["icssc-projects", "cs-161", "capstone"];

export default function GroupsScreen() {
	return (
		<Screen title="Groups" subtitle="Route: /groups">
			{GROUP_IDS.map((id) => (
				<Link key={id} href={`/groups/${id}`} asChild>
					<Pressable className="active:opacity-70">
						<Card>
							<CardTitle>{id}</CardTitle>
							<CardDescription>Tap to push /groups/{id}</CardDescription>
						</Card>
					</Pressable>
				</Link>
			))}
		</Screen>
	);
}
