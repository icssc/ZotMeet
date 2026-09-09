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

export function CardTitle({ children }: { children: React.ReactNode }) {
	return (
		<Text className="font-semibold text-base text-card-foreground">
			{children}
		</Text>
	);
}

export function CardDescription({ children }: { children: React.ReactNode }) {
	return <Text className="mt-1 text-muted-foreground text-sm">{children}</Text>;
}
