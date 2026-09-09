import {
	CalendarRange,
	ChevronLeft,
	Clock,
	Copy,
	MapPin,
	MoreVertical,
} from "lucide-react-native";
import type { ReactNode } from "react";
import { Pressable, View } from "react-native";
import { IconButton } from "@/components/ui/icon-button";
import { Text } from "@/components/ui/text";

/** One icon-and-label pair in the details row. */
function Detail({ icon, label }: { icon: ReactNode; label: string }) {
	return (
		<View className="flex-row items-center gap-0.5">
			{icon}
			<Text className="font-figtree text-[13px] text-text-secondary tracking-[0.12px]">
				{label}
			</Text>
		</View>
	);
}

/**
 * The chrome above a meeting on mobile — the back button, the copy and
 * overflow actions, and the meeting's name and details ("Mobile Meeting
 * Header", Figma 716:11444).
 */
export function MeetingHeader({
	title,
	dateRange,
	timeRange,
	location,
	onBack,
	onCopy,
	onMore,
}: {
	title: string;
	dateRange: string;
	timeRange: string;
	location: string;
	onBack?: () => void;
	onCopy?: () => void;
	onMore?: () => void;
}) {
	return (
		<View className="w-full">
			<View className="w-full flex-row items-start justify-between">
				<Pressable
					accessibilityRole="button"
					className="h-9 flex-row items-center justify-center gap-2 rounded-control px-2 py-1.5 active:opacity-60"
					onPress={onBack}
				>
					<ChevronLeft className="text-foreground" size={20} />
					<Text className="font-figtree-semibold text-button-md tracking-[0.4px]">
						Meetings
					</Text>
				</Pressable>

				<View className="flex-row items-center gap-1">
					<IconButton accessibilityLabel="Copy invite link" onPress={onCopy}>
						<Copy className="text-foreground" size={24} />
					</IconButton>
					<IconButton accessibilityLabel="More options" onPress={onMore}>
						<MoreVertical className="text-foreground" size={24} />
					</IconButton>
				</View>
			</View>

			<View className="w-full gap-2 px-3 pb-3">
				<Text className="font-figtree-semibold text-h6 leading-8 tracking-[0.15px]">
					{title}
				</Text>
				<View className="w-full flex-row items-center justify-between">
					<Detail
						icon={<CalendarRange className="text-text-secondary" size={14} />}
						label={dateRange}
					/>
					<Detail
						icon={<Clock className="text-text-secondary" size={14} />}
						label={timeRange}
					/>
					<Detail
						icon={<MapPin className="text-text-secondary" size={14} />}
						label={location}
					/>
				</View>
			</View>
		</View>
	);
}
