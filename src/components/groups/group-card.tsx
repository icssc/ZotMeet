import {
	Error as ErrorIcon,
	KeyboardArrowRight,
	PeopleOutline,
} from "@mui/icons-material";
import { Avatar, Box, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import {
	MuiCard,
	MuiCardActions,
	MuiCardContent,
	MuiCardHeader,
} from "@/components/ui/mui/card";

interface GroupCardProps {
	id: string;
	name: string;
	description: string | null;
	memberEmails?: string[];
	totalMembers: number;
	creatorName: string;
	actionRequired?: boolean;
}

export function GroupCard({
	id,
	name,
	description,
	totalMembers,
	creatorName,
	actionRequired = false,
}: GroupCardProps) {
	return (
		<Link href={`/groups/${id}`} style={{ textDecoration: "none" }}>
			<MuiCard
				sx={{
					position: "relative",
					overflow: "visible",
					border: "1px solid",
					borderColor: "divider",
				}}
			>
				{actionRequired && (
					<Box
						sx={{
							position: "absolute",
							top: -4,
							right: 24,
							display: "flex",
							alignItems: "center",
							gap: "10px",
							px: "10px",
							py: "5px",
							bgcolor: "#ffeaea",
							borderRadius: "0 0 5px 5px",
						}}
					>
						<ErrorIcon sx={{ fontSize: 18, color: "#da281e" }} />
						<Typography
							variant="caption"
							sx={{
								color: "#da281e",
								fontWeight: 500,
								letterSpacing: "0.14px",
								lineHeight: "20px",
							}}
						>
							Action Required
						</Typography>
					</Box>
				)}
				<MuiCardHeader
					avatar={
						<Box
							sx={{
								position: "relative",
								width: 40,
								height: 40,
								flexShrink: 0,
							}}
						>
							<Image
								src="/icssc-logo.svg"
								alt="group-pfp"
								fill
								style={{ objectFit: "contain" }}
							/>
						</Box>
					}
					title={<Typography variant="h6">{name}</Typography>}
					subheader={
						<Typography
							variant="body2"
							color="text.secondary"
							sx={{ display: { sm: "none" } }}
						>
							{totalMembers} Members
						</Typography>
					}
					action={
						<Box sx={{ display: { sm: "none" }, alignSelf: "center" }}>
							<KeyboardArrowRight />
						</Box>
					}
				/>
				<MuiCardContent>
					<Typography
						variant="subtitle1"
						sx={{
							color: "#717182",
							display: "-webkit-box",
							WebkitLineClamp: { xs: 2, sm: 3 },
							WebkitBoxOrient: "vertical",
							overflow: "hidden",
						}}
					>
						{description || "No Description Provided"}
					</Typography>
				</MuiCardContent>
				<MuiCardActions
					sx={{
						display: { xs: "none", sm: "flex" },
						justifyContent: "space-between",
						//flexWrap: "nowrap",
						px: 2,
					}}
				>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 0.5,
							flexShrink: 0,
						}}
					>
						<PeopleOutline sx={{ fontSize: 12 }} />
						<Typography variant="overline" sx={{ color: "#4a5565" }}>
							{totalMembers} Members
						</Typography>
					</Box>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 1,
							flexShrink: 0,
						}}
					>
						<Avatar
							sx={{
								width: 18,
								height: 18,
								fontSize: "0.625rem",
								bgcolor: "grey.400",
							}}
						>
							{creatorName[0]}
						</Avatar>
						<Typography variant="overline" sx={{ color: "#4a5565" }}>
							Owned by {creatorName}
						</Typography>
					</Box>
				</MuiCardActions>
			</MuiCard>
		</Link>
	);
}
