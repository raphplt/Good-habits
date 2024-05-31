import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../../components/ThemContext";
import { Text, View } from "../../components/Themed";
import { getMemberHabits } from "../../db/member";
import { Pressable } from "react-native";
import moment from "moment";
import { RefreshControl, ScrollView } from "react-native";
import HabitsCompleted from "../../components/progression/HabitsCompleted";
import { HabitCard } from "../../components/progression/HabitCard";
import SetTime from "../../components/progression/SetTime";

export default function Progression() {
	const { theme } = useContext(ThemeContext);
	const isMounted = useRef(true);
	const [habits, setHabits] = useState<any>([]);
	const [loading, setLoading] = useState(true);
	const [activeButton, setActiveButton] = useState("Jour");
	const [scoreHabits, setScoreHabits] = useState(0);
	const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
	const [habitLastDaysCompleted, setHabitLastDaysCompleted]: any = useState([]);
	const [refreshing, setRefreshing] = useState(false);
	const [comparedToYesterday, setComparedToYesterday] = useState(0);

	// Update date every second
	useEffect(() => {
		const interval = setInterval(() => {
			setDate(moment().format("YYYY-MM-DD"));
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	// Fetch habits
	useEffect(() => {
		(async () => {
			try {
				const data = await getMemberHabits();
				if (isMounted.current) {
					setHabits(data);
					setLoading(false);
				}
			} catch (error) {
				handleError(error);
				setHabits([]);
				setLoading(false);
			}
		})();

		return () => {
			isMounted.current = false;
		};
	}, []);

	const onRefresh = async () => {
		setRefreshing(true);
		try {
			const data = await getMemberHabits();
			setHabits(data);
			setLoading(false);
		} catch (error) {
			setHabits([]);
			handleError(error);
		} finally {
			setRefreshing(false);
		}
	};

	// Calculate score for habits
	useEffect(() => {
		let score = 0;
		if (habits && habits.length === 0) return setScoreHabits(0);
		habits.forEach((habit: any) => {
			if (habit.logs) {
				const lastLog = habit.logs[habit.logs.length - 1];

				if (lastLog && lastLog.date === date && lastLog.done === true) {
					score += 1;
				}
			}
		});

		if (habits.length) setScoreHabits(Math.floor((score / habits.length) * 100));
	}, [habits, date]);

	const handleError = (error: any) => {
		console.log("Index - Erreur lors de la récupération des habitudes : ", error);
	};

	// Calculate last days completed
	useEffect(() => {
		let habitCompletion: any = {};
		if (habits.length === 0) return setHabitLastDaysCompleted([]);
		let days = 7;

		if (activeButton === "Jour") {
			days = 1;
		} else if (activeButton === "Semaine") {
			days = 7;
		} else if (activeButton === "Mois") {
			days = 30;
		} else if (activeButton === "Année") {
			days = 365;
		}

		habits.forEach((habit: any) => {
			habitCompletion[habit.name] = 0;
			for (let i = 0; i < days; i++) {
				const date = moment().subtract(i, "days").format("YYYY-MM-DD");
				if (habit.logs) {
					const logsForDay = habit.logs.filter(
						(log: any) => log.date === date && log.done === true
					);
					if (logsForDay.length > 0) {
						habitCompletion[habit.name] += 1;
					}
				}
			}
		});

		setHabitLastDaysCompleted(habitCompletion);
	}, [habits, date, activeButton]);

	const handlePress = (button: string) => {
		setActiveButton(button);
	};

	useEffect(() => {
		let habitToday = 0;
		let habitYesterday = 0;
		if (habits.length === 0) return setComparedToYesterday(0);

		habits.forEach((habit: any) => {
			if (habit.logs) {
				const lastLog = habit.logs[habit.logs.length - 1];
				if (lastLog && lastLog.date === date && lastLog.done === true) {
					habitToday += 1;
				}
				const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");
				const logsForYesterday = habit.logs.filter(
					(log: any) => log.date === yesterday && log.done === true
				);
				if (logsForYesterday.length > 0) {
					habitYesterday += 1;
				}
			}
		});
		if (habitYesterday > 0 && habitToday > 0) {
			setComparedToYesterday(Math.floor((habitToday / habitYesterday) * 100));
		} else if (habitYesterday === 0 && habitToday > 0) {
			setComparedToYesterday(100);
		} else if (habitYesterday === 0 && habitToday === 0) {
			setComparedToYesterday(0);
		} else if (habitYesterday > 0 && habitToday === 0) {
			setComparedToYesterday(0);
		}
	}, [habits, date]);

	return (
		<>
			<ScrollView
				style={{ backgroundColor: theme.colors.background }}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			>
				<View
					className="flex mt-3 items-center mx-auto justify-between flex-row"
					style={{ backgroundColor: theme.colors.background }}
				>
					<SetTime
						text="Jour"
						handlePress={handlePress}
						activeButton={activeButton}
					/>
					<SetTime
						text="Semaine"
						handlePress={handlePress}
						activeButton={activeButton}
					/>
					<SetTime
						text="Mois"
						handlePress={handlePress}
						activeButton={activeButton}
					/>
					<SetTime
						text="Année"
						handlePress={handlePress}
						activeButton={activeButton}
					/>
				</View>
				{activeButton === "Jour" && (
					<View
						className="flex items-center justify-around flex-row mb-3"
						style={{ backgroundColor: theme.colors.background }}
					>
						<HabitCard statistic={scoreHabits} text="complétées" theme={theme} />
						<HabitCard statistic={comparedToYesterday} text="vs hier" theme={theme} />
					</View>
				)}
				<ScrollView className="flex flex-col mt-2">
					<HabitsCompleted
						habits={habits}
						habitLastDaysCompleted={habitLastDaysCompleted}
						activeButton={activeButton}
						theme={theme}
					/>
				</ScrollView>
			</ScrollView>
		</>
	);
}
