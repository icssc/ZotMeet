import { Image } from "react-native";

/**
 * The coloured Google "G". The web app draws it as inline SVG
 * (`src/components/auth/google-logo.tsx`); there is no SVG renderer here, so
 * it is the same paths rasterised at 144px, shown at the web's 18px.
 */
export function GoogleLogo() {
	return (
		<Image
			source={require("@/assets/images/google-logo.png")}
			style={{ width: 18, height: 18 }}
			resizeMode="contain"
			accessibilityIgnoresInvertColors
		/>
	);
}
