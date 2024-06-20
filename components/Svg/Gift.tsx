import { useContext } from "react";
import Svg, { Ellipse, Path } from "react-native-svg";
import { ThemeContext } from "../ThemeContext";

export default function Gift({ ...props }) {
	return (
		<Svg width="25" height="24" viewBox="0 0 25 24" fill="none">
			<Path
				d="M1.54785 9.28071C1.54785 8.24775 1.54785 7.73127 1.86875 7.41038C2.18965 7.08948 2.70612 7.08948 3.73908 7.08948H21.2689C22.3019 7.08948 22.8183 7.08948 23.1392 7.41038C23.4601 7.73127 23.4601 8.24775 23.4601 9.2807V11.7082C23.4601 12.3909 23.4601 12.7322 23.3133 12.9865C23.2172 13.153 23.0789 13.2913 22.9123 13.3875C22.6581 13.5343 22.3168 13.5343 21.6341 13.5343V13.5343C20.9514 13.5343 20.6101 13.5343 20.3559 13.681C20.1893 13.7772 20.051 13.9155 19.9549 14.0821C19.8081 14.3363 19.8081 14.6776 19.8081 15.3603V20.3657C19.8081 21.3987 19.8081 21.9152 19.4872 22.2361C19.1663 22.557 18.6498 22.557 17.6169 22.557H7.39112C6.35817 22.557 5.84169 22.557 5.52079 22.2361C5.1999 21.9152 5.1999 21.3987 5.1999 20.3657V15.3603C5.1999 14.6776 5.1999 14.3363 5.05311 14.0821C4.95695 13.9155 4.81864 13.7772 4.65209 13.681C4.39785 13.5343 4.05653 13.5343 3.37387 13.5343V13.5343C2.69122 13.5343 2.3499 13.5343 2.09566 13.3875C1.9291 13.2913 1.7908 13.153 1.69464 12.9865C1.54785 12.7322 1.54785 12.3909 1.54785 11.7082V9.28071Z"
				stroke={props.color}
				strokeWidth="2"
			/>
			<Path
				d="M3.98242 13.5342H21.0253"
				stroke={props.color}
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<Path
				d="M12.5039 5.80042L12.5039 22.5569"
				stroke={props.color}
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<Path
				d="M12.5039 5.80048L11.3946 4.62592C10.1235 3.28011 8.54992 2.25671 6.80429 1.64061V1.64061C5.42679 1.15443 3.98242 2.17634 3.98242 3.63712V4.25015C3.98242 5.1792 4.56829 6.00726 5.44436 6.31646L7.63447 7.08944"
				stroke={props.color}
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<Path
				d="M12.5044 5.80048L13.6137 4.62592C14.8848 3.28011 16.4584 2.25671 18.204 1.64061V1.64061C19.5815 1.15443 21.0259 2.17634 21.0259 3.63712V4.25015C21.0259 5.1792 20.44 6.00726 19.5639 6.31646L17.3738 7.08944"
				stroke={props.color}
				strokeWidth="2"
				strokeLinecap="round"
			/>
		</Svg>
	);
}
