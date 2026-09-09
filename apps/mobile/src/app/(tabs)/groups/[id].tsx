import { useLocalSearchParams, useRouter } from "expo-router";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Screen } from "@/components/ui/screen";

/** Route: `/groups/[id]`. Reads the dynamic segment; no data behind it. */
export default function GroupDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();

	return (
		<Screen title="Group" subtitle={`Route: /groups/[id] — id = ${id}`}>
			<Card>
				<CardTitle>{id}</CardTitle>
				<CardDescription>
					Placeholder detail screen. The segment above comes from
					`useLocalSearchParams`.
				</CardDescription>
			</Card>
			<Button
				label="Go back"
				variant="outlined"
				onPress={() => router.back()}
			/>
		</Screen>
	);
}
