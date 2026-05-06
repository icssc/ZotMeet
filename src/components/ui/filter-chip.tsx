import { Button } from "@mui/material";

export function FilterChip({
	label,
	count,
	active,
	onClick,
}: {
	label: string;
	count: number;
	active: boolean;
	onClick: () => void;
}) {
	return (
		<Button
			onClick={onClick}
			disableElevation
			aria-pressed={active}
			sx={{
				bgcolor: active ? "secondary.main" : "action.hover",
				color: active ? "secondary.contrastText" : "text.primary",
				"&:hover": {
					bgcolor: active ? "secondary.dark" : "action.selected",
				},
				boxShadow: "none",
				borderRadius: 1,
				fontWeight: 600,
				fontSize: { xs: "0.75rem", sm: "1rem" },
				px: { xs: 1, sm: 2 },
				minWidth: 0,
			}}
		>
			{label} {count}
		</Button>
	);
}
