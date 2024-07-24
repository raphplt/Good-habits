import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../../components/ThemeContext";
import ToggleButton from "../../components/Switch";
import { onAuthStateChanged } from "firebase/auth";
import {
	Pressable,
	Image,
	StatusBar,
	Text,
	View,
	ScrollView,
} from "react-native";
import {
	DarkTheme,
	ThemeProvider,
	useNavigation,
} from "@react-navigation/native";
import { disconnectUser } from "../../db/users";
import { auth } from "../../db";
import { getMemberInfos } from "../../db/member";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useData } from "../../constants/DataContext";
import notifications from "../../hooks/notifications";
import LogoutButton from "../../components/Account/LogoutButton";
import UserInfos from "../../components/Account/UserInfos";
import LoginView from "../../components/Account/LoginView";
import { Iconify } from "react-native-iconify";

export default function Account() {
	const { theme, toggleTheme } = useContext(ThemeContext);
	const [isDarkTheme, setIsDarkTheme] = useState(theme.dark);
	const [isSignedIn, setIsSignedIn] = useState(false);
	const [memberInfos, setMemberInfos] = useState<any>([]);
	const isMounted = useRef(true);
	const [loading, setLoading] = useState(true);
	const {
		setHabits,
		setUncompletedHabitsData,
		setCompletedHabitsData,
		setPoints,
		sendNotification,
	} = useData();
	const { scheduleDailyNotification, cancelAllNotifications } = notifications();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setIsSignedIn(!!user);
		});

		return () => unsubscribe();
	}, []);

	useEffect(() => {
		(async () => {
			try {
				const data = await getMemberInfos();
				setMemberInfos(data);
				setLoading(false);
			} catch (error) {
				handleError(error);
				setMemberInfos([]);
				setLoading(false);
			}
		})();

		return () => {
			isMounted.current = false;
		};
	}, []);

	const handleToggleTheme = async () => {
		toggleTheme();
		const newTheme = !isDarkTheme;
		setIsDarkTheme(newTheme);
		await AsyncStorage.setItem("theme", newTheme ? "dark" : "light");
	};

	const handleLogout = async () => {
		setHabits([]);
		setUncompletedHabitsData([]);
		setCompletedHabitsData([]);
		setPoints({ odyssee: 0, rewards: 0 });

		await disconnectUser();
	};

	const navigation: any = useNavigation();

	const handleToggleNotifications = async () => {
		const notificationEnabled = await AsyncStorage.getItem("notificationEnabled");
		if (notificationEnabled === "true") {
			await AsyncStorage.setItem("notificationEnabled", "false");
			await cancelAllNotifications();
		} else {
			await AsyncStorage.setItem("notificationEnabled", "true");
			await scheduleDailyNotification();
		}
	};

	const handleError = (error: any) => {
		console.log("Index - Erreur lors de la récupération des habitudes : ", error);
	};

	loading && <Text>Loading...</Text>;

	return (
		<>
			<StatusBar
				barStyle={theme === DarkTheme ? "light-content" : "dark-content"}
				backgroundColor={
					theme === DarkTheme
						? theme.colors.backgroundSecondary
						: theme.colors.backgroundSecondary
				}
			/>
			<ThemeProvider value={theme}>
				<ScrollView
					showsVerticalScrollIndicator={false}
					className="h-[100vh]"
					style={{ backgroundColor: theme.colors.background }}
				>
					{isSignedIn ? (
						<View
							style={{ backgroundColor: theme.colors.background }}
							className="mb-4"
						>
							<View
								className="mx-auto flex flex-row pt-6 justify-center w-11/12 items-center mb-12"
								style={{ backgroundColor: theme.colors.background }}
							>
								<Image
									source={require("../../assets/images/pfp.jpg")}
									className="rounded-full mx-auto mt-4"
									style={{ width: 120, height: 120 }}
								/>
								<View
									className="mx-auto flex flex-col gap-5 max-w-[50%]"
									style={{ backgroundColor: theme.colors.background }}
								>
									<Text
										className=" ml-6 mb-4 text-xl mt-3"
										style={{ color: theme.colors.text }}
									>
										{memberInfos?.nom}
									</Text>
									<Text
										className=" ml-6 mb-4 text-lg mt-3"
										style={{ color: theme.colors.text }}
									>
										{auth.currentUser?.email}
									</Text>
								</View>
							</View>
						</View>
					) : (
						<LoginView theme={theme} navigation={navigation} />
					)}
					<View
						className="p-4 mb-6 w-[95%] mx-auto rounded-xl"
						style={{ backgroundColor: theme.colors.textSecondary }}
					>
						<View className="flex w-full font-semibold mx-auto mb-4 flex-row items-center ">
							<Text
								className=" text-lg font-semibold ml-3"
								style={{ color: theme.colors.text }}
							>
								Paramètres généraux
							</Text>
						</View>
						<View
							className="p-4 rounded-lg shadow-md mb-4"
							style={{ backgroundColor: theme.colors.background }}
						>
							<ToggleButton
								title="Mode sombre"
								onToggle={handleToggleTheme}
								value={isDarkTheme}
							/>
							<ToggleButton
								title="Notifications"
								onToggle={handleToggleNotifications}
								value={sendNotification}
							/>
						</View>
					</View>
					{memberInfos && Object.keys(memberInfos).length > 0 && (
						<UserInfos data={memberInfos} />
					)}
					<LogoutButton handleLogout={handleLogout} theme={theme} />
				</ScrollView>
				<View
					className="w-full mx-auto"
					style={{ backgroundColor: theme.colors.background }}
				>
					<Text
						className=" text-center text-sm"
						style={{ color: theme.colors.text }}
					>
						Melios v1.1.2 - © 2024 Melios. Tous droits réservés.
					</Text>
				</View>
			</ThemeProvider>
		</>
	);
}
