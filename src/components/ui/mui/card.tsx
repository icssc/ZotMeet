"use client";

import {
	Card,
	CardActions,
	type CardActionsProps,
	CardContent,
	type CardContentProps,
	CardHeader,
	type CardHeaderProps,
	CardMedia,
	type CardMediaProps,
	type CardProps,
} from "@mui/material";
import * as React from "react";

const MuiCard = React.forwardRef<HTMLDivElement, CardProps>(
	({ sx, ...props }, ref) => <Card ref={ref} sx={sx} {...props} />,
);
MuiCard.displayName = "MuiCard";

const MuiCardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
	({ sx, ...props }, ref) => <CardHeader ref={ref} sx={sx} {...props} />,
);
MuiCardHeader.displayName = "MuiCardHeader";

const MuiCardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
	({ sx, ...props }, ref) => <CardContent ref={ref} sx={sx} {...props} />,
);
MuiCardContent.displayName = "MuiCardContent";

const MuiCardActions = React.forwardRef<HTMLDivElement, CardActionsProps>(
	({ sx, ...props }, ref) => <CardActions ref={ref} sx={sx} {...props} />,
);
MuiCardActions.displayName = "MuiCardActions";

const MuiCardMedia = React.forwardRef<HTMLDivElement, CardMediaProps>(
	({ sx, ...props }, ref) => <CardMedia ref={ref} sx={sx} {...props} />,
);
MuiCardMedia.displayName = "MuiCardMedia";

export { MuiCard, MuiCardActions, MuiCardContent, MuiCardHeader, MuiCardMedia };
