// Mirrors MUI <Drawer anchor="bottom"> from src/app/studyrooms/page.tsx.
// Native: @rn-primitives/dialog anchored to the bottom, same portal as ui/dialog.
import * as DialogPrimitive from "@rn-primitives/dialog";
import {
	FadeIn,
	FadeOut,
	SlideInDown,
	SlideOutDown,
} from "react-native-reanimated";
import { SheetGrabber } from "@/components/ui/sheet-grabber";
import { Animated } from "@/lib/animated"; // check whether it's a default or named export
import { cn } from "@/lib/utils";

type DrawerProps = {
	open: boolean;
	onClose: () => void;
	className?: string;
	children: React.ReactNode;
};

export function Drawer({ open, onClose, className, children }: DrawerProps) {
	return (
		<DialogPrimitive.Root
			open={open}
			onOpenChange={(next) => {
				if (!next) onClose();
			}}
		>
			<DialogPrimitive.Portal>
				<DialogPrimitive.Overlay className="absolute inset-0 z-50 justify-end">
					<Animated.View
						className="absolute inset-0 bg-black/60"
						entering={FadeIn.duration(200)}
						exiting={FadeOut.duration(150)}
						pointerEvents="none"
					/>
					<DialogPrimitive.Content asChild>
						<Animated.View
							className={cn(
								"w-full rounded-t-xl border border-border bg-background px-4 pb-8",
								className,
							)}
							entering={SlideInDown.duration(250)}
							exiting={SlideOutDown.duration(200)}
						>
							<SheetGrabber />
							{children}
						</Animated.View>
					</DialogPrimitive.Content>
				</DialogPrimitive.Overlay>
			</DialogPrimitive.Portal>
		</DialogPrimitive.Root>
	);
}
