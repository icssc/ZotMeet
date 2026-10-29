import { View } from "react-native";
import { Card, CardDescription } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { darken } from "@/lib/color";

interface RoomsHeatmapLegendProps {
	availabilityColor: string;
	notAvailableColor: string;
}

export default function RoomsHeatmapLegend({
	availabilityColor,
	notAvailableColor,
}: RoomsHeatmapLegendProps) {
	return (
		<Card className="items-center gap-2">
			<CardDescription>Rooms Availability Legend</CardDescription>
			<View className="flex-row items-center gap-4">
				<View className="flex-row items-center gap-2">
					<View
						className="h-4 w-4 rounded-full border-2 border-gray-300"
						style={{
							backgroundColor: availabilityColor,
							borderColor: darken(availabilityColor, 0.2),
						}}
					/>
					<Typography variant="body2">Available</Typography>
				</View>
				<View className="flex-row items-center gap-2">
					<View
						className="h-4 w-4 rounded-full border-2 border-gray-300"
						style={{
							backgroundColor: notAvailableColor,
							borderColor: darken(notAvailableColor, 0.2),
						}}
					/>
					<Typography variant="body2">Unavailable</Typography>
				</View>
			</View>
		</Card>
	);
}
