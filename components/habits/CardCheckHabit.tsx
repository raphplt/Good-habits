import React, { memo, useContext, useEffect, useState } from "react";
import { View, Pressable } from "react-native";
import { Text } from "react-native";
import Checkbox from "expo-checkbox";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import {
	NavigationProp,
	ParamListBase,
	useNavigation,
} from "@react-navigation/native";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	withTiming,
} from "react-native-reanimated";

// Customs imports
import { setMemberHabitLog } from "@db/member";
import { setRewards } from "@db/rewards";
import usePoints from "@hooks/usePoints";
import { ThemeContext } from "@context/ThemeContext";
import { difficulties } from "@utils/habitsUtils";
import { useData } from "@context/DataContext";
import CardPlaceHolder from "./CardPlaceHolder";
import { HabitsContext } from "@context/HabitsContext";
import { UserHabit } from "@type/userHabit";
import { Habit } from "@type/habit";
import useIndex from "@hooks/useIndex";
import { getHabitPoints } from "@utils/pointsUtils";

function CardCheckHabit({
	habit,
	onHabitStatusChange,
	completed,
	disabled,
}: {
	habit: UserHabit;
	onHabitStatusChange: (habit: UserHabit, completed: boolean) => void;
	completed: boolean;
	disabled: boolean;
}) {
	const { theme } = useContext(ThemeContext);
	const { setCurrentHabit } = useContext(HabitsContext);
	const { addOdysseePoints } = usePoints();
	const { date } = useData();
	const { getHabitDetails, userHabits } = useIndex();

	// États
	const [toggleCheckBox, setToggleCheckBox] = useState(false);
	const [habitInfos, setHabitInfos] = useState<Habit>();
	const [loading, setLoading] = useState(true);
	const [isTouched, setIsTouched] = useState(false);
	let touchStartTimeout: NodeJS.Timeout;

	const navigation: NavigationProp<ParamListBase> = useNavigation();

	// Animations
	const translateX = useSharedValue(0);
	const opacity = useSharedValue(0);

	const animatedStyles = useAnimatedStyle(() => {
		return {
			opacity: opacity.value,
			transform: [{ translateX: translateX.value }],
		};
	});

	useEffect(() => {
		async function getHabitInfos() {
			const result = getHabitDetails(habit.id);
			setHabitInfos(result);
			setLoading(false);
		}
		getHabitInfos();
	}, [userHabits]);

	useEffect(() => {
		opacity.value = withTiming(1, { duration: 200 });
		return () => {
			opacity.value = withTiming(0, { duration: 200 });
		};
	}, []);

	useEffect(() => {
		if (completed) {
			setToggleCheckBox(true);
		}
	}, [completed]);

	if (loading || !habitInfos) return <CardPlaceHolder />;

	const goHabitDetail = () => {
		setCurrentHabit({
			habit: habitInfos,
			userHabit: habit,
		});
		navigation.navigate("habitDetail");
	};

	const setHabitDone = async () => {
		setToggleCheckBox(true);
		onHabitStatusChange(habit, true);

		translateX.value = withSpring(toggleCheckBox ? 100 : 0);
		await setMemberHabitLog(habit.id, date, true);

		const habitPoints = getHabitPoints(habitInfos);
		await setRewards("odyssee", habitPoints.odyssee);

		addOdysseePoints(habitInfos.reward, habitInfos.difficulty);
	};

	return (
		<Animated.View
			style={[animatedStyles]}
			className="w-11/12 mx-auto my-[5px] flex flex-row items-center justify-between"
		>
			<Pressable
				onPress={setHabitDone}
				className="flex items-center justify-center"
				disabled={toggleCheckBox}
				style={{ flexBasis: "12.5%" }}
			>
				<Ionicons
					name={toggleCheckBox ? "checkmark-circle" : "ellipse-outline"}
					size={30}
					color={theme.colors.primary}
				/>
			</Pressable>
			<Pressable
				onPress={() => {
					goHabitDetail();
				}}
				style={{
					flex: 1,
					shadowColor: theme.colors.text,
					shadowOffset: {
						width: 2,
						height: 2,
					},
					shadowOpacity: 0.25,
					shadowRadius: 3.84,
					elevation: 2,
					backgroundColor: theme.colors.background,
					borderRadius: 10,
					overflow: "hidden", // Important pour les coins arrondis
				}}
				onTouchStart={() => {
					touchStartTimeout = setTimeout(() => setIsTouched(true), 200);
				}}
				onTouchEnd={() => {
					clearTimeout(touchStartTimeout);
					setIsTouched(false);
				}}
				onTouchCancel={() => {
					clearTimeout(touchStartTimeout);
					setIsTouched(false);
				}}
			>
				{/* Vue extérieure pour créer l'ombre interne */}
				<View
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						borderRadius: 10,
						backgroundColor: theme.colors.background,
						shadowColor: theme.colors.text, // Couleur de l'ombre
						shadowOffset: {
							width: -5,
							height: -5, // Inverser l'ombre
						},
						shadowOpacity: 0.2,
						shadowRadius: 10,
					}}
				/>

				{/* Contenu du Pressable */}
				<View
					className="flex items-center flex-row justify-between px-3 py-[12px] rounded-xl"
					style={{
						backgroundColor:
							isTouched || completed
								? theme.colors.backgroundTertiary
								: theme.dark
								? theme.colors.cardBackground
								: theme.colors.background,
					}}
				>
					{/* Contenu du pressable */}
					<View className="flex flex-row items-center">
						<FontAwesome6
							name={habitInfos.category.icon || "question"}
							size={18}
							color={habitInfos.category.color || theme.colors.text}
						/>

						<Text
							style={{
								color: theme.colors.text,
								textDecorationLine: completed ? "line-through" : "none",
								marginLeft: 6,
							}}
							className="text-[16px] font-semibold pl-1 w-[80%]"
							numberOfLines={1}
							ellipsizeMode="tail"
						>
							{habit.name}
						</Text>
					</View>
					<View
						className="rounded-full p-1"
						style={{
							backgroundColor: theme.colors.background,
						}}
					>
						<Ionicons
							name="flame"
							size={24}
							color={
								habitInfos.difficulty
									? difficulties[habitInfos?.difficulty - 1][habitInfos?.difficulty]
									: theme.colors.primary
							}
						/>
					</View>
				</View>
			</Pressable>
		</Animated.View>
	);
}

export default memo(CardCheckHabit);
