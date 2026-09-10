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

export type AvailabilityDateHeader = {
	/** Uppercase weekday abbreviation as the wireframe shows it: "THUR". */
	weekday: string;
	/** Short numeric date: "1/1". */
	date: string;
};

interface AvailabilityTableHeaderProps {
	dateHeader: AvailabilityDateHeader;
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
 * sit inside the first and last headers, where the wireframe puts them.
 */
export function AvailabilityTableHeader({
	dateHeader,
	isFirstColumn,
	isLastColumn,
	datePageNav,
}: AvailabilityTableHeaderProps) {
	return (
		<View className="flex-row items-start gap-3">
			{isFirstColumn ? (
				<AvailabilityNavButton
					direction="left"
					disabled={datePageNav?.isFirstPage}
					handleClick={datePageNav?.onPrev}
				/>
			) : null}
			<View
				className="w-[80px] items-center"
				style={{ height: DAY_HEADER_HEIGHT }}
			>
				<Text className="font-figtree-medium text-[11px] leading-4 tracking-[0.5px]">
					{dateHeader.weekday}
				</Text>
				<Text className="font-figtree-medium text-[16px] leading-6 tracking-[0.15px]">
					{dateHeader.date}
				</Text>
			</View>
			{isLastColumn ? (
				<AvailabilityNavButton
					direction="right"
					disabled={datePageNav?.isLastPage}
					handleClick={datePageNav?.onNext}
				/>
			) : null}
		</View>
	);
}
