import type { SvgIconComponent } from "@mui/icons-material";
import { DeleteForever, ExitToApp } from "@mui/icons-material";

export function getDeleteLeaveAction(isOwner: boolean) {
	return {
		label: isOwner ? "Delete Meeting" : "Leave Meeting",
		Icon: (isOwner ? DeleteForever : ExitToApp) as SvgIconComponent,
		menuColor: isOwner ? "error.main" : "warning.main",
		confirmColor: isOwner ? ("error" as const) : ("warning" as const),
	};
}
