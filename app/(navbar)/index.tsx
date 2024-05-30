import React, { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../../components/ThemContext";
import {
	View,
	ScrollView,
	RefreshControl,
	Pressable,
	ActivityIndicator,
	StatusBar,
	Image,
} from "react-native";
import TopStats from "../../components/TopStats";
import { DarkTheme, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "react-native";
import { getMemberHabits, getMemberInfos } from "../../db/member";
import CardCheckHabit from "../../components/CardCheckHabit";
import moment from "moment";
import ActivitiesContainer from "../../components/ActivitiesContainer";
import { Entypo } from "@expo/vector-icons";

export default function Index() {
	const { theme } = useContext(ThemeContext);
	const navigation: any = useNavigation();
	const isMounted = useRef(true);
	const [userHabits, setUserHabits] = useState<any>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
	const [hours, setHours] = useState(new Date().getHours());
	const [completedHabits, setCompletedHabits] = useState([]);
	const [uncompletedHabits, setUncompletedHabits] = useState([]);
	const [memberInfos, setMemberInfos] = useState<any>([]);
	const [welcomeMessage, setWelcomeMessage] = useState("");
	const [showMissingHabits, setShowMissingHabits] = useState(false);

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

	useEffect(() => {
		(async () => {
			const username = memberInfos.nom;
			const time = new Date().getHours();
			if (time < 12) {
				setWelcomeMessage(`Bonjour, ${username} !`);
			}
			if (time >= 12 && time < 18) {
				setWelcomeMessage(`Bon après-midi, ${username} !`);
			}
			if (time >= 18) {
				setWelcomeMessage(`Bonsoir, ${username} !`);
			}
		})();
	}, [memberInfos.nom]);

	const onRefresh = async () => {
		setRefreshing(true);
		try {
			setShowMissingHabits(false);
			const data = await getMemberHabits();
			setUserHabits(data);
		} catch (error) {
			handleError(error);
		} finally {
			setRefreshing(false);
		}
	};

	useEffect(() => {
		const interval = setInterval(() => {
			setDate(moment().format("YYYY-MM-DD"));
			setHours(new Date().getHours());
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		(async () => {
			try {
				const data = await getMemberHabits();
				if (isMounted.current) {
					setUserHabits(data);
					setLoading(false);
				}
			} catch (error) {
				handleError(error);
				setUserHabits([]);
				setLoading(false);
			}
		})();

		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		const completedHabits = userHabits
			.filter((habit: any) => {
				if (habit.logs) {
					const lastLog = habit.logs[habit.logs.length - 1];

					if (lastLog && lastLog.date === date && lastLog.done === true) {
						return true;
					}
				}
			})
			.sort((a: any, b: any) => a.moment - b.moment);

		const uncompletedHabits = userHabits
			.filter((habit: any) => {
				if (habit.logs) {
					const lastLog = habit.logs[habit.logs.length - 1];

					if (lastLog && lastLog.date !== date) {
						return true;
					}
					if (lastLog && lastLog.date === date && lastLog.done === false) {
						return true;
					} else if (habit.logs.length === 0) {
						return true;
					}
				}
			})
			.sort((a: any, b: any) => a.moment - b.moment);
		setCompletedHabits(completedHabits);
		setUncompletedHabits(uncompletedHabits);
	}, [userHabits, date]);

	const handleError = (error: any) => {
		console.log("Index - Erreur lors de la récupération des habitudes : ", error);
	};

	const handleHabitStatusChange = (habit: any, done: boolean) => {
		if (done) {
			setCompletedHabits((prevHabits) => [...prevHabits, habit] as any);
			setUncompletedHabits((prevHabits) =>
				prevHabits.filter((oldHabit: any) => oldHabit.id !== habit.id)
			);
		} else {
			setUncompletedHabits((prevHabits) => [...prevHabits, habit] as any);
			setCompletedHabits((prevHabits) =>
				prevHabits.filter((oldHabit: any) => oldHabit.id !== habit.id)
			);
		}
	};

	if (loading) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator size="large" color={"#007aff"} />
				<Text style={{ color: theme.colors.text }} className="text-lg mt-8">
					Chargement des habitudes...
				</Text>
			</View>
		);
	}

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
			<ScrollView
				className=""
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			>
				<View style={{ backgroundColor: theme.colors.background }}>
					<TopStats habits={userHabits} />
				</View>
				<View
					style={{ backgroundColor: theme.colors.background }}
					className="flex justify-between flex-row items-center mt-4 w-10/12 mx-auto"
				>
					<Text style={{ color: theme.colors.text }} className="text-lg font-bold">
						{welcomeMessage}
					</Text>

					<Pressable
						onPress={() => navigation.navigate("select")}
						className="bg-blue-500 rounded-full p-2"
					>
						<Ionicons name="add" size={24} color="white" />
					</Pressable>
				</View>

				{userHabits.length > 0 ? (
					<View
						className="flex flex-row flex-wrap justify-center mt-2"
						style={{ backgroundColor: theme.colors.background }}
					>
						<View
							className="flex flex-row flex-wrap justify-start py-3 mb-2"
							style={{ backgroundColor: theme.colors.background }}
						>
							<View className="mx-auto">
								{uncompletedHabits.length > 0 &&
								uncompletedHabits.filter((habit: any) => habit.moment > hours).length >
									0 ? (
									<Text
										style={{ color: theme.colors.text }}
										className="w-10/12 mx-auto text-[16px] font-semibold mb-2"
									>
										<View className="flex items-center justify-center flex-row">
											<View>
												<Ionicons name="time" size={24} color={theme.colors.text} />
											</View>
											<Text className="ml-3 font-semibold text-[16px]">
												Prochaines habitudes
											</Text>
										</View>
									</Text>
								) : (
									<View className="border-green-500 bg-green-100 border-2 rounded-lg flex-col flex items-center justify-center mx-auto w-full py-2 px-4">
										<View className="flex flex-row items-center justify-center">
											<View className="mx-2">
												<Entypo name="trophy" size={24} color="black" />
											</View>
											<Text
												className="mx-2 font-semibold text-lg"
												style={{ color: theme.colors.text }}
											>
												Félicitations !
											</Text>
										</View>
										<Text
											style={{ color: theme.colors.text }}
											className="text-center w-3/4 mx-auto mt-2"
										>
											{completedHabits.length === userHabits.length
												? `Vous avez validé toutes vos habitudes pour aujourd'hui !`
												: `Vous n'avez pas d'habitudes à valider pour le moment.`}
										</Text>
									</View>
								)}
							</View>

							{uncompletedHabits
								.filter((habit: any) => habit.moment >= hours)
								.map((filteredHabit: any) => (
									<CardCheckHabit
										key={filteredHabit.id}
										habit={filteredHabit}
										onHabitStatusChange={handleHabitStatusChange}
									/>
								))}
						</View>
						<View
							className="flex flex-row flex-wrap justify-start py-3 mb-2"
							style={{ backgroundColor: theme.colors.background }}
						>
							<Text
								style={{ color: theme.colors.text }}
								className="w-10/12 mx-auto text-[16px] font-semibold mb-2"
							>
								<View className="flex items-center justify-center flex-row">
									<View>
										<Ionicons name="checkmark-done" size={24} color={theme.colors.text} />
									</View>
									<Text className="ml-3 font-semibold text-[16px]">
										Validées : {completedHabits.length}
									</Text>
								</View>
							</Text>

							{completedHabits.map((filteredHabit: any) => (
								<CardCheckHabit
									completed={true}
									key={filteredHabit.id}
									habit={filteredHabit}
									onHabitStatusChange={handleHabitStatusChange}
								/>
							))}
						</View>
						{uncompletedHabits.length > 0 &&
							uncompletedHabits.filter((habit: any) => habit.moment < hours).length >
								0 && (
								<View
									className="flex flex-row flex-wrap justify-start py-3 mb-2"
									style={{ backgroundColor: theme.colors.background }}
								>
									<Text
										style={{ color: theme.colors.text }}
										className="w-10/12 mx-auto text-[16px] font-semibold mb-2"
									>
										<Pressable onPress={() => setShowMissingHabits(!showMissingHabits)}>
											<View className="flex items-center justify-center flex-row">
												{showMissingHabits ? (
													<Ionicons name="chevron-up" size={24} color={theme.colors.text} />
												) : (
													<Ionicons
														name="chevron-down"
														size={24}
														color={theme.colors.text}
													/>
												)}
												<Text className="ml-3 font-semibold text-[16px]">Manquées</Text>
											</View>
										</Pressable>
									</Text>
									{showMissingHabits ? (
										uncompletedHabits
											.filter((habit: any) => habit.moment < hours)
											.map((filteredHabit: any) => (
												<CardCheckHabit
													key={filteredHabit.id}
													habit={filteredHabit}
													onHabitStatusChange={handleHabitStatusChange}
												/>
											))
									) : (
										<Pressable
											onPress={() => setShowMissingHabits(true)}
											className="rounded-2xl p-1 mt-2 px-6 mx-auto w-10/12"
											style={{
												borderColor: theme.colors.text,
												borderWidth: 1,
												backgroundColor: theme.colors.backgroundSecondary,
											}}
										>
											<Text style={{ color: theme.colors.text }} className="text-center">
												Afficher les habitudes manquées
											</Text>
										</Pressable>
									)}
								</View>
							)}
					</View>
				) : (
					<View className="flex flex-col py-24 items-center justify-center">
						<Image
							source={require("../../assets/images/illustrations/not_found.png")}
							style={{ width: 250, height: 250, resizeMode: "contain" }}
						/>
						<Text style={{ color: theme.colors.text }} className="text-center mt-6">
							Aucune habitude trouvée. Ajoutez-en une !
						</Text>
					</View>
				)}
				{userHabits.length > 0 && <ActivitiesContainer userHabits={userHabits} />}
			</ScrollView>
		</>
	);
}
