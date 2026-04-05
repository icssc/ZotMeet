import { Table, TableCell, TableHead, TableRow } from "@mui/material";

// 9:00 AM PST
const slotStart = "2026-04-05T17:00:00Z";
// 5:00 PM PST
const slotEnd = "2026-04-06T01:00:00Z";

const formatISOToLocalTime = (isoString: string): string => {
	return new Date(isoString)
		.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		})
		.toLowerCase();
};

const start = new Date(slotStart);
const end = new Date(slotEnd);

const timestamps: string[] = [];
//const slots: string[] = [];
let current = new Date(start);
while (current < end) {
	//  slots.push(current.toISOString())
	timestamps.push(formatISOToLocalTime(current.toISOString()));

	current = new Date(current.getTime() + 30 * 60 * 1000); // + 30 min
}

const ROOMS = ["Room A", "Room B", "Room C"];
const SLOTS = [480, 510, 540, 570]; // 8:00, 8:30, 9:00, 9:30

export const RoomsHeatmap = () => {
	return (
		<div className="">
			<Table>
				<TableHead>
					<TableRow>
						<TableCell className="border border-green-200">
							<div className="">
								<h1>Rooms</h1>
							</div>
						</TableCell>

						<div>
							{timestamps.map((t) => (
								<TableCell key={t} className="border border-green-200">
									<div className="w-20">{t}</div>
								</TableCell>
							))}
						</div>
					</TableRow>
				</TableHead>
			</Table>
		</div>
	);
};
