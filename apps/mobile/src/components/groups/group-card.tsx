import type { GroupListItem } from "@zotmeet/shared";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { Pressable, View } from "react-native";
import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { Typography } from "@/components/ui/typography";
import { Icon } from "@/lib/icons";
import { colorsFor } from "@/lib/theme";
import { cn } from "@/lib/utils";

/** Native counterpart to the web app's `GroupCard` (`src/components/groups/`), laid out to Figma. */

const AVATAR_GROUP_MAX = 6;

const AVATAR_SIZE = 32;

export function GroupCard({
	group,
	actionRequired = false,
}: {
	group: GroupListItem;
	actionRequired?: boolean;
}) {
	const router = useRouter();
	const { colorScheme } = useColorScheme();
	const colors = colorsFor(colorScheme);

	return (
		<Pressable
			accessibilityRole="button"
			accessibilityLabel={group.name}
			className="overflow-hidden rounded-lg border border-divider bg-card px-4 py-3 active:opacity-80"
			onPress={() =>
				router.push({ pathname: "/groups/[id]", params: { id: group.id } })
			}
		>
			{actionRequired ? (
				<View
					pointerEvents="none"
					className="absolute inset-0"
					style={{
						experimental_backgroundImage: `linear-gradient(to right, transparent 44.7%, ${colors.cardGradient})`,
					}}
				/>
			) : null}

			<View className="flex-row items-center gap-3">
				<GroupIcon
					icon={group.icon}
					name={group.name}
					size={actionRequired ? 28 : 36}
				/>
				<View className="min-w-0 flex-1">
					<Typography variant="body1" noWrap>
						{group.name}
					</Typography>
					{actionRequired ? null : (
						<View className="flex-row items-center gap-1">
							<Icon
								name="people-outline"
								size={14}
								className="text-muted-foreground"
							/>
							<Typography variant="caption" color="textSecondary">
								{group.memberCount}
							</Typography>
						</View>
					)}
				</View>
				<Icon name="chevron-right" size={24} className="text-action-active" />
			</View>

			{actionRequired ? (
				<Typography variant="body2" className="mt-2 text-card-muted-foreground">
					Availability is needed for:{" "}
					<Text className="font-figtree-bold-italic text-card-muted-foreground">
						{group.pendingMeetingName ?? "a meeting"}
					</Text>
				</Typography>
			) : (
				<View className="mt-3">
					<AvatarGroup
						max={AVATAR_GROUP_MAX}
						total={group.memberCount}
						size={AVATAR_SIZE}
					>
						{group.members.map((member) => (
							<Avatar
								key={member.userId}
								src={member.profilePicture}
								alt={member.displayName}
								fallback={member.displayName.charAt(0).toUpperCase()}
								size={AVATAR_SIZE}
							/>
						))}
					</AvatarGroup>
				</View>
			)}
		</Pressable>
	);
}

export function GroupIcon({
	icon,
	name,
	size = 40,
	className,
}: {
	icon: string | null;
	name: string;
	size?: number;
	className?: string;
}) {
	return (
		<View className={cn("rounded-full bg-card shadow-sm", className)}>
			<Avatar src={icon} alt={`${name} icon`} size={size}>
				<View className="size-full items-center justify-center bg-card">
					<Icon
						name="groups"
						size={size * 0.55}
						className="text-muted-foreground"
					/>
				</View>
			</Avatar>
		</View>
	);
}
