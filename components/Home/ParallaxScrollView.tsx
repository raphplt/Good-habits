import {
	useContext,
	useEffect,
	useState,
	type PropsWithChildren,
	type ReactElement,
} from "react";
import { Image, Text, View, useColorScheme } from "react-native";
import Animated, {
	interpolate,
	useAnimatedRef,
	useAnimatedStyle,
	useScrollViewOffset,
} from "react-native-reanimated";
import { ThemeContext } from "../../context/ThemeContext";
import moment from "moment";
import { BlurView } from "expo-blur";

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
	headerImage: ReactElement;
	headerBackgroundColor: { dark: string; light: string };
	refreshControl?: ReactElement;
	habits: any; //TODO type
	isDayTime: boolean;
}>;

export default function ParallaxScrollView({
	children,
	headerImage,
	headerBackgroundColor,
	refreshControl,
	habits,
	isDayTime,
}: Props) {
	const colorScheme = useColorScheme() ?? "light";
	const scrollRef = useAnimatedRef<Animated.ScrollView>();
	const scrollOffset = useScrollViewOffset(scrollRef);
	const { theme } = useContext(ThemeContext);
	const [scoreHabits, setScoreHabits] = useState(0);
	const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
	const [lastDaysCompleted, setLastDaysCompleted] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setDate(moment().format("YYYY-MM-DD"));
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	const headerAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY: interpolate(
						scrollOffset.value,
						[-HEADER_HEIGHT, 0, HEADER_HEIGHT],
						[-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
					),
				},
				{
					scale: interpolate(
						scrollOffset.value,
						[-HEADER_HEIGHT, 0, HEADER_HEIGHT],
						[2, 1, 1]
					),
				},
			],
		};
	});

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

	useEffect(() => {
		let lastDaysCompleted = 0;
		if (habits.length === 0) return setLastDaysCompleted(0);
		const days = 7;

		for (let i = 0; i < days; i++) {
			const date = moment().subtract(i, "days").format("YYYY-MM-DD");

			let dayCompleted = false;
			habits.forEach((habit: any) => {
				if (habit.logs) {
					const lastLog = habit.logs[habit.logs.length - 1];

					if (lastLog && lastLog.date === date && lastLog.done === true) {
						dayCompleted = true;
					}
				}
			});

			if (dayCompleted) {
				lastDaysCompleted += 1;
			}
		}

		setLastDaysCompleted(lastDaysCompleted);
	}, [habits, date]);

	return (
		<View>
			<Animated.ScrollView
				ref={scrollRef}
				scrollEventThrottle={16}
				showsVerticalScrollIndicator={false}
				refreshControl={refreshControl}
			>
				<Animated.View
					style={[
						{ backgroundColor: headerBackgroundColor[colorScheme] },
						headerAnimatedStyle,
					]}
				>
					<View className="flex items-center justify-center flex-col bg-transparent absolute top-5 left-5 z-30 px-3 py-2">
						<BlurView
							intensity={50}
							style={{
								position: "absolute",
								borderRadius: 10,
								overflow: "hidden",
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
							}}
						/>
						<Image
							source={require("../../assets/images/icons/flamme.png")}
							style={{ width: 40, height: 40, resizeMode: "contain" }}
						/>
						<Text
							style={{
								color: isDayTime ? theme.colors.text : theme.colors.textSecondary,
							}}
							className="text-xl mt-1 font-semibold"
						>
							{scoreHabits}%
						</Text>
					</View>
					<View className="flex items-center justify-center flex-col bg-transparent absolute top-5 right-5 z-30 py-1 px-2">
						<BlurView
							intensity={50}
							style={{
								position: "absolute",
								borderRadius: 10,
								overflow: "hidden",
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
							}}
						/>
						<Text
							className="font-semibold"
							style={{
								color: isDayTime ? theme.colors.text : theme.colors.textSecondary,
							}}
						>
							Série : {lastDaysCompleted} {lastDaysCompleted > 1 ? "jours" : "jour"}
						</Text>
					</View>

					{headerImage}
				</Animated.View>
				<View style={{ backgroundColor: theme.colors.background }}>{children}</View>
			</Animated.ScrollView>
		</View>
	);
}
