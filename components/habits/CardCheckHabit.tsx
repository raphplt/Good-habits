import React, { memo, useEffect, useState } from "react";
import { View, Pressable, Text } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	interpolate,
	withSpring,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { Iconify } from "react-native-iconify";

// Imports personnalisés
import usePoints from "@hooks/usePoints";
import { useTheme } from "@context/ThemeContext";
import { useData } from "@context/DataContext";
import { useHabits } from "@context/HabitsContext";
import { UserHabit } from "@type/userHabit";
import { setHabitLog } from "@db/logs";
import useHabitTimer from "@hooks/useHabitTimer";
import ZoomableView from "@components/Shared/ZoomableView";
import { setRewards } from "@db/rewards";
import useAddXp from "@hooks/useAddXp";
import { CategoryTypeSelect } from "@utils/category.type";
import { incrementStreak } from "@db/streaks";
import RestartHabit from "@components/Modals/RestartHabit";
import { useNavigation } from "expo-router";
import { lightenColor } from "@utils/colors";
import BouncyCheckbox from "react-native-bouncy-checkbox";

function CardCheckHabit({
	habit,
	onHabitStatusChange,
}: {
	habit: UserHabit;
	onHabitStatusChange?: (habit: UserHabit, completed: boolean) => void;
}) {
	const { date, completedHabitsToday, setCompletedHabitsToday, setStreak } =
		useData();
	const { theme } = useTheme();
	const { setCurrentHabit } = useHabits();
	const { addOdysseePoints } = usePoints();
	const { startTimer } = useHabitTimer();
	const addXp = useAddXp()?.addXp;
	const { t } = useTranslation();

	const [showDetails, setShowDetails] = useState(false);
	const [completed, setCompleted] = useState(false);
	const [showModalNegative, setShowModalNegative] = useState(false);

	const navigation: NavigationProp<ParamListBase> = useNavigation();

	const translateX = useSharedValue(0);
	const opacity = useSharedValue(0);
	const progress = useSharedValue(0);

	const animatedStyles = useAnimatedStyle(() => {
		return {
			opacity: opacity.value,
			transform: [{ translateX: translateX.value }],
		};
	});

	const detailsAnimatedStyle = useAnimatedStyle(() => {
		return {
			height: interpolate(progress.value, [0, 1], [0, 70]),
			opacity: progress.value,
		};
	});

	useEffect(() => {
		opacity.value = withTiming(1, { duration: 200 });
		return () => {
			opacity.value = withTiming(0, { duration: 200 });
		};
	}, []);

	useEffect(() => {
		const isCompleted = completedHabitsToday.some((h) => h.id === habit.id);
		setCompleted(isCompleted);
	}, [completedHabitsToday]);

	useEffect(() => {
		progress.value = withSpring(showDetails ? 1 : 0, { damping: 20, stiffness: 90 });
	}, [showDetails]);

	const goHabitDetail = () => {
		setCurrentHabit(habit);
		navigation.navigate("habitDetail");
	};

	const startHabit = () => {
		setCurrentHabit(habit);
		startTimer(habit);
		navigation.navigate("timerHabit");
	};

	const setHabitDone = async () => {
		try {
			if (completed) return;
			setCompleted(true);
			await setHabitLog(habit.id, date);

			if (addXp) {
				await addXp(habit, 10 * habit.difficulty);
			}

			// Points et récompenses
			addOdysseePoints(habit.difficulty);
			setRewards("odyssee", habit.difficulty * 2);

			// Gestion du streak
			const streak = await incrementStreak();
			if (streak) {
				setStreak(streak);
			}
			setCompletedHabitsToday((prev) => [...prev, habit]);
		} catch (error) {
			console.error("Erreur lors de l'ajout du log :", error);
		}

		if (onHabitStatusChange) {
			onHabitStatusChange(habit, true);
		}
	};

	const isNegative = habit.type === CategoryTypeSelect.negative;
	return (
		<Animated.View
			style={[animatedStyles]}
			className="w-11/12 mx-auto my-[5px] flex flex-row items-center justify-between"
		>
			<View style={{ flexBasis: "12%" }}>
				<BouncyCheckbox
					size={25}
					fillColor={theme.colors.primary}
					useBuiltInState={false}
					isChecked={completed}
					onPress={setHabitDone}
				/>
			</View>
			<Pressable
				onPress={() => setShowDetails(!showDetails)}
				style={{
					backgroundColor: completed
						? isNegative
							? theme.colors.redSecondary
							: lightenColor(habit.color, 0.15)
						: theme.colors.cardBackground,
					borderColor: completed
						? habit.color
						: isNegative
						? theme.colors.redPrimary
						: theme.colors.border,
				}}
				className="flex-1 flex flex-col rounded-xl z-10"
			>
				<View className="flex items-center flex-row justify-between px-3 py-[13px] w-full">
					<View className="flex flex-row items-center justify-start">
						<FontAwesome6
							name={habit.icon || "question"}
							size={18}
							color={habit.color || theme.colors.text}
						/>
						<Text
							style={{ color: theme.colors.text }}
							className="text-[16px] font-semibold w-[85%] ml-2"
							numberOfLines={1}
							ellipsizeMode="tail"
						>
							{habit.name}
						</Text>
					</View>
					<Pressable
						onPress={() => setShowDetails(!showDetails)}
						className="flex items-center justify-center relative"
					>
						{showDetails ? (
							<Iconify
								icon="mdi:chevron-up"
								color={theme.colors.textTertiary}
								size={24}
							/>
						) : (
							<Iconify
								icon="mdi:chevron-down"
								color={theme.colors.textTertiary}
								size={24}
							/>
						)}
					</Pressable>
				</View>
				<Animated.View style={[detailsAnimatedStyle]}>
					{showDetails && (
						<View className="flex flex-row items-center justify-around">
							<ZoomableView
								style={{
									backgroundColor: theme.colors.background,
									borderWidth: 1,
									borderColor: theme.colors.primary,
								}}
								className="py-[10px] px-5 rounded-2xl flex-1 mx-4"
							>
								<Pressable
									onPress={goHabitDetail}
									className="flex flex-row items-center justify-center"
								>
									<Iconify
										icon="mdi:information"
										color={theme.colors.primary}
										size={20}
									/>
									<Text
										className="text-[16px] font-semibold ml-2"
										style={{ color: theme.colors.primary }}
									>
										{t("details")}
									</Text>
								</Pressable>
							</ZoomableView>

							{!completed && habit.duration ? (
								<ZoomableView
									style={{
										backgroundColor: theme.colors.primary,
										borderWidth: 2,
										borderColor: theme.colors.primary,
									}}
									className="py-[10px] px-5 rounded-2xl flex-1 mx-4"
								>
									<Pressable
										onPress={isNegative ? setHabitDone : startHabit}
										className="flex flex-row items-center justify-center"
									>
										{isNegative ? (
											<Iconify icon="ri:reset-right-fill" color="white" size={20} />
										) : (
											<Iconify icon="bi:play" color="white" size={20} />
										)}
										<Text className="text-[16px] text-white font-semibold ml-2">
											{habit.type === CategoryTypeSelect.negative
												? t("relaunch")
												: t("start")}
										</Text>
									</Pressable>
								</ZoomableView>
							) : (
								<View
									className="flex flex-row items-center justify-center py-[10px] px-5 rounded-2xl flex-1 mx-4"
									style={{
										backgroundColor: theme.colors.primary,
										borderWidth: 2,
										borderColor: theme.colors.primary,
									}}
								>
									<Iconify icon="bi:check" color="white" size={20} />
									<Text className="text-[16px] font-semibold ml-2 text-white">
										{t("done")}
									</Text>
								</View>
							)}
						</View>
					)}
				</Animated.View>
			</Pressable>
			<RestartHabit
				visible={showModalNegative}
				setVisible={setShowModalNegative}
				habit={habit}
			/>
		</Animated.View>
	);
}

export default memo(CardCheckHabit);
