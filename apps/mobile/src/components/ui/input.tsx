import { useColorScheme } from "nativewind";
import { useState } from "react";
import { Pressable, TextInput, type TextInputProps, View } from "react-native";
import { Text } from "@/components/ui/text";
import { colorsFor } from "@/lib/theme";
import { cn } from "@/lib/utils";

/**
 * Native counterpart to MUI's outlined `<TextField>`, which is what the Figma
 * wireframes use for every text and time input.
 *
 * `FieldShell` is the bordered box on its own, so anything that looks like a
 * field but is not a `TextInput` — the time pickers, a future select — sits on
 * exactly the same geometry and states instead of re-describing the border.
 */

/** Height of the box. MUI's outlined field is 56px at the default size. */
const FIELD_HEIGHT = 56;

type FieldState = {
	focused?: boolean;
	invalid?: boolean;
	disabled?: boolean;
};

export function FieldShell({
	children,
	focused = false,
	invalid = false,
	disabled = false,
	className,
	startAdornment,
	endAdornment,
}: FieldState & {
	children: React.ReactNode;
	className?: string;
	startAdornment?: React.ReactNode;
	endAdornment?: React.ReactNode;
}) {
	return (
		<View
			className={cn(
				"flex-row items-center rounded-control border px-[14px]",
				// Border carries the state; the fill stays the page colour so the
				// field reads the same on white and on the dark ground.
				invalid
					? "border-destructive"
					: focused
						? "border-primary"
						: "border-input-outlined",
				focused && !invalid && "border-2",
				disabled && "opacity-50",
				className,
			)}
			style={{ height: FIELD_HEIGHT }}
		>
			{startAdornment ? <View className="pr-2">{startAdornment}</View> : null}
			{children}
			{endAdornment ? <View className="pl-2">{endAdornment}</View> : null}
		</View>
	);
}

type InputProps = TextInputProps & {
	/** Rendered before the text, e.g. a 24px icon. */
	startAdornment?: React.ReactNode;
	endAdornment?: React.ReactNode;
	/** Turns the border red and colours the message below. */
	invalid?: boolean;
	/** Shown under the field. Pair with `invalid` for an error message. */
	helperText?: string;
	containerClassName?: string;
};

export function Input({
	className,
	containerClassName,
	startAdornment,
	endAdornment,
	invalid = false,
	helperText,
	editable = true,
	onFocus,
	onBlur,
	...props
}: InputProps) {
	const { colorScheme } = useColorScheme();
	const colors = colorsFor(colorScheme);
	const [focused, setFocused] = useState(false);

	return (
		// `w-full` by default: the wrapper is a plain View, so under a parent with
		// `items-center` it would otherwise shrink to its content and collapse the
		// field. Override via `containerClassName` (e.g. `flex-1` inside a row).
		<View className={cn("w-full gap-1", containerClassName)}>
			<FieldShell
				disabled={!editable}
				endAdornment={endAdornment}
				focused={focused}
				invalid={invalid}
				startAdornment={startAdornment}
			>
				<TextInput
					className={cn(
						// `font-figtree` is explicit: TextInput is not our `Text`, so it
						// inherits neither the family nor the foreground colour.
						"h-full flex-1 font-figtree text-field text-foreground",
						className,
					)}
					editable={editable}
					onBlur={(e) => {
						setFocused(false);
						onBlur?.(e);
					}}
					onFocus={(e) => {
						setFocused(true);
						onFocus?.(e);
					}}
					placeholderTextColor={colors.mutedForeground}
					selectionColor={colors.primary}
					{...props}
				/>
			</FieldShell>

			{helperText ? (
				<Text
					className={cn(
						"px-4 text-helper",
						invalid ? "text-destructive" : "text-muted-foreground",
					)}
				>
					{helperText}
				</Text>
			) : null}
		</View>
	);
}

/**
 * A field-shaped button: same box as `Input`, but the value is chosen through
 * something other than the keyboard. Backs the start/end time pickers.
 */
export function FieldButton({
	value,
	placeholder,
	onPress,
	startAdornment,
	endAdornment,
	invalid = false,
	disabled = false,
	accessibilityLabel,
	className,
}: {
	/** Formatted value, or undefined to show the placeholder. */
	value?: string;
	placeholder: string;
	onPress: () => void;
	startAdornment?: React.ReactNode;
	endAdornment?: React.ReactNode;
	invalid?: boolean;
	disabled?: boolean;
	accessibilityLabel?: string;
	className?: string;
}) {
	return (
		<Pressable
			accessibilityLabel={accessibilityLabel ?? placeholder}
			accessibilityRole="button"
			accessibilityState={{ disabled }}
			className={className}
			disabled={disabled}
			onPress={onPress}
		>
			<FieldShell
				disabled={disabled}
				endAdornment={endAdornment}
				invalid={invalid}
				startAdornment={startAdornment}
			>
				<Text
					className={cn(
						"flex-1 text-field",
						value ? "text-foreground" : "text-muted-foreground",
					)}
					numberOfLines={1}
				>
					{value ?? placeholder}
				</Text>
			</FieldShell>
		</Pressable>
	);
}
