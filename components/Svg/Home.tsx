import { useContext } from "react";
import Svg, { Ellipse, Path } from "react-native-svg";
import { ThemeContext } from "../ThemeContext";

export default function Home({ ...props }) {
	const { theme } = useContext(ThemeContext);
	return (
		<Svg width="25" height="27" viewBox="0 0 25 27" fill="none">
			<Path
				d="M1.72363 13.291C1.72363 11.3446 1.72363 10.3713 2.15321 9.51582C2.58279 8.66034 3.38954 8.02696 5.00304 6.7602L6.5682 5.5314C9.4846 3.24175 10.9428 2.09692 12.6798 2.09692C14.4167 2.09692 15.8749 3.24175 18.7913 5.5314L20.3565 6.7602C21.97 8.02696 22.7768 8.66034 23.2063 9.51582C23.6359 10.3713 23.6359 11.3446 23.6359 13.291V19.3701C23.6359 22.0733 23.6359 23.4249 22.7191 24.2647C21.8022 25.1045 20.3266 25.1045 17.3753 25.1045H7.98428C5.03298 25.1045 3.55733 25.1045 2.64048 24.2647C1.72363 23.4249 1.72363 22.0733 1.72363 19.3701V13.291Z"
				stroke={theme.colors.primary}
				strokeWidth="2"
			/>
			<Path
				d="M16.5929 25.1046V17.8187C16.5929 17.0921 16.0038 16.503 15.2772 16.503H10.0828C9.35616 16.503 8.76709 17.0921 8.76709 17.8187V25.1046"
				stroke={theme.colors.primary}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</Svg>
	);
}
