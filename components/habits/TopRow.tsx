import { Ionicons } from "@expo/vector-icons";
import { View } from "../Themed";
import { Text } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useContext } from "react";
import { ThemeContext } from "../ThemContext";

export default function TopRow({ icon, color, text, number }: any) {
	const { theme } = useContext(ThemeContext);
	return (
		<View className="flex items-center justify-start flex-row w-10/12 bg-transparent mx-auto my-2">
			<View
				className="flex items-center justify-center rounded-full w-8 h-8 mr-2"
				style={{
					backgroundColor: color,
					borderColor: theme.colors.border,
				}}
			>
				<Text className="font-semibold text-[15px] text-white">
					{number > 0 && `${number}`}
				</Text>
			</View>
			<Text
				className="font-semibold text-[16px]"
				style={{ color: theme.colors.text }}
			>
				{text}
			</Text>
		</View>
	);
}
