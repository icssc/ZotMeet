"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Footer } from "./footer";

const isLanding = (pathname: string) => pathname === "/";

/**
 * Min-height for the content above the footer, matching the widths where the
 * footer renders, so the footer always starts below the fold.
 */
export function aboveFooterClass(pathname: string) {
	return isLanding(pathname) ? "min-h-screen" : "lg:min-h-screen";
}

export function SiteFooter() {
	const pathName = usePathname();

	return (
		<div className={cn(isLanding(pathName) ? "block" : "hidden lg:block")}>
			<Footer />
		</div>
	);
}
