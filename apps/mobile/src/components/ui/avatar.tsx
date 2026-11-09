import { Children, isValidElement, useState } from "react";
import { Image, View } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

/** Native counterpart to the web app's `ui/avatar.tsx` and MUI's `Avatar` / `AvatarGroup`. */
export function Avatar({
	src,
	alt,
	fallback,
	size = 40,
	className,
	children,
}: {
	src?: string | null;
	alt?: string;
	fallback?: string;
	size?: number;
	className?: string;
	children?: React.ReactNode;
}) {
	const [failed, setFailed] = useState(false);
	const showImage = Boolean(src) && !failed;

	return (
		<View
			accessible={Boolean(alt)}
			accessibilityLabel={alt}
			accessibilityRole={alt ? "image" : undefined}
			className={cn(
				"items-center justify-center overflow-hidden rounded-full",
				!showImage && "bg-text-disabled",
				className,
			)}
			style={{ width: size, height: size }}
		>
			{showImage ? (
				<Image
					source={{ uri: src ?? undefined }}
					onError={() => setFailed(true)}
					style={{ width: size, height: size }}
					resizeMode="cover"
				/>
			) : (
				(children ?? (
					<Text
						className="font-figtree-medium text-background"
						style={{ fontSize: size * 0.4 }}
					>
						{fallback}
					</Text>
				))
			)}
		</View>
	);
}

export function AvatarGroup({
	max = 6,
	total,
	size = 40,
	children,
}: {
	max?: number;
	total?: number;
	size?: number;
	children: React.ReactNode;
}) {
	const avatars = Children.toArray(children).filter(isValidElement);
	const count = Math.max(total ?? avatars.length, avatars.length);
	const shown = count > max ? avatars.slice(0, max - 1) : avatars;
	const extra = count - shown.length;

	const ring = "border-2 border-card";

	return (
		<View className="flex-row">
			{shown.map((avatar, index) => (
				<View
					key={avatar.key ?? index}
					className={cn("rounded-full", ring)}
					style={{ marginLeft: index === 0 ? 0 : -size / 4 }}
				>
					{avatar}
				</View>
			))}
			{extra > 0 ? (
				<View
					className={cn("rounded-full", ring)}
					style={{ marginLeft: shown.length === 0 ? 0 : -size / 4 }}
				>
					<Avatar size={size} fallback={`+${extra}`} />
				</View>
			) : null}
		</View>
	);
}
