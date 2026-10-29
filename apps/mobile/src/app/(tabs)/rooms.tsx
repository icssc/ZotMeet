import { ScrollView, View } from "react-native";
import SearchBar from "@/components/studyrooms/searchbar";
import { Card } from "@/components/ui/card";
import { Screen } from "@/components/ui/screen";

const availabilityColor = "#86efac";
const notAvailableColor = "#fca5a5";

export default function RoomsScreen() {
	return (
		<Screen title="Rooms">
			<ScrollView className="flex-1">{/* heatmap, legend, etc. */}</ScrollView>
			<SearchBar />
		</Screen>
	);
}
