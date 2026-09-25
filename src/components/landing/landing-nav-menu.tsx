"use client";

import { Menu as MenuIcon } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";

export type LandingNavLink = { title: string; href: string };

export function LandingNavMenu({ links }: { links: LandingNavLink[] }) {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	return (
		<>
			<IconButton
				aria-label="Open navigation menu"
				aria-controls={open ? "landing-nav-menu" : undefined}
				aria-haspopup="true"
				aria-expanded={open ? "true" : undefined}
				onClick={(e) => setAnchorEl(e.currentTarget)}
				sx={{ display: { xs: "inline-flex", sm: "none" } }}
			>
				<MenuIcon />
			</IconButton>
			<Menu
				id="landing-nav-menu"
				disableScrollLock
				anchorEl={anchorEl}
				open={open}
				onClose={() => setAnchorEl(null)}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
				transformOrigin={{ vertical: "top", horizontal: "right" }}
			>
				{links.map((link) => (
					<MenuItem
						key={link.href}
						component="a"
						href={link.href}
						onClick={() => setAnchorEl(null)}
					>
						{link.title}
					</MenuItem>
				))}
			</Menu>
		</>
	);
}
