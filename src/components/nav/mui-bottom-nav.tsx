"use client";

import {
	Apartment,
	CalendarMonth,
	Groups,
	Login,
	Person,
} from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import type { UserProfile } from "@/lib/auth/user";

export function MuiBottomNav({ user }: { user: UserProfile | null }) {
	const pathname = usePathname();
	const router = useRouter();

	const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
		router.push(newValue);
	};

	const navItems = [
		{ label: "Meetings", value: "/summary", icon: CalendarMonth },
		{ label: "Groups", value: "/groups", icon: Groups },
		{ label: "Rooms", value: "/studyrooms", icon: Apartment },
		user
			? { label: "Profile", value: "/profile", icon: Person }
			: { label: "Sign In", value: "/auth/login/google", icon: Login },
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
			<BottomNavigation value={pathname} onChange={handleChange} showLabels>
				{navItems.map((item) => {
					const Icon = item.icon;
					return (
						<BottomNavigationAction
							key={item.value}
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
