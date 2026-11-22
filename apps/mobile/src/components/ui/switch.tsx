import { useColorScheme } from "nativewind";
import { Switch as RNSwitch, type SwitchProps } from "react-native";
import { colorsFor } from "@/lib/theme";

/**
 * Native counterpart to MUI's `<Switch color="primary">` on the web. It keeps
 * the platform's own switch (iOS pill, Android material toggle) and only
 * swaps the "on" colour from system green to the ZotMeet pink token.
 */
export function Switch({ disabled, ...props }: SwitchProps) {
	const { colorScheme } = useColorScheme();
	const colors = colorsFor(colorScheme);

	return (
		<RNSwitch
			// iOS paints the track; Android also tints the thumb when on.
			trackColor={{ false: colors.border, true: colors.primary }}
			ios_backgroundColor={colors.border}
			thumbColor="#FFFFFF"
			disabled={disabled}
			style={disabled ? { opacity: 0.5 } : undefined}
			{...props}
		/>
	);
}
