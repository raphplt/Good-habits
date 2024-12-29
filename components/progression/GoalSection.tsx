import { FlatList, View, Dimensions } from "react-native";
import AddGoal from "./AddGoal";
import CurrentGoal from "./CurrentGoal";
import { useGoal } from "@context/GoalsContext";
import GoalPlaceHolder from "./GoalPlaceHolder";

export default function GoalSection() {
	const { goals, loadingGoals } = useGoal();

	const { width } = Dimensions.get("window");

	const goalWithAddButton = [...goals, { id: "add_goal_button" } as any];

	if (loadingGoals) return <GoalPlaceHolder />;

	return (
		<View className="mt-1">
			<FlatList
				data={goalWithAddButton}
				renderItem={({ item }) =>
					item.id === "add_goal_button" ? <AddGoal /> : <CurrentGoal goal={item} />
				}
				keyExtractor={(item) => item.id}
				horizontal={true}
				pagingEnabled={true}
				snapToAlignment="center"
				snapToInterval={width}
				decelerationRate="fast"
				showsHorizontalScrollIndicator={false}
			/>
		</View>
	);
}
