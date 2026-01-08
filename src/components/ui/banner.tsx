"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface BannerProps {
	chip?: string;
	storageKey: string;
	children: React.ReactNode;
	className?: string;
}

export function Banner({ chip, storageKey, children, className }: BannerProps) {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const isDismissed = localStorage.getItem(storageKey);
		if (!isDismissed) {
			setIsVisible(true);
		}
	}, [storageKey]);

	const handleDismiss = () => {
		localStorage.setItem(storageKey, "true");
		setIsVisible(false);
	};

	if (!isVisible) return null;

	return (
		<div
			className={cn(
				"relative rounded-lg bg-primary px-4 py-3 text-white",
				className,
			)}
		>
			<div className="flex items-center justify-center gap-3 pr-8">
				{chip && (
					<span className="hidden items-center rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold lg:inline-flex">
						{chip}
					</span>
				)}
				<p className="text-sm font-medium">{children}</p>
			</div>
			<button
				onClick={handleDismiss}
				className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 transition-colors hover:bg-white/10"
				aria-label="Dismiss banner"
			>
				<X className="h-4 w-4" />
			</button>
		</div>
	);
}
