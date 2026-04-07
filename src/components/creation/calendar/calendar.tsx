import { Button, Tab, Tabs } from "@mui/material";
import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import { CalendarBody } from "@/components/creation/calendar/calendar-body";
import { Week } from "@/components/creation/calendar/week";
import { Separator } from "@/components/ui/separator";
import type { SelectMeeting } from "@/db/schema";
import { MONTHS, WEEKDAYS } from "@/lib/types/chrono";
import { ZotDate } from "@/lib/zotdate";

interface CalendarProps {
	selectedDays: ZotDate[];
	setSelectedDays: Dispatch<SetStateAction<ZotDate[]>>;
	meetingType: SelectMeeting["meetingType"];
	setMeetingType: (type: SelectMeeting["meetingType"]) => void;
}

export function Calendar({
	selectedDays,
	setSelectedDays,
	meetingType,
	setMeetingType,
}: CalendarProps) {
	const today = new Date();
	const [currentMonth, setCurrentMonth] = useState(today.getMonth());
	const [currentYear, setCurrentYear] = useState(today.getFullYear());

	const monthName = MONTHS[currentMonth];
	const calendarDays = useMemo(
		() => ZotDate.generateZotDates(currentMonth, currentYear, selectedDays),
		[currentMonth, currentYear, selectedDays],
	);

	const decrementMonth = () => {
		let newMonth = currentMonth - 1;
		let newYear = currentYear;

		if (newMonth < 0) {
			newMonth = 11;
			newYear -= 1;
		}

		setCurrentMonth(newMonth);
		setCurrentYear(newYear);
	};

	const incrementMonth = () => {
		let newMonth = currentMonth + 1;
		let newYear = currentYear;

		if (newMonth > 11) {
			newMonth = 0;
			newYear += 1;
		}

		setCurrentMonth(newMonth);
		setCurrentYear(newYear);
	};

	/**
	 * Updates a range of dates based on a user selection
	 * @param startDate the day that the user first initiated the date multiselect range
	 * @param endDate the day that the user ended the date multiselect range
	 */
	const updateSelectedRange = (startDate: ZotDate, endDate: ZotDate): void => {
		const highlightedRange: Date[] = ZotDate.generateRange(
			startDate.day,
			endDate.day,
		);

		setSelectedDays((alreadySelectedDays: ZotDate[]) => {
			let modifiedSelectedDays = [...alreadySelectedDays];

			highlightedRange.forEach((highlightedZotDate: Date) => {
				const foundSelectedDay = alreadySelectedDays.find(
					(d) => d.compareTo(new ZotDate(highlightedZotDate)) === 0,
				);

				// Remove any selected days if the multiselect initiated from an already selected day
				if (startDate.isSelected && foundSelectedDay) {
					modifiedSelectedDays = modifiedSelectedDays.filter(
						(d) => d.compareTo(foundSelectedDay) !== 0,
					);
				}

				// Add day to selected days if the multiselect did not initiate from an already selected day
				if (!startDate.isSelected && !foundSelectedDay) {
					modifiedSelectedDays.push(
						new ZotDate(highlightedZotDate, undefined, undefined, true),
					);
				}
			});

			return modifiedSelectedDays;
		});
	};

	const isMeetingTypeDays = meetingType === "days";
	const title = isMeetingTypeDays
		? "Select Days of the Week"
		: `${monthName} ${currentYear}`;

	return (
		<div className="rounded-lg border bg-gradient-to-l from-[#00A96E0D] to-[#377CFB0D] py-6">
			<div className="flex flex-col items-start justify-between px-4 pb-3 md:items-center md:px-8">
				<Tabs
					value={meetingType}
					onChange={(_event: React.SyntheticEvent, value: string) => {
						setMeetingType(value as SelectMeeting["meetingType"]);
						setSelectedDays([]);
					}}
					sx={{
						"& .MuiTab-root": {
							fontSize: { xs: "1rem", md: "1rem" },
							minWidth: { xs: 120, md: 180 },
						},
					}}
				>
					<Tab value="dates" label="Specific Dates" />
					<Tab value="days" label="Days of Week" />
				</Tabs>

				<div className="mt-4 flex w-full items-center justify-between md:justify-start md:pl-15">
					<div className="mt-4 flex w-full items-center pl-3 md:pl-5">
						<h3 className="font-semibold text-gray-dark text-lg md:text-2xl">
							{title}
						</h3>

						{/* Mobile only buttons */}
						<div className="flex gap-2 md:hidden">
							<Button
								onClick={decrementMonth}
								className="bg-transparent hover:bg-transparent"
							>
								<span className="text-3xl text-gray-500">&lsaquo;</span>
							</Button>

							<Button
								onClick={incrementMonth}
								className="bg-transparent hover:bg-transparent"
							>
								<span className="text-3xl text-gray-500">&rsaquo;</span>
							</Button>
						</div>
					</div>
				</div>
			</div>

			{isMeetingTypeDays ? (
				<div className="px-8 md:px-16">
					<Week selectedDays={selectedDays} setSelectedDays={setSelectedDays} />
				</div>
			) : (
				<div className="flex items-center justify-between">
					<Button
						onClick={decrementMonth}
						className="hidden bg-transparent p-3 hover:bg-transparent md:block"
					>
						<span className="text-3xl text-gray-500">&lsaquo;</span>
					</Button>

					<div className="w-full md:px-2">
						<table className="w-full table-fixed border-collapse">
							<thead>
								<tr>
									{WEEKDAYS.map((dayOfWeek) => (
										<th className="px-0" key={dayOfWeek}>
											<div>
												<p className="w-full text-center font-light text-slate-medium text-sm uppercase md:font-bold">
													{dayOfWeek.slice(0, 1)}
												</p>
											</div>
											<Separator className="my-2 h-[2px] bg-slate-base" />
										</th>
									))}
								</tr>
							</thead>

							<CalendarBody
								calendarDays={calendarDays}
								currentMonth={currentMonth}
								updateSelectedRange={updateSelectedRange}
							/>
						</table>
					</div>

					<Button
						onClick={incrementMonth}
						className="hidden bg-transparent p-3 hover:bg-transparent md:block"
					>
						<span className="text-3xl text-gray-500">&rsaquo;</span>
					</Button>
				</div>
			)}
		</div>
	);
}
