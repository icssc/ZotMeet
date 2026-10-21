import type { IconName } from "@/lib/icons";

/**
 * Native counterpart to the web app's `getDeleteLeaveAction`: the label,
 * glyph and colour of the one action a card offers, which depends on
 * whether the member hosts the meeting. Icon names are the web's
 * `@mui/icons-material` imports (`DeleteForever`, `ExitToApp`) kebab-cased;
 * the colours are class names rather than palette paths.
 */
export function getDeleteLeaveAction(isOwner: boolean) {
	return {
		label: isOwner ? "Delete Meeting" : "Leave Meeting",
		icon: (isOwner ? "delete-forever" : "exit-to-app") as IconName,
		menuColorClassName: isOwner ? "text-destructive" : "text-warning",
		confirmColor: isOwner ? ("error" as const) : ("warning" as const),
	};
}
