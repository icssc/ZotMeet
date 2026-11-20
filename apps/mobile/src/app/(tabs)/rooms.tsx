import { ScrollView, View } from "react-native";
import SearchBar from "@/components/studyrooms/searchbar";
import { Card } from "@/components/ui/card";
import { Screen } from "@/components/ui/screen";

export const BUILDINGS = [
	"Anteater Learning Pavilion",
	"Science Library",
	"Langson Library",
	"Gateway Study Center",
	"Plaza Verde",
	"Multimedia Resources Center",
] as const;
export default function RoomsScreen() {
	return (
		<Screen title="Rooms">
			<ScrollView className="flex-1">{/* heatmap, legend, etc. */}</ScrollView>
			<SearchBar buildings={BUILDINGS} />
		</Screen>
	);
}
