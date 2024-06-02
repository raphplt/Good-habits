import { ScrollViewStyleReset } from "expo-router/html";
import { SessionProvider } from "../constants/UserContext";

export default function Root({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />

				<meta
					name="viewport"
					content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1.00001,viewport-fit=cover"
				/>
				<ScrollViewStyleReset />
			</head>
			<body>{children}</body>
		</html>
	);
}
