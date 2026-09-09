import { Link } from "expo-router";
import { Button } from "@/components/ui/button";
import { Screen } from "@/components/ui/screen";
import { Text } from "@/components/ui/text";

export default function NotFoundScreen() {
	return (
		<Screen title="Not found" subtitle="Route: +not-found">
			<Text className="text-muted-foreground">No route matched that path.</Text>
			<Link href="/" asChild>
				<Button label="Back to Meetings" variant="outlined" />
			</Link>
		</Screen>
	);
}
