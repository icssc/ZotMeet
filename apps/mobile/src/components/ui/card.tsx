import { View, type ViewProps } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: ViewProps) {
	return (
		<View
			className={cn("rounded-lg border border-border bg-card p-4", className)}
			{...props}
		/>
	);
}

export function CardTitle({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<Text
			className={cn(
				"font-figtree-semibold text-base text-card-foreground",
				className,
			)}
		>
			{children}
		</Text>
	);
}

export function CardDescription({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<Text className={cn("mt-1 text-muted-foreground text-sm", className)}>
			{children}
		</Text>
	);
}
