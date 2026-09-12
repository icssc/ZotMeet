import { useColorScheme } from "nativewind";
import { Image, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Icon } from "@/lib/icons";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Native counterpart to the web app's `/auth/login` page
 * (`src/app/auth/login/page.tsx` + `src/components/auth/sign-in-buttons.tsx`):
 * the mascot, the heading, and the two OAuth buttons in an outlined paper.
 *
 * Both provider buttons drop the theme's 3D ledge to match the web, where the
 * sign-in buttons override the hover/active lift. The Google button is
 * `outlined`; Apple is a plain black (white in dark mode) fill, following
 * Apple's guidelines rather than the palette.
 */
export function SignIn() {
	const insets = useSafeAreaInsets();
	const { colorScheme } = useColorScheme();
	const signIn = useAuthStore((state) => state.signIn);
	// The Apple button is black-on-white / white-on-black by Apple's rules, not
	// the palette, so the glyph takes a literal like the web's `apple-button`.
	const isDark = colorScheme === "dark";

	return (
		<View
			className="flex-1 bg-background px-4 pt-4"
			style={{ paddingTop: insets.top + 16 }}
		>
			<Card className="items-center gap-4 px-6 py-14">
				<Image
					source={require("@/assets/images/mascot.png")}
					accessibilityLabel="mascot"
					style={{ width: 111, height: 111 }}
					resizeMode="contain"
					className="mb-6"
				/>

				<Typography variant="h5" align="center">
					Sign in to ZotMeet
				</Typography>

				<Card className="w-full max-w-80 gap-2 p-3">
					<ProviderButton
						variant="outlined"
						color="inherit"
						label="Continue with Google"
						icon={
							<Image
								source={require("@/assets/images/google-logo.png")}
								style={{ width: 18, height: 18 }}
								resizeMode="contain"
							/>
						}
						onPress={() => signIn("google")}
					/>
					<ProviderButton
						variant="contained"
						label="Continue with Apple"
						className="bg-black dark:bg-white"
						icon={
							<Icon name="apple" size={20} color={isDark ? "#000" : "#fff"} />
						}
						textClassName="text-white dark:text-black"
						onPress={() => signIn("apple")}
					/>
				</Card>
			</Card>
		</View>
	);
}

function ProviderButton({
	variant,
	color = "primary",
	label,
	icon,
	className,
	textClassName,
	onPress,
}: {
	variant: "outlined" | "contained";
	color?: "primary" | "inherit";
	label: string;
	icon: React.ReactNode;
	className?: string;
	textClassName?: string;
	onPress: () => void;
}) {
	return (
		<Button
			variant={variant}
			color={color}
			size="large"
			flat
			className={className}
			onPress={onPress}
		>
			{icon}
			<Typography variant="button" className={textClassName}>
				{label}
			</Typography>
		</Button>
	);
}
