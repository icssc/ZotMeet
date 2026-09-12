import type { MeetingCardViewModel } from "@zotmeet/shared";
import { type Href, useRouter } from "expo-router";
import { useRef } from "react";
import { Pressable, View } from "react-native";
import { IconButton } from "@/components/ui/icon-button";
import { Text } from "@/components/ui/text";
import { Typography } from "@/components/ui/typography";
import { Icon, type IconName } from "@/lib/icons";
import { cn } from "@/lib/utils";

/**
 * Native counterpart to the web app's `MeetingCard` (`src/components/ui/`).
 * Same view model (`toMeetingCardProps` in `@zotmeet/shared`), same five
 * variants, same banner copy. Two deviations:
 *
 *  - The web wraps the card in an absolutely positioned `<Link>`; here the
 *    whole card is a pressable that pushes the route, with the options
 *    button nested inside it. Nested pressables resolve to the inner one
 *    natively; on the web preview the press bubbles to the card too, so the
 *    button flags its press and the card ignores the one that follows.
 *  - The options button opens a one-item MUI `Menu` on the web. Its only item
 *    is "Delete" / "Leave", so here the button goes straight to the
 *    confirmation (`DeleteModal`) — one tap fewer, nothing lost.
 */
interface MeetingCardProps extends MeetingCardViewModel {
	isOwner: boolean;
	onDeleteLeave?: () => void;
	needsAvailability?: boolean;
	allAvailabilityFilled?: boolean;
	isUpcoming?: boolean;
	isPast?: boolean;
}

type Variant =
	| "default"
	| "action-required"
	| "schedule-alert"
	| "upcoming"
	| "scheduled";

const bannerClassNames: Record<Exclude<Variant, "default">, string> = {
	"action-required": "bg-primary",
	"schedule-alert": "bg-info",
	upcoming: "bg-secondary-main",
	scheduled: "bg-secondary-main",
};

const bannerTextClassNames: Record<Exclude<Variant, "default">, string> = {
	"action-required": "text-primary-foreground",
	"schedule-alert": "text-info-foreground",
	upcoming: "text-secondary-main-foreground",
	scheduled: "text-secondary-main-foreground",
};

function MetaItem({ icon, label }: { icon: IconName; label: string }) {
	return (
		<View className="w-[48%] flex-row items-center gap-1">
			<Icon name={icon} size={16} className="text-muted-foreground" />
			<Typography
				variant="body2"
				color="textSecondary"
				noWrap
				className="flex-1"
			>
				{label}
			</Typography>
		</View>
	);
}

export function MeetingCard({
	meetingName,
	meetingOrganizer,
	dateStart,
	dateEnd,
	timeStart,
	timeEnd,
	numResponders,
	location,
	scheduled = false,
	scheduledLabel,
	meetingLink,
	isOwner,
	onDeleteLeave,
	needsAvailability = false,
	allAvailabilityFilled = false,
	isUpcoming = false,
	isPast = false,
}: MeetingCardProps) {
	const router = useRouter();
	// Set by the options button, read and cleared by the card's own press.
	const optionsPressed = useRef(false);
	const dateLabel =
		dateStart && dateEnd && dateStart !== dateEnd
			? `${dateStart} - ${dateEnd}`
			: dateStart;

	const variant: Variant = isPast
		? "default"
		: needsAvailability
			? "action-required"
			: !scheduled && allAvailabilityFilled && isOwner
				? "schedule-alert"
				: scheduled && isUpcoming
					? "upcoming"
					: scheduled
						? "scheduled"
						: "default";

	const cardContent = (
		<View className="gap-4 rounded-lg border border-border bg-paper px-5 pt-5 pb-5">
			<View className="flex-row items-start gap-2">
				<View className="min-w-0 flex-1">
					<Typography variant="h6" noWrap>
						{meetingName}
					</Typography>
					<Typography variant="body2" color="textSecondary" noWrap>
						{meetingOrganizer}
					</Typography>
				</View>
				{onDeleteLeave ? (
					<IconButton
						size="small"
						edge="end"
						className="-mt-1"
						accessibilityLabel="Meeting options"
						onPress={() => {
							optionsPressed.current = true;
							onDeleteLeave();
						}}
					>
						<Icon name="more-vert" size={24} />
					</IconButton>
				) : null}
			</View>

			<View className="flex-row flex-wrap justify-between gap-y-3">
				<MetaItem icon="date-range" label={dateLabel} />
				<MetaItem icon="access-time" label={`${timeStart} - ${timeEnd}`} />
				<MetaItem icon="group" label={`${numResponders} Responders`} />
				{location ? <MetaItem icon="fmd-good" label={location} /> : null}
			</View>
		</View>
	);

	const banner =
		variant === "default" ? null : (
			<View
				className={cn(
					"flex-row items-center gap-1 px-5 py-3",
					variant === "upcoming" && "justify-between",
				)}
			>
				{variant === "action-required" ? (
					<>
						<Icon
							name="edit"
							size={18}
							className={bannerTextClassNames[variant]}
						/>
						<BannerText variant={variant}>Add your availability.</BannerText>
					</>
				) : variant === "schedule-alert" ? (
					<>
						<Icon
							name="date-range"
							size={18}
							className={bannerTextClassNames[variant]}
						/>
						<BannerText variant={variant}>
							Availability complete. Schedule this meeting.
						</BannerText>
					</>
				) : variant === "upcoming" ? (
					<>
						<View className="flex-row items-center gap-1">
							<Icon
								name="event"
								size={18}
								className={bannerTextClassNames[variant]}
							/>
							<BannerText variant={variant}>Upcoming</BannerText>
						</View>
						{scheduledLabel ? (
							<BannerText variant={variant}>{scheduledLabel}</BannerText>
						) : null}
					</>
				) : scheduledLabel ? (
					<BannerText variant={variant}>{scheduledLabel}</BannerText>
				) : null}
			</View>
		);

	return (
		<Pressable
			accessibilityRole="link"
			accessibilityLabel={meetingName}
			className={cn(
				"overflow-hidden rounded-lg active:opacity-90",
				variant !== "default" && bannerClassNames[variant],
			)}
			// The shared mapper builds `/availability/<id>` for both apps; the
			// router's typed `Href` cannot see through a plain string, hence the cast.
			onPress={() => {
				if (optionsPressed.current) {
					optionsPressed.current = false;
					return;
				}
				router.push(meetingLink as Href);
			}}
		>
			{cardContent}
			{banner}
		</Pressable>
	);
}

function BannerText({
	variant,
	children,
}: {
	variant: Exclude<Variant, "default">;
	children: React.ReactNode;
}) {
	return (
		<Text
			className={cn(
				"font-figtree-medium text-caption tracking-[0.14px]",
				bannerTextClassNames[variant],
			)}
		>
			{children}
		</Text>
	);
}
