import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import { CalendarBody } from "@/components/creation/calendar/calendar-body";
import { Week } from "@/components/creation/calendar/week";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
		<div className="rounded-xl border bg-gradient-to-l from-[#00A96E0D] to-[#377CFB0D] py-7">
			<div className="flex flex-col items-start justify-between space-y-4 px-8 pb-6 md:px-16 lg:flex-row lg:items-start lg:space-y-0">
				<h3 className="text-left font-montserrat font-semibold text-2xl text-gray-dark md:text-3xl">
					{title}
				</h3>

				<Tabs
					value={meetingType}
					onValueChange={(value) => {
						setMeetingType(value as SelectMeeting["meetingType"]);
						setSelectedDays([]);
					}}
				>
					<TabsList className="bg-background p-1">
						<TabsTrigger
							value="dates"
							className="data-[state=active]:ring-1 data-[state=active]:ring-border"
						>
							Specific Dates
						</TabsTrigger>
						<TabsTrigger
							value="days"
							className="data-[state=active]:ring-1 data-[state=active]:ring-border"
						>
							Days of Week
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			<div className="flex items-center justify-between">
				{!isMeetingTypeDays && (
					<Button
						onClick={decrementMonth}
						className="bg-transparent p-3 hover:bg-transparent"
					>
						<span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 text-gray-500 text-xl hover:border-gray-400">
							&lsaquo;
						</span>
					</Button>
				)}

				<div
					className={
						isMeetingTypeDays ? "w-full px-3 md:px-10" : "w-full md:px-4"
					}
				>
					<table className="w-full table-fixed p-3">
						{isMeetingTypeDays ? (
							<Week
								selectedDays={selectedDays}
								setSelectedDays={setSelectedDays}
							/>
						) : (
							<>
								<thead>
									<tr>
										{WEEKDAYS.map((dayOfWeek) => (
											<th className="px-0" key={dayOfWeek}>
												<div>
													<p className="w-full text-center font-light text-slate-medium text-sm uppercase md:font-bold">
														{dayOfWeek}
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
							</>
						)}
					</table>
				</div>

				{!isMeetingTypeDays && (
					<Button
						onClick={incrementMonth}
						className="bg-transparent p-3 hover:bg-transparent"
					>
						<span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 text-gray-500 text-xl hover:border-gray-400">
							&rsaquo;
						</span>
					</Button>
				)}
			</div>
		</div>
	);
}
