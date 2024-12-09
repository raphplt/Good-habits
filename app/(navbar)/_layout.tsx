import { Tabs, useNavigation } from "expo-router";
import { StatusBar, Text, View } from "react-native";
import { useContext, useEffect } from "react";
import LoaderScreen from "@components/Shared/LoaderScreen";
import CustomTabBar from "@components/Shared/CustomTabBar";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useSession } from "@context/UserContext";
import { ThemeContext, useTheme } from "@context/ThemeContext";
import Melios from "@components/Svg/Melios";
import LayoutTopRight from "@components/Shared/LayoutTopRight";
import { useTranslation } from "react-i18next";

const createHeaderStyle = (backgroundColor: string) => ({
	backgroundColor,
	shadowColor: "transparent",
});

const createTabOptions = (
	title: string,
	headerLeft?: () => JSX.Element,
	headerRight?: () => JSX.Element,
	headerTitleStyleOverride?: object,
	headerBackgroundColor: string = "transparent"
) => ({
	title,
	headerTitleStyle: headerTitleStyleOverride || {},
	headerStyle: createHeaderStyle(headerBackgroundColor),
	headerLeft,
	headerRight,
});

const TabLayout: React.FC = () => {
	const { user, isLoading } = useSession();
	const { theme } = useTheme();
	const { t } = useTranslation();
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	useEffect(() => {
		if (!isLoading && !user) {
			navigation.navigate("login");
		}
	}, [isLoading, user, navigation]);

	if (isLoading) return <LoaderScreen text={t("loading")} />;

	return (
		<>
			<StatusBar
				barStyle={theme.dark ? "light-content" : "dark-content"}
				backgroundColor={"transparent"}
			/>
			<Tabs tabBar={(props) => <CustomTabBar {...props} />}>
				<Tabs.Screen
					name="index"
					options={createTabOptions(
						"Accueil",
						() => (
							<View style={{ marginLeft: 15 }}>
								<Melios fill={theme.colors.text} />
							</View>
						),
						() => (
							<LayoutTopRight />
						),
						{ display: "none" }
					)}
				/>
				<Tabs.Screen
					name="progression"
					options={createTabOptions(
						"",
						() => (
							<Text
								style={{
									fontSize: 20,
									color: theme.colors.text,
									marginLeft: 15,
									fontWeight: "bold",
								}}
							>
								{t("progression")}
							</Text>
						),
						() => (
							<LayoutTopRight />
						),
						undefined,
						theme.colors.backgroundTertiary
					)}
				/>
				<Tabs.Screen
					name="recompenses"
					options={createTabOptions(
						"",
						() => (
							<Text
								style={{
									fontSize: 20,
									color: theme.colors.text,
									marginLeft: 15,
									fontWeight: "bold",
								}}
							>
								{t("rewards")}
							</Text>
						),
						() => (
							<LayoutTopRight />
						)
					)}
				/>
				<Tabs.Screen
					name="agora"
					options={createTabOptions("Agora", undefined, () => (
						<LayoutTopRight />
					))}
				/>
			</Tabs>
		</>
	);
};

export default TabLayout;