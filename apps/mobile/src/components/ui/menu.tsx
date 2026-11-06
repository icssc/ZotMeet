import { type ComponentRef, type RefObject, useEffect, useState } from "react";
import { Modal, Pressable, useWindowDimensions, View } from "react-native";
import { Typography } from "@/components/ui/typography";
import { Icon, type IconName } from "@/lib/icons";
import { cn } from "@/lib/utils";

/** Native counterpart to MUI's `Menu` / `MenuItem`: a dropdown under its anchor, right-aligned. */
export function Menu({
	anchorRef,
	open,
	onClose,
	children,
}: {
	anchorRef: RefObject<ComponentRef<typeof View> | null>;
	open: boolean;
	onClose: () => void;
	children: React.ReactNode;
}) {
	const { width: windowWidth } = useWindowDimensions();
	const [anchor, setAnchor] = useState<{ bottom: number; right: number }>();

	useEffect(() => {
		if (!open) {
			setAnchor(undefined);
			return;
		}
		anchorRef.current?.measureInWindow((x, y, width, height) => {
			setAnchor({ bottom: y + height, right: windowWidth - (x + width) });
		});
	}, [open, anchorRef, windowWidth]);

	return (
		<Modal
			transparent
			visible={open && anchor !== undefined}
			animationType="fade"
			statusBarTranslucent
			onRequestClose={onClose}
		>
			<Pressable
				accessibilityLabel="Close menu"
				className="flex-1"
				onPress={onClose}
			>
				{anchor ? (
					<View
						className="absolute min-w-[180px] rounded-md bg-paper py-2 shadow-md"
						style={{ top: anchor.bottom + 4, right: anchor.right }}
					>
						{children}
					</View>
				) : null}
			</Pressable>
		</Modal>
	);
}

export function MenuItem({
	label,
	icon,
	color = "default",
	onPress,
}: {
	label: string;
	icon?: IconName;
	color?: "default" | "primary";
	onPress: () => void;
}) {
	const textColor = color === "primary" ? "text-primary" : "text-foreground";

	return (
		<Pressable
			accessibilityRole="menuitem"
			className="flex-row items-center gap-3 px-4 py-3 active:bg-action-hover"
			onPress={onPress}
		>
			{icon ? <Icon name={icon} size={20} className={textColor} /> : null}
			<Typography variant="body2" className={cn(textColor)}>
				{label}
			</Typography>
		</Pressable>
	);
}
