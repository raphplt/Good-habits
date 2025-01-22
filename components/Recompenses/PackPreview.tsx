import ButtonBack from "@components/Shared/ButtonBack";
import ButtonClose from "@components/Shared/ButtonClose";
import CachedImage from "@components/Shared/CachedImage";
import MoneyMelios from "@components/Svg/MoneyMelios";
import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import { BlurView } from "expo-blur";
import React from "react";
import { useTranslation } from "react-i18next";
import {
	Text,
	View,
	StyleSheet,
	Dimensions,
	Pressable,
	Alert,
	StatusBar,
	ScrollView,
} from "react-native";

type Props = {
	unlocked: boolean;
	setUnlocked: (value: boolean) => void;
};

const PackPreview = ({ unlocked, setUnlocked }: Props) => {
	const { selectedPack } = useData();
	const { theme } = useTheme();
	const { t } = useTranslation();

	if (!selectedPack) return null;

	const showComingSoonAlert = () => {
		Alert.alert(
			t("coming_soon_message"),
			t("coming_soon_description"),
			[{ text: t("ok"), onPress: () => console.log("OK Pressed") }],
			{ cancelable: false }
		);
	};

	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			className="flex-1 relative"
			style={{
				backgroundColor: theme.colors.background,
				flex: 1,
			}}
			contentContainerStyle={{
				flexGrow: 1,
			}}
		>
			<View
				style={{
					paddingTop: StatusBar.currentHeight ?? 50,
				}}
			/>
			<View
				style={{
					height: 250,
				}}
				className="relative block "
			>
				<BlurView intensity={100} tint="light" className="rounded-lg p-2">
					<ButtonClose color="white" />
				</BlurView>
				<CachedImage
					imagePath={"images/packs/" + selectedPack.image}
					className="w-full h-full object-cover absolute"
				/>
			</View>
			<View className="flex items-center justify-between relative">
				<View className="p-4 w-[95%] rounded-xl mt-2 flex flex-col items-start justify-start">
					<Text
						className="text-2xl font-bold"
						style={{
							color: theme.colors.text,
						}}
					>
						{selectedPack.name}
					</Text>

					<View className="flex flex-col items-start justify-start gap-y-2">
						<Text
							className="font-semibold py-2"
							style={{
								color: theme.colors.textTertiary,
							}}
						>
							{selectedPack.description}
						</Text>

						<Text
							className="font-semibold text-lg"
							style={{ color: theme.colors.text }}
						>
							{selectedPack.content.sections.length} {t("chapters")}
						</Text>
					</View>

					<View className="flex flex-col items-start justify-start gap-y-1 mt-2 w-full mx-auto">
						{selectedPack.content.sections.map((section, index) => (
							<View
								key={index}
								className="flex flex-row items-center rounded-lg gap-2 p-2 w-full my-1"
								style={{
									backgroundColor: theme.colors.cardBackground,
								}}
							>
								<Text
									className="font-semibold"
									style={{
										color: theme.colors.textTertiary,
									}}
								>
									{index + 1}. {section.title}
								</Text>
							</View>
						))}
					</View>
				</View>

				<Pressable
					style={{
						backgroundColor: theme.colors.primary,
						opacity: 0.9,
					}}
					className="p-3 rounded-xl mt-2 flex flex-row justify-center items-center my-2 w-11/12 mb-6 "
					onPress={showComingSoonAlert}
				>
					<Text
						style={{
							color: theme.colors.textSecondary,
						}}
						className="text-center text-lg font-semibold "
					>
						{t("unlock")}
					</Text>
					<View className="flex items-center gap-1 flex-row mx-3">
						<Text
							className="text-xl font-bold"
							style={{
								color: theme.colors.yellowPrimary,
							}}
						>
							{selectedPack.price}
						</Text>
						<MoneyMelios />
					</View>
				</Pressable>
			</View>
		</ScrollView>
	);
};

export default PackPreview;