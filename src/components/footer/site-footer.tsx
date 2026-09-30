"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Footer } from "./footer";

export function SiteFooter() {
	const pathName = usePathname();
	const isLanding = pathName === "/";

	return (
		<div className={cn(isLanding ? "block" : "hidden md:block")}>
			<Footer />
		</div>
	);
}
