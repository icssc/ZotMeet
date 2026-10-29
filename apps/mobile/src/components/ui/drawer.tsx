// Mirrors MUI <Drawer anchor="bottom"> from src/app/studyrooms/page.tsx.
// Native: @rn-primitives/dialog anchored to the bottom, same portal as ui/dialog.
import * as DialogPrimitive from "@rn-primitives/dialog";
import { SheetGrabber } from "@/components/ui/sheet-grabber";
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
				<DialogPrimitive.Overlay className="absolute inset-0 z-50 justify-end bg-black/60">
					<DialogPrimitive.Content
						className={cn(
							"w-full rounded-t-xl border border-border bg-background px-4 pb-8",
							className,
						)}
					>
						<SheetGrabber />
						{children}
					</DialogPrimitive.Content>
				</DialogPrimitive.Overlay>
			</DialogPrimitive.Portal>
		</DialogPrimitive.Root>
	);
}
