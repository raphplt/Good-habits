import React, { useContext } from "react";
import { ScrollView, RefreshControl, StatusBar } from "react-native";

import Streak from "@components/Progression/Streak";

import { ThemeContext } from "@context/ThemeContext";

import Stats from "@components/Progression/Stats";
import CalendarHabits from "@components/Progression/Calendar";
import GoalSection from "@components/Progression/GoalSection";
import { GoalProvider } from "@context/GoalsContext";
import Chart from "@components/Progression/Chart";

const Progression: React.FC = () => {
	const { theme } = useContext(ThemeContext);

	return (
		<GoalProvider>
			<ScrollView
				style={{
					backgroundColor: theme.colors.background,
					flexGrow: 1,
				}}
				showsVerticalScrollIndicator={false}
			>
				<Streak />
				{/* <Stats /> */}
				<GoalSection />

				<CalendarHabits />
				<Chart />
			</ScrollView>
		</GoalProvider>
	);
};

export default Progression;
