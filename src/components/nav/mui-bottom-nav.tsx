"use client";

import {
	Apartment,
	CalendarMonth,
	Groups,
	Login,
	Person,
} from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useReturnToPath } from "@/hooks/use-return-to-path";
import { loginPathWithReturnTo } from "@/lib/auth/return-to";
import type { UserProfile } from "@/lib/auth/user";

const NAV_ROOTS = ["/summary", "/groups", "/studyrooms", "/profile"] as const;

function navValueFromPathname(pathname: string): string {
	if (pathname.startsWith("/auth/login")) {
		return "/auth/login";
	}
	for (const root of NAV_ROOTS) {
		if (pathname === root || pathname.startsWith(`${root}/`)) {
			return root;
		}
	}
	return pathname;
}

export function MuiBottomNav({ user }: { user: UserProfile | null }) {
	const pathname = usePathname();
	const returnToPath = useReturnToPath();
	const signInHref = loginPathWithReturnTo(returnToPath);
	const selectedValue = navValueFromPathname(pathname);

	const navItems = [
		{
			label: "Meetings",
			href: "/summary",
			value: "/summary",
			icon: CalendarMonth,
		},
		{ label: "Groups", href: "/groups", value: "/groups", icon: Groups },
		{
			label: "Rooms",
			href: "/studyrooms",
			value: "/studyrooms",
			icon: Apartment,
		},
		user
			? {
					label: "Profile",
					href: "/profile",
					value: "/profile",
					icon: Person,
				}
			: {
					label: "Sign In",
					href: signInHref,
					value: "/auth/login",
					icon: Login,
				},
	];

	return (
		<Paper
			sx={{
				position: "fixed",
				bottom: 0,
				left: 0,
				right: 0,
				zIndex: 1000,
			}}
			elevation={3}
		>
			<BottomNavigation value={selectedValue} showLabels>
				{navItems.map((item) => {
					const Icon = item.icon;
					return (
						<BottomNavigationAction
							key={item.value}
							LinkComponent={Link}
							href={item.href}
							label={item.label}
							value={item.value}
							icon={<Icon />}
						/>
					);
				})}
			</BottomNavigation>
		</Paper>
	);
}
