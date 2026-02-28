"use client";

import {
	Box,
	type BoxProps,
	Divider,
	type DividerProps,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	type ListItemButtonProps,
	ListItemIcon,
	type ListItemIconProps,
	type ListItemProps,
	ListItemText,
	type ListItemTextProps,
	type ListProps,
	Tooltip,
} from "@mui/material";
import * as React from "react";

const SIDEBAR_WIDTH = 240;
const SIDEBAR_WIDTH_COLLAPSED = 72;

type MuiSidebarContextType = {
	open: boolean;
	setOpen: (open: boolean) => void;
};

const MuiSidebarContext = React.createContext<MuiSidebarContextType | null>(
	null,
);

function useMuiSidebar() {
	const context = React.useContext(MuiSidebarContext);
	if (!context) {
		throw new Error("useMuiSidebar must be used within a MuiSidebarProvider.");
	}
	return context;
}

// --- Provider ---

type MuiSidebarProviderProps = {
	children: React.ReactNode;
	defaultOpen?: boolean;
};

function MuiSidebarProvider({
	children,
	defaultOpen = false,
}: MuiSidebarProviderProps) {
	const [open, setOpen] = React.useState(defaultOpen);

	const value = React.useMemo(() => ({ open, setOpen }), [open]);

	return (
		<MuiSidebarContext.Provider value={value}>
			{children}
		</MuiSidebarContext.Provider>
	);
}

// --- Sidebar (Drawer) ---

type MuiSidebarProps = {
	children?: React.ReactNode;
	expandOnHover?: boolean;
};

const MuiSidebar = React.forwardRef<HTMLDivElement, MuiSidebarProps>(
	({ expandOnHover = true, children }, ref) => {
		const { open, setOpen } = useMuiSidebar();
		const width = open ? SIDEBAR_WIDTH : SIDEBAR_WIDTH_COLLAPSED;

		return (
			<Drawer
				ref={ref}
				variant="permanent"
				sx={{
					width,
					flexShrink: 0,
					"& .MuiDrawer-paper": {
						width,
						boxSizing: "border-box",
						transition: "width 0.2s ease-in-out",
						overflowX: "hidden",
						display: "flex",
						flexDirection: "column",
						background: "linear-gradient(to top left, #EEEEEE, #EAEFF2)",
						borderRight: "none",
					},
				}}
				{...(expandOnHover && {
					onMouseEnter: () => setOpen(true),
					onMouseLeave: () => setOpen(false),
				})}
			>
				{children}
			</Drawer>
		);
	},
);
MuiSidebar.displayName = "MuiSidebar";

// --- SidebarHeader ---

const MuiSidebarHeader = React.forwardRef<HTMLDivElement, BoxProps>(
	({ sx, ...props }, ref) => (
		<Box
			ref={ref}
			sx={{ p: 2, display: "flex", alignItems: "center", gap: 2, ...sx }}
			{...props}
		/>
	),
);
MuiSidebarHeader.displayName = "MuiSidebarHeader";

// --- SidebarContent ---

const MuiSidebarContent = React.forwardRef<HTMLDivElement, BoxProps>(
	({ sx, ...props }, ref) => (
		<Box ref={ref} sx={{ flexGrow: 1, overflow: "auto", ...sx }} {...props} />
	),
);
MuiSidebarContent.displayName = "MuiSidebarContent";

// --- SidebarFooter ---

const MuiSidebarFooter = React.forwardRef<HTMLDivElement, BoxProps>(
	({ sx, ...props }, ref) => <Box ref={ref} sx={{ ...sx }} {...props} />,
);
MuiSidebarFooter.displayName = "MuiSidebarFooter";

// --- SidebarSeparator ---

const MuiSidebarSeparator = React.forwardRef<HTMLHRElement, DividerProps>(
	({ sx, ...props }, ref) => (
		<Divider
			ref={ref}
			sx={{ borderBottomWidth: 2, borderColor: "divider", ...sx }}
			{...props}
		/>
	),
);
MuiSidebarSeparator.displayName = "MuiSidebarSeparator";

