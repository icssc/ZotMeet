import Legend from "@/components/studyrooms/legend";
import { Card } from "@/components/ui/card";
import { Screen } from "@/components/ui/screen";

const availabilityColor = "#86efac";
const notAvailableColor = "#fca5a5";

export default function RoomsScreen() {
	return (
		<Screen title="Rooms">
			<Card>
				<Legend
					availabilityColor={availabilityColor}
					notAvailableColor={notAvailableColor}
				/>
			</Card>
		</Screen>
	);
}
