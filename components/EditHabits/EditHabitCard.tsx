import { View, Text, Pressable } from "react-native";
import { Habit } from "../../type/habit";
import { Iconify } from "react-native-iconify";
import { ThemeContext } from "@context/ThemeContext";
import { useContext, useEffect, useState } from "react";
import { getHabitById } from "@db/habits";
import CardPlaceHolder from "@components/Habits/CardPlaceHolder";
import { UserHabit } from "../../type/userHabit";
import { FontAwesome6 } from "@expo/vector-icons";
import { useData } from "@context/DataContext";
import { LOCAL_STORAGE_MEMBER_HABITS_KEY, setMemberHabit } from "@db/member";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditHabitCard({ habit }: { habit: Habit }) {
	const { theme } = useContext(ThemeContext);
	const [habitInfos, setHabitInfos] = useState<Habit>();
	const { setHabits } = useData();

	const [loading, setLoading] = useState(true);
	// console.log(habit);

	useEffect(() => {
		async function getHabitInfos() {
			const result = await getHabitById(habit.id);
			setHabitInfos(result);
			setLoading(false);
		}
		getHabitInfos();
	}, []);

	if (loading || !habitInfos) return <CardPlaceHolder />;

	const deleteHabit = async (habit: Habit) => {
		await setMemberHabit(habitInfos);

		setHabits((prev: Habit[]) => prev.filter((h: Habit) => h.id !== habit.id));

		const storedHabits = await AsyncStorage.getItem(
			LOCAL_STORAGE_MEMBER_HABITS_KEY
		);
		let localHabits = storedHabits ? JSON.parse(storedHabits) : [];
		localHabits = localHabits.filter((h: Habit) => h.id !== habit.id);
	};

	return (
		<View
			className=" flex flex-row items-center justify-between mx-auto w-11/12 py-3 px-2 my-[6px] rounded-xl"
			style={{
				backgroundColor: theme.colors.cardBackground,
			}}
		>
			<View className="flex flex-row items-center">
				<View className="w-6">
					<FontAwesome6
						name={habitInfos.category.icon || "question"}
						size={20}
						color={habitInfos.category.color || theme.colors.text}
						cla
					/>
				</View>
				<Text
					className="ml-3 w-10/12 overflow-clip"
					style={{
						color: theme.colors.text,
					}}
					numberOfLines={1}
				>
					{habit.name}
				</Text>
			</View>
			<Pressable onPress={() => deleteHabit(habit)}>
				<Iconify
					icon="mdi:trash-outline"
					size={26}
					color={theme.colors.redPrimary}
				/>
			</Pressable>
		</View>
	);
}
