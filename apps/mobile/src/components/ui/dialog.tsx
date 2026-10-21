import * as DialogPrimitive from "@rn-primitives/dialog";
import { Platform, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

/**
 * Native counterpart to the web app's `@radix-ui/react-dialog` wrapper.
 * `DialogContent` mounts through the `<PortalHost />` in `src/app/_layout.tsx`.
 */
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;

function DialogOverlay({
	className,
	...props
}: DialogPrimitive.OverlayProps & {
	ref?: React.Ref<DialogPrimitive.OverlayRef>;
}) {
	return (
		<DialogPrimitive.Overlay
			className={cn(
				"absolute inset-0 z-50 items-center justify-center bg-black/60 p-4",
				className,
			)}
			{...props}
		/>
	);
}

function DialogContent({
	className,
	children,
	...props
}: DialogPrimitive.ContentProps & {
	ref?: React.Ref<DialogPrimitive.ContentRef>;
}) {
	return (
		<DialogPrimitive.Portal>
			<DialogOverlay>
				<DialogPrimitive.Content
					className={cn(
						"w-full max-w-md gap-3 rounded-lg border border-border bg-background p-6",
						Platform.OS === "web" && "shadow-lg",
						className,
					)}
					{...props}
				>
					{children}
					<DialogPrimitive.Close className="absolute top-4 right-4 rounded-sm p-1 active:opacity-70">
						<Icon name="close" className="text-muted-foreground" size={18} />
					</DialogPrimitive.Close>
				</DialogPrimitive.Content>
			</DialogOverlay>
		</DialogPrimitive.Portal>
	);
}

function DialogHeader({ children }: { children: React.ReactNode }) {
	return <View className="gap-1.5 pr-6">{children}</View>;
}

function DialogFooter({ children }: { children: React.ReactNode }) {
	return <View className="flex-row justify-end gap-2 pt-2">{children}</View>;
}

function DialogTitle({ children }: { children: React.ReactNode }) {
	return (
		<DialogPrimitive.Title asChild>
			<Text className="font-figtree-semibold text-lg">{children}</Text>
		</DialogPrimitive.Title>
	);
}

function DialogDescription({ children }: { children: React.ReactNode }) {
	return (
		<DialogPrimitive.Description asChild>
			<Text className="text-muted-foreground text-sm">{children}</Text>
		</DialogPrimitive.Description>
	);
}

export {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogTitle,
	DialogTrigger,
};
