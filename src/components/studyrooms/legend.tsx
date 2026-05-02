import { Box, Stack } from "@mui/material";

interface RoomsHeatmapLegendProps {
	availabilityColor: string;
	notAvailableColor: string;
}

export const RoomsHeatmapLegend = ({
	availabilityColor,
	notAvailableColor,
}: RoomsHeatmapLegendProps) => {
	return (
		<Stack
			direction="column"
			spacing={1}
			justifyContent="center"
			alignItems="center"
			sx={{ backgroundColor: "white", p: 2 }}
		>
			<p>Room Availability Legend</p>
			<Stack
				direction="row"
				justifyContent="space-between"
				width="100%"
				sx={{ px: 3 }}
			>
				<Stack direction="column" alignItems="center">
					<Box
						sx={{
							backgroundColor: availabilityColor,
							width: 16,
							height: 16,
							borderRadius: "50%",
							border: "2px solid",
							borderColor: "grey.300",
						}}
					/>
					<p>Available</p>
				</Stack>
				<Stack direction="column" alignItems="center">
					<Box
						sx={{
							backgroundColor: notAvailableColor,
							width: 16,
							height: 16,
							borderRadius: "50%",
							border: "2px solid",
							borderColor: "grey.300",
						}}
					/>
					<p>Unavailable</p>
				</Stack>
			</Stack>
		</Stack>
	);
};
