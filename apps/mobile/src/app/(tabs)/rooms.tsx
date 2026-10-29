import { ScrollView, View } from "react-native";
import SearchBar from "@/components/studyrooms/searchbar";
import { Card } from "@/components/ui/card";
import { Screen } from "@/components/ui/screen";

export default function RoomsScreen() {
	return (
		<Screen title="Rooms">
			<ScrollView className="flex-1">{/* heatmap, legend, etc. */}</ScrollView>
			<SearchBar />
		</Screen>
	);
}
