import { useColorScheme } from "nativewind";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Icon } from "@/lib/icons";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Native counterpart to the web app's `AppleButton`: black on white, white on
 * black — Apple's rules, not the palette — hence the literal colours, like
 * the web's `isDark ? "#fff" : "#000"`. Pressing goes through the same
 * `signIn` as Google; the store declines it until a native Sign in with
 * Apple flow exists.
 */
export function AppleButton() {
	const { colorScheme } = useColorScheme();
	const signIn = useAuthStore((state) => state.signIn);
	const isDark = colorScheme === "dark";

	return (
		<Button
			variant="contained"
			size="large"
			flat
			className="bg-black dark:bg-white"
			onPress={() => signIn("apple")}
		>
			<Icon name="apple" size={20} color={isDark ? "#000" : "#fff"} />
			<Typography variant="button" className="text-white dark:text-black">
				Continue with Apple
			</Typography>
		</Button>
	);
}
