import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import CardCheckHabit from "@components/Habits/CardCheckHabit";
import useIndex from "@hooks/useIndex";
import { UserHabit } from "@type/userHabit";
import { DayOfWeek } from "@type/days";

export default function HabitsSection() {
    const { userHabits } = useIndex();

    const today: DayOfWeek = new Date()
        .toLocaleString("en-US", { weekday: "long" })
        .toLowerCase() as DayOfWeek;

    const morningHabits = userHabits?.filter(
        (habit) =>
            habit.frequency &&
            habit.frequency[today] &&
            habit.moment >= 6 &&
            habit.moment < 12
    );

    const afternoonHabits = userHabits?.filter(
        (habit) => habit.frequency && habit.frequency[today] && habit.moment >= 12 && habit.moment < 18
    );

    const eveningHabits = userHabits?.filter(
        (habit) => habit.frequency && habit.frequency[today] && habit.moment >= 18
    );

    const freeHabits = userHabits?.filter(
        (habit: UserHabit) =>
            (habit.frequency && habit.frequency[today] && habit.moment === -1) || habit.moment < 6
    );

    const title = "text-lg font-semibold my-1 w-11/12 mx-auto mt-3";

    return (
        <ScrollView>
            {/* Morning routine */}
            {morningHabits && morningHabits.length > 0 && (
                <View>
                    <Text className={title}>Routine du matin</Text>
                    {morningHabits.map((habit, index) => (
                        <CardCheckHabit key={index} habit={habit} />
                    ))}
                </View>
            )}

            {/* Afternoon routine */}
            {afternoonHabits && afternoonHabits.length > 0 && (
                <View>
                    <Text className={title}>Routine de l'après midi</Text>
                    {afternoonHabits.map((habit, index) => (
                        <CardCheckHabit key={index} habit={habit} />
                    ))}
                </View>
            )}

            {/* Evening routine */}
            {eveningHabits && eveningHabits.length > 0 && (
                <View>
                    <Text className={title}>Routine du soir</Text>
                    {eveningHabits.map((habit, index) => (
                        <CardCheckHabit key={index} habit={habit} />
                    ))}
                </View>
            )}

            {/* Free habits */}
            {freeHabits && freeHabits.length > 0 && (
                <View>
                    <Text className={title}>Libre</Text>
                    {freeHabits.map((habit, index) => (
                        <CardCheckHabit key={index} habit={habit} />
                    ))}
                </View>
            )}
        </ScrollView>
    );
}