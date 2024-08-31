import { Theme } from "../types/themes";

const DefaultTheme: Theme = {
	dark: false,
	colors: {
		primary: "rgb(8, 32, 159)",
		background: "#ffffff",
		card: "#ffffff",
		text: "rgb(28, 28, 30)",
		textSecondary: "#F8F9FF",
		textTertiary: "rgb(78, 78, 80)",
		border: "rgb(213, 213, 221)",
		notification: "rgb(255, 59, 48)",
		backgroundSecondary: "rgb(240, 240, 240)",
		backgroundTertiary: "rgb(200, 200, 255)",
		cardBackground: "#F6F6F6",
		greenPrimary: "#41976C",
		greenSecondary: "#E6F5E8",
		yellowPrimary: "#D1A916",
		yellowSecondary: "#FFFBEA",
		redPrimary: "#FF6F61",
		redSecondary: "#FBEAEA",
		bluePrimary: "#448BAD",
		blueSecondary: "#EAF7FB",
		purplePrimary: "#955CD3",
		purpleSecondary: "#F5EAFB",
		grayPrimary: "#B0B0B0",
	},
};

const DarkTheme: Theme = {
	dark: true,
	colors: {
		primary: "rgb(10, 132, 255)",
		background: "#222222",
		card: "#222222",
		text: "rgb(229, 229, 231)",
		textSecondary: "rgb(39, 39, 41)",
		textTertiary: "rgb(179, 179, 181)",
		border: "rgb(213, 213, 221)",
		notification: "rgb(255, 69, 58)",
		backgroundSecondary: "#5A5A5A",
		backgroundTertiary: "rgb(200, 200, 255)",
		cardBackground: "#5A5A5A",
		greenPrimary: "#41976C",
		greenSecondary: "#E6F5E8",
		yellowPrimary: "#D1A916",
		yellowSecondary: "#FFFBEA",
		redPrimary: "#FF6F61",
		redSecondary: "#FBEAEA",
		bluePrimary: "#448BAD",
		blueSecondary: "#1E3A8A",
		purplePrimary: "#955CD3",
		purpleSecondary: "#F5EAFB",
		grayPrimary: "#B0B0B0",
	},
};

export { DefaultTheme, DarkTheme };