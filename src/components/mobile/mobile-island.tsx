import { Paper } from "@mui/material";
import type React from "react";

type MobileIslandProps = {
	children: React.ReactNode;
};

export function MobileIsland({ children }: MobileIslandProps) {
	return (
		<div className="pointer-events-none fixed inset-x-0 bottom-0 z-[1001] flex justify-center px-2 pb-[max(4rem,env(safe-area-inset-bottom))]">
			<Paper
				elevation={3}
				sx={{
					pointerEvents: "auto",
					borderRadius: 3,
					p: 0.5,
					width: "90vw",
					maxWidth: "100%",
					boxSizing: "border-box",
				}}
			>
				<div className="flex w-full min-w-0 flex-col">{children}</div>
			</Paper>
		</div>
	);
}