// --- SidebarMenu ---

const MuiSidebarMenu = React.forwardRef<HTMLUListElement, ListProps>(
	({ sx, ...props }, ref) => (
		<List ref={ref} sx={{ pt: 2, ...sx }} {...props} />
	),
);
MuiSidebarMenu.displayName = "MuiSidebarMenu";

// --- SidebarMenuItem ---

const MuiSidebarMenuItem = React.forwardRef<HTMLLIElement, ListItemProps>(
	({ sx, ...props }, ref) => (
		<ListItem ref={ref} disablePadding sx={{ px: 1, ...sx }} {...props} />
	),
);
MuiSidebarMenuItem.displayName = "MuiSidebarMenuItem";

// --- SidebarMenuButton ---

type MuiSidebarMenuButtonProps = ListItemButtonProps & {
	tooltip?: string;
	component?: React.ElementType;
	href?: string;
};

const MuiSidebarMenuButton = React.forwardRef<
	HTMLDivElement,
	MuiSidebarMenuButtonProps
>(({ tooltip, sx, children, ...props }, ref) => {
	const { open } = useMuiSidebar();

	const button = (
		<ListItemButton
			ref={ref}
			sx={{
				borderRadius: 3,
				minHeight: 48,
				px: 2,
				justifyContent: open ? "initial" : "center",
				...sx,
			}}
			{...props}
		>
			{children}
		</ListItemButton>
	);

	if (!tooltip || open) return button;

	return (
		<Tooltip title={tooltip} placement="right">
			{button}
		</Tooltip>
	);
});
MuiSidebarMenuButton.displayName = "MuiSidebarMenuButton";

// --- SidebarMenuIcon ---

const MuiSidebarMenuIcon = React.forwardRef<HTMLDivElement, ListItemIconProps>(
	({ sx, ...props }, ref) => {
		const { open } = useMuiSidebar();

		return (
			<ListItemIcon
				ref={ref}
				sx={{
					minWidth: 0,
					mr: open ? 3 : "auto",
					justifyContent: "center",
					color: "action.active",
					...sx,
				}}
				{...props}
			/>
		);
	},
);
MuiSidebarMenuIcon.displayName = "MuiSidebarMenuIcon";

// --- SidebarMenuText ---

const MuiSidebarMenuText = React.forwardRef<HTMLDivElement, ListItemTextProps>(
	({ primaryTypographyProps, ...props }, ref) => {
		const { open } = useMuiSidebar();
		return (
			<ListItemText
				ref={ref}
				primaryTypographyProps={{
					fontSize: "1.125rem",
					fontWeight: 500,
					noWrap: true,
					...primaryTypographyProps,
				}}
				sx={{
					opacity: open ? 1 : 0,
					transition: "opacity 0s ease-in-out",
					whiteSpace: "nowrap",
				}}
				{...props}
			/>
		);
	},
);
MuiSidebarMenuText.displayName = "MuiSidebarMenuText";

// --- SidebarInset (main content area) ---

const MuiSidebarInset = React.forwardRef<HTMLDivElement, BoxProps>(
	({ sx, ...props }, ref) => (
		<Box
			ref={ref}
			component="main"
			sx={{ flexGrow: 1, width: "100%", ...sx }}
			{...props}
		/>
	),
);
MuiSidebarInset.displayName = "MuiSidebarInset";

export {
	MuiSidebar,
	MuiSidebarContent,
	MuiSidebarFooter,
	MuiSidebarHeader,
	MuiSidebarInset,
	MuiSidebarMenu,
	MuiSidebarMenuButton,
	MuiSidebarMenuIcon,
	MuiSidebarMenuItem,
	MuiSidebarMenuText,
	MuiSidebarProvider,
	MuiSidebarSeparator,
	SIDEBAR_WIDTH,
	SIDEBAR_WIDTH_COLLAPSED,
	useMuiSidebar,
};
