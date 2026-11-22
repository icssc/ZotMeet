import { useState } from "react";
import { Image, View } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

/**
 * Native counterpart to MUI's `<Avatar>` (web: `group-responses.tsx`). Same
 * `src` / `alt` props; like MUI it falls back to the first letter of `alt`
 * when there is no picture or it fails to load. Defaults to 24px, the size
 * the web uses inside chips; pass `className="size-10"` for MUI's default.
 */
export interface AvatarProps {
	src?: string | null;
	alt: string;
	className?: string;
}

export function Avatar({ src, alt, className }: AvatarProps) {
	const [failed, setFailed] = useState(false);
	const showImage = !!src && !failed;

	return (
		<View
			accessibilityLabel={alt}
			className={cn(
				"size-6 items-center justify-center overflow-hidden rounded-full bg-muted",
				className,
			)}
		>
			{showImage ? (
				<Image
					source={{ uri: src }}
					className="size-full"
					onError={() => setFailed(true)}
				/>
			) : (
				<Text className="font-figtree-medium text-muted-foreground text-xs">
					{alt.charAt(0).toUpperCase()}
				</Text>
			)}
		</View>
	);
}
