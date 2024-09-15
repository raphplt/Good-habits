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
import { getHabitById } from "@db/habits";
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
			// const result = await getHabitById(habit.id);
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

	// Go to habit detail
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
		await setRewards("odyssee", habitInfos.reward + habitInfos.difficulty);
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
				<Checkbox
					value={toggleCheckBox}
					onValueChange={setHabitDone}
					color={theme.colors.grayPrimary}
					disabled={disabled || toggleCheckBox}
				/>
			</Pressable>
			<Pressable
				onPress={() => {
					goHabitDetail();
				}}
				style={{ flex: 1 }}
			>
				<View
					className="flex items-center flex-row justify-between px-3 py-[12px] rounded-xl"
					style={{
						// borderColor: theme.colors.border,
						// borderWidth: 1,
						backgroundColor:
							isTouched || completed
								? theme.colors.backgroundSecondary
								: theme.colors.backgroundTertiary,
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
					{/* <View
                        className="absolute py-2 left-[8px] w-[4px] h-full rounded-xl"
                        style={{
                            backgroundColor: habitInfos.category?.color || theme.colors.primary,
                        }}
                    ></View> */}

					<View className="flex flex-row items-center">
						{/* <Text
							className="font-semibold"
							numberOfLines={1}
							style={{
								marginLeft: 5,
								color: theme.colors.text,
							}}
						>
							{habit.moment}h
						</Text> */}
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
							className="text-[15px] font-semibold pl-1"
							numberOfLines={1}
							ellipsizeMode="tail"
						>
							{habit.name}
						</Text>
					</View>
					<View className="bg-white rounded-full p-1">
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
