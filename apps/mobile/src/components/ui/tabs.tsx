import * as TabsPrimitive from "@rn-primitives/tabs";
import { createContext, useContext } from "react";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

/**
 * Native counterpart to the web app's `@radix-ui/react-tabs` wrapper. Same
 * Root / List / Trigger / Content shape, styled with the shared tokens.
 *
 * Two looks are supported:
 * - `segmented` (default) — the shadcn pill group.
 * - `underline` — MUI's `<Tabs>`, which is what the hi-fi wireframes use:
 *   flat labels with a 2px primary indicator under the selected one.
 */
type TabsVariant = "segmented" | "underline";

const TabsVariantContext = createContext<TabsVariant>("segmented");

const Tabs = TabsPrimitive.Root;

function TabsList({
	className,
	variant = "segmented",
	...props
}: TabsPrimitive.ListProps & {
	ref?: React.Ref<TabsPrimitive.ListRef>;
	variant?: TabsVariant;
}) {
	return (
		<TabsVariantContext.Provider value={variant}>
			<TabsPrimitive.List
				className={cn(
					"flex-row items-center",
					variant === "segmented"
						? "justify-center rounded-md bg-muted p-1"
						: "items-start",
					className,
				)}
				{...props}
			/>
		</TabsVariantContext.Provider>
	);
}

function TabsTrigger({
	className,
	...props
}: TabsPrimitive.TriggerProps & { ref?: React.Ref<TabsPrimitive.TriggerRef> }) {
	const { value } = TabsPrimitive.useRootContext();
	const variant = useContext(TabsVariantContext);
	const active = props.value === value;

	if (variant === "underline") {
		return (
			<TabsPrimitive.Trigger
				className={cn(
					"items-center justify-center border-b-2 px-4 py-[9px]",
					active ? "border-b-primary" : "border-b-transparent",
					props.disabled && "opacity-50",
					className,
				)}
				{...props}
			/>
		);
	}

	return (
		<TabsPrimitive.Trigger
			className={cn(
				"flex-1 items-center justify-center rounded-sm px-3 py-1.5",
				active && "bg-background shadow-sm",
				props.disabled && "opacity-50",
				className,
			)}
			{...props}
		/>
	);
}

function TabsContent({
	className,
	...props
}: TabsPrimitive.ContentProps & { ref?: React.Ref<TabsPrimitive.ContentRef> }) {
	return <TabsPrimitive.Content className={cn("mt-2", className)} {...props} />;
}

/**
 * RN has no CSS cascade, so the label needs its own active/inactive styling.
 * Rendered inside a `<TabsTrigger>`, it reads the trigger's value from context.
 */
function TabsTriggerText({ children }: { children: React.ReactNode }) {
	const { value } = TabsPrimitive.useRootContext();
	const trigger = TabsPrimitive.useTriggerContext();
	const variant = useContext(TabsVariantContext);
	const active = trigger.value === value;

	if (variant === "underline") {
		// MUI keeps both tab labels at full contrast; only the indicator moves.
		return (
			<Text className="font-figtree-semibold text-button-md text-foreground capitalize">
				{children}
			</Text>
		);
	}

	return (
		<Text
			className={cn(
				"font-figtree-medium text-sm",
				active ? "text-foreground" : "text-muted-foreground",
			)}
		>
			{children}
		</Text>
	);
}

export { Tabs, TabsContent, TabsList, TabsTrigger, TabsTriggerText };
