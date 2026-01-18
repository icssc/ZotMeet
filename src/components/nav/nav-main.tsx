"use client";

import type { ElementType } from "react";
import { Collapsible } from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon: ElementType;
		isActive?: boolean;
		items?: {
			title: string;
			url: string;
		}[];
	}[];
}) {
	return (
		<SidebarGroup>
			<SidebarMenu>
				{items.map((item) => (
					<Collapsible key={item.title} asChild defaultOpen={item.isActive}>
						<SidebarMenuItem>
							<SidebarMenuButton
								asChild
								tooltip={item.title}
								className="h-12 rounded-xl px-4 py-2 hover:bg-gray-300 active:bg-gray-300/80"
							>
								<a href={item.url} className="space-x-4 text-gray-600">
									<item.icon className="min-h-6 max-w-fit grow" />
									<span className="text-xl">{item.title}</span>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</Collapsible>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
