import { useRouter } from "expo-router";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { Screen } from "@/components/ui/screen";
import { Plus } from "@/lib/icons";

export function MeetingsHome() {
	const router = useRouter();

	return (
		<Screen title="Meetings">
			<Card>
				<CardTitle>No meetings yet</CardTitle>
				<CardDescription>
					Create a meeting to collect availability and coordinate a time.
				</CardDescription>
				<Button
					className="mt-4"
					label="Create Meeting"
					onPress={() => router.push("/create-meeting")}
					size="large"
					variant="contained"
				/>
				<IconButton
					variant="contained"
					size={"medium"}
					onPress={() => router.push("/create-meeting")}
					accessibilityLabel="Create meeting"
				>
					<Plus size={20} />
				</IconButton>
			</Card>
		</Screen>
	);
}
