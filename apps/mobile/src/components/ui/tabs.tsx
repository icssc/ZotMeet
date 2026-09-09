import * as TabsPrimitive from "@rn-primitives/tabs";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

/**
 * Native counterpart to the web app's `@radix-ui/react-tabs` wrapper. Same
 * Root / List / Trigger / Content shape, styled with the shared tokens.
 */
const Tabs = TabsPrimitive.Root;

function TabsList({
	className,
	...props
}: TabsPrimitive.ListProps & { ref?: React.Ref<TabsPrimitive.ListRef> }) {
	return (
		<TabsPrimitive.List
			className={cn(
				"flex-row items-center justify-center rounded-md bg-muted p-1",
				className,
			)}
			{...props}
		/>
	);
}

function TabsTrigger({
	className,
	...props
}: TabsPrimitive.TriggerProps & { ref?: React.Ref<TabsPrimitive.TriggerRef> }) {
	const { value } = TabsPrimitive.useRootContext();

	return (
		<TabsPrimitive.Trigger
			className={cn(
				"flex-1 items-center justify-center rounded-sm px-3 py-1.5",
				props.value === value && "bg-background shadow-sm",
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
	const active = trigger.value === value;

	return (
		<Text
			className={cn(
				"font-medium text-sm",
				active ? "text-foreground" : "text-muted-foreground",
			)}
		>
			{children}
		</Text>
	);
}

export { Tabs, TabsContent, TabsList, TabsTrigger, TabsTriggerText };
