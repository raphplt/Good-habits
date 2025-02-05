import { Text, View } from "react-native";
import HabitTypeItem from "../Items/HabitTypeItem";
import { Iconify } from "react-native-iconify";
import { useTheme } from "@context/ThemeContext";
import { useSelect } from "@context/SelectContext";
import { customMessage } from "@utils/select/customMessage";
import React from "react";
import { useTranslation } from "react-i18next";
import { CategoryTypeSelect } from "@utils/category.type";

export default function HabitsType() {
	const { theme } = useTheme();
	const { type, setType } = useSelect();
	const { t } = useTranslation();

	return (
		<>
			<Text
				style={{
					color: theme.colors.text,
					fontFamily: "BaskervilleBold",
				}}
				className="text-xl mt-1 w-[95%] mx-auto"
			>
				{t("create_habit")}
			</Text>
			<View className="flex flex-row items-center justify-evenly w-full mx-auto pt-4">
				<HabitTypeItem
					icon={
						<Iconify
							size={24}
							icon="lucide:smile-plus"
							color={type === CategoryTypeSelect.positive ? "#fff" : theme.colors.text}
						/>
					}
					name={t("positive")}
					bgColor={theme.colors.greenSecondary}
					bgColorSelected={theme.colors.greenPrimary}
					onPress={() => setType(CategoryTypeSelect.positive)}
					typeHabit={CategoryTypeSelect.positive}
				/>
				<HabitTypeItem
					icon={
						<Iconify
							size={24}
							icon="ant-design:stop-outlined"
							color={type === CategoryTypeSelect.negative ? "#fff" : theme.colors.text}
						/>
					}
					name={t("negative")}
					bgColor={theme.colors.redSecondary}
					bgColorSelected={theme.colors.redPrimary}
					onPress={() => setType(CategoryTypeSelect.negative)}
					typeHabit={CategoryTypeSelect.negative}
				/>
				<HabitTypeItem
					icon={
						<Iconify
							size={24}
							icon="mdi:repeat"
							color={type === CategoryTypeSelect.routine ? "#fff" : theme.colors.text}
						/>
					}
					name={t("routine")}
					bgColor={theme.colors.blueSecondary}
					bgColorSelected={theme.colors.bluePrimary}
					onPress={() => setType(CategoryTypeSelect.routine)}
					typeHabit={CategoryTypeSelect.routine}
				/>
			</View>
			<View
				className="w-[95%] mx-auto mt-4 px-4 py-2 rounded-xl flex flex-col"
				style={{
					backgroundColor: theme.colors.cardBackground,
				}}
			>
				<Text
					style={{
						color: theme.colors.text,
					}}
					className="text-lg font-semibold"
				>
					{type}
				</Text>
				<Text
					style={{
						color: theme.colors.textTertiary,
					}}
					className="text-[14px]"
				>
					{customMessage(type)}
				</Text>
			</View>
		</>
	);
}
