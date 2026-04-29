import "@mui/material/Button";

declare module "@mui/material/Button" {
	interface ButtonPropsSizeOverrides {
		square: true;
	}
}
