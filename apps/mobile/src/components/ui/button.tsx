import { cva, type VariantProps } from "class-variance-authority";
import { Pressable, type PressableProps } from "react-native";
import { Raised } from "@/components/ui/raised";
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
				/* MUI "contained" padding; height comes from the line box. */
				raised: "px-[22px] py-2",
			},
		},
		defaultVariants: { variant: "default", size: "default" },
	},
);

const buttonTextVariants = cva("font-figtree-medium text-sm", {
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

/** Ledge colour per variant, for the `elevated` (MUI "contained") treatment. */
const ledgeClassNames: Record<string, string> = {
	default: "bg-primary-ledge",
	secondary: "bg-elevation-3d",
	outline: "bg-elevation-3d",
	destructive: "bg-elevation-3d",
	ghost: "bg-transparent",
};

type ButtonProps = PressableProps &
	VariantProps<typeof buttonVariants> & {
		label: string;
		/**
		 * Renders the MUI "contained" 3D treatment from the web theme — a hard
		 * 4px ledge that the button sinks into when pressed. This is the shape
		 * the hi-fi wireframes use for primary actions.
		 */
		elevated?: boolean;
	};

export function Button({
	className,
	variant,
	size,
	label,
	elevated = false,
	...props
}: ButtonProps) {
	const text = (
		<Text
			className={cn(
				buttonTextVariants({ variant }),
				elevated && "font-figtree-semibold text-button-lg capitalize",
			)}
		>
			{label}
		</Text>
	);

	if (elevated) {
		return (
			<Raised
				accessibilityRole="button"
				className={cn(
					buttonVariants({ variant, size: "raised" }),
					"rounded-control",
					className,
				)}
				ledgeClassName={ledgeClassNames[variant ?? "default"]}
				radiusClassName="rounded-control"
				{...props}
			>
				{text}
			</Raised>
		);
	}

	return (
		<Pressable
			accessibilityRole="button"
			className={cn(buttonVariants({ variant, size }), className)}
			{...props}
		>
			{text}
		</Pressable>
	);
}

export { buttonTextVariants, buttonVariants };
