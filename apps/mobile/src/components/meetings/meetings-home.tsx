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
					accessibilityLabel="Create meeting"
					className="mt-4 self-start bg-primary"
					onPress={() => router.push("/create-meeting")}
					size="medium"
				>
					<Plus className="text-primary-foreground" size={20} />
				</IconButton>
			</Card>
		</Screen>
	);
}
