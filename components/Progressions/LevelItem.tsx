import React from "react";
import { Text, View, Dimensions, Pressable } from "react-native";
import * as Progress from "react-native-progress";
import { useTheme } from "@context/ThemeContext";
import { CombinedLevel } from "@type/levels";
import { useTranslation } from "react-i18next";
import { useData } from "@context/DataContext";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";
import ZoomableView from "@components/Shared/ZoomableView";
import { lightenColor } from "@utils/colors";

const LevelItem = ({ level }: { level: CombinedLevel }) => {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const { width } = Dimensions.get("window");
	const { setSelectedLevel } = useData();
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	const itemSize = (width - 40) / 2;
	
	return (
		<ZoomableView>
			<Pressable
				style={{
					backgroundColor: lightenColor(level.color) ?? theme.colors.background,
					width: itemSize,
					height: itemSize,
				}}
				className="p-3 rounded-xl my-2"
				onPress={() => {
					setSelectedLevel(level);
					navigation.navigate("levelDetail");
				}}
			>
				<View className="flex flex-col items-center justify-between h-full">
					<View className="flex flex-row items-start gap-1 px-1">
						<FontAwesome6
							name={level.icon || "question"}
							size={18}
							color={level.color || theme.colors.primary}
						/>
						<Text
							style={{
								color: theme.colors.text,
							}}
							className="font-bold ml-2 w-10/12 text-base"
						>
							{t(level.slug)}
						</Text>
					</View>

					<View className="flex flex-col items-center justify-center flex-1 gap-y-2">
						<Text
							className="text-sm font-semibold"
							style={{
								color: theme.colors.textTertiary,
							}}
						>
							{t("level_title")} :
						</Text>
						<View className="flex items-center justify-center">
							<Progress.Circle
								progress={level.currentXp / level.nextLevelXp}
								color={level.color || theme.colors.primary}
								borderWidth={0}
								unfilledColor={theme.colors.border}
								size={80}
								thickness={8}
							/>
							<Text className="absolute font-bold text-2xl">{level.currentLevel}</Text>
						</View>
					</View>
				</View>
			</Pressable>
		</ZoomableView>
	);
};

export default LevelItem;