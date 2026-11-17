import { formatDateToUSNumeric, type MeetingType } from "@zotmeet/shared";
import { View } from "react-native";
import { AvailabilityNavButton } from "@/components/availability/table/availability-nav-button";
import { DAY_HEADER_HEIGHT } from "@/components/availability/table/availability-table-metrics";
import { Text } from "@/components/ui/text";

export interface AvailabilityDatePageNav {
	onPrev?: () => void;
	onNext?: () => void;
	isFirstPage: boolean;
	isLastPage: boolean;
}

interface AvailabilityTableHeaderProps {
	/** Local midnight of the column's day — see `localMidnightFromIsoDate`. */
	dateHeader: Date;
	/**
	 * A "days" meeting stores anchor dates, so only the weekday is shown for
	 * it — the same rule as the web's table header.
	 */
	meetingType: MeetingType;
	/** Position of this date within the page, for placing the nav arrows. */
	isFirstColumn: boolean;
	isLastColumn: boolean;
	datePageNav?: AvailabilityDatePageNav;
}

/**
 * Native counterpart to the web app's
 * `components/availability/table/availability-table-header.tsx`. The web
 * renders the whole `<thead>` row at once; here each day column carries its
 * own header so the column and its cells stay one flex child. The nav arrows
 * sit inside the first and last headers, where the wireframe puts them, as an
 * overlay so they do not shift the date off its column.
 *
 * Labels are formatted as the web does: `toLocaleDateString` weekday, then
 * `formatDateToUSNumeric` — uppercased here because the wireframe sets the
 * weekday in caps.
 */
export function AvailabilityTableHeader({
	dateHeader,
	meetingType,
	isFirstColumn,
	isLastColumn,
	datePageNav,
}: AvailabilityTableHeaderProps) {
	return (
		// The arrows are overlaid on the header rather than laid out beside the
		// date: as flex siblings they take part in the centring, pushing the date
		// cell off its column's centre — right on the first column, left on the
		// last — so the labels would no longer sit over their own blocks.
		<View
			className="relative w-full items-center"
			style={{ height: DAY_HEADER_HEIGHT }}
		>
			<View
				className="w-[80px] items-center"
				style={{ height: DAY_HEADER_HEIGHT }}
			>
				<Text className="font-figtree-medium text-[11px] leading-4 tracking-[0.5px]">
					{dateHeader
						.toLocaleDateString("en-US", { weekday: "short" })
						.toUpperCase()}
				</Text>
				<Text className="font-figtree-medium text-[16px] leading-6 tracking-[0.15px]">
					{meetingType === "dates" ? formatDateToUSNumeric(dateHeader) : ""}
				</Text>
			</View>
			{isFirstColumn ? (
				<View className="absolute top-0 left-0">
					<AvailabilityNavButton
						direction="left"
						disabled={datePageNav?.isFirstPage}
						handleClick={datePageNav?.onPrev}
					/>
				</View>
			) : null}
			{isLastColumn ? (
				<View className="absolute top-0 right-0">
					<AvailabilityNavButton
						direction="right"
						disabled={datePageNav?.isLastPage}
						handleClick={datePageNav?.onNext}
					/>
				</View>
			) : null}
		</View>
	);
}
