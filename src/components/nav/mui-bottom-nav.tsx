"use client";

import { Apartment, CalendarMonth, Groups, Person } from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
	{ label: "Meetings", value: "/summary", icon: CalendarMonth },
	{ label: "Groups", value: "/groups", icon: Groups },
	{ label: "Rooms", value: "/studyrooms", icon: Apartment },
	{ label: "Profile", value: "/profile", icon: Person },
];

export function MuiBottomNav() {
	const pathname = usePathname();
	const router = useRouter();

	const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
		router.push(newValue);
	};

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
