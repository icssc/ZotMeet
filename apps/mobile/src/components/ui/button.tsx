import { cva, type VariantProps } from "class-variance-authority";
import { Pressable, type PressableProps } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

/** Mirrors the variant names used by the web app's shadcn `Button`. */
const buttonVariants = cva(
	"flex-row items-center justify-center gap-2 rounded-md active:opacity-80",
	{
		variants: {
			variant: {
				default: "bg-primary",
				secondary: "bg-secondary",
				outline: "border border-input bg-background",
				destructive: "bg-destructive",
				ghost: "bg-transparent",
			},
			size: {
				default: "h-11 px-4",
				sm: "h-9 px-3",
				lg: "h-12 px-6",
			},
		},
		defaultVariants: { variant: "default", size: "default" },
	},
);

const buttonTextVariants = cva("font-medium text-sm", {
	variants: {
		variant: {
			default: "text-primary-foreground",
			secondary: "text-secondary-foreground",
			outline: "text-foreground",
			destructive: "text-destructive-foreground",
			ghost: "text-foreground",
		},
	},
	defaultVariants: { variant: "default" },
});

type ButtonProps = PressableProps &
	VariantProps<typeof buttonVariants> & { label: string };

export function Button({
	className,
	variant,
	size,
	label,
	...props
}: ButtonProps) {
	return (
		<Pressable
			className={cn(buttonVariants({ variant, size }), className)}
			{...props}
		>
			<Text className={buttonTextVariants({ variant })}>{label}</Text>
		</Pressable>
	);
}

export { buttonTextVariants, buttonVariants };
