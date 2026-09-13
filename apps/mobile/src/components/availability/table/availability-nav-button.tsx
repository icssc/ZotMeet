import { IconButton } from "@/components/ui/icon-button";
import { Icon } from "@/lib/icons";

interface AvailabilityNavButtonProps {
	direction: "left" | "right";
	disabled?: boolean;
	handleClick?: () => void;
}

/**
 * Native counterpart to the web app's
 * `components/availability/table/availability-nav-button.tsx`: the arrow that
 * pages the table to the previous or next set of dates.
 */
export function AvailabilityNavButton({
	direction,
	disabled = false,
	handleClick,
}: AvailabilityNavButtonProps) {
	return (
		<IconButton
			accessibilityLabel={
				direction === "left" ? "Previous dates" : "Next dates"
			}
			// The web hides a disabled arrow entirely (`opacity: 0`) rather than
			// greying it out, so the header keeps its width at either end.
			className={disabled ? "opacity-0" : undefined}
			color="inherit"
			disabled={disabled}
			onPress={handleClick}
			size="small"
		>
			{direction === "left" ? (
				<Icon name="chevron-left" size={20} />
			) : (
				<Icon name="chevron-right" size={20} />
			)}
		</IconButton>
	);
}
