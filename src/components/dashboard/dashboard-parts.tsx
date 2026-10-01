import {
	Box,
	Chip,
	Paper,
	type PaperProps,
	type SvgIconProps,
	Typography,
} from "@mui/material";
import { type ComponentType, Fragment, type ReactNode } from "react";

/** The white, hairline-bordered panel each dashboard section sits in. */
export function SectionCard({ sx, ...props }: PaperProps) {
	return (
		<Paper
			elevation={0}
			sx={[
				{
					bgcolor: "background.paper",
					border: 1,
					borderColor: "action.hover",
					borderRadius: 2,
				},
				...(Array.isArray(sx) ? sx : [sx]),
			]}
			{...props}
		/>
	);
}

/** Section heading, e.g. "Action Items" with its count chip. */
export function SectionHeading({
	children,
	count,
}: {
	children: ReactNode;
	count?: number;
}) {
	return (
		<Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
			<Typography variant="h4" component="h2" sx={{ fontWeight: 700 }}>
				{children}
			</Typography>
			{count !== undefined && <CountBadge count={count} />}
		</Box>
	);
}

export function CountBadge({ count }: { count: number }) {
	return (
		<Chip
			label={count}
			size="small"
			sx={{
				height: 24,
				minWidth: 24,
				bgcolor: "action.hover",
				"& .MuiChip-label": {
					px: 1,
					typography: "caption",
					color: "text.primary",
				},
			}}
		/>
	);
}

export type MetaEntry = {
	key: string;
	label: ReactNode;
	icon?: ComponentType<SvgIconProps>;
};

/** Caption-sized details separated by bullets: `📅 2/16 - 2/20 • 👥 12 • …`. */
export function MetaRow({ entries }: { entries: MetaEntry[] }) {
	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				gap: 0.5,
				minWidth: 0,
				color: "text.secondary",
			}}
		>
			{entries.map(({ key, label, icon: Icon }, i) => (
				<Fragment key={key}>
					{i > 0 && (
						<Typography variant="body2" color="inherit" aria-hidden>
							•
						</Typography>
					)}
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 0.5,
							minWidth: 0,
							flexShrink: 1,
						}}
					>
						{Icon && (
							<Icon sx={{ fontSize: 16, color: "inherit", flexShrink: 0 }} />
						)}
						{typeof label === "string" ? (
							<Typography variant="caption" color="inherit" noWrap>
								{label}
							</Typography>
						) : (
							label
						)}
					</Box>
				</Fragment>
			))}
		</Box>
	);
}
