import MoneyOdyssee from "@components/Svg/MoneyOdyssee";
import { useData } from "@context/DataContext";
import { ThemeContext } from "@context/ThemeContext";
import { ProfileCosmetic } from "@type/cosmetics";
import getIcon from "@utils/cosmeticsUtils";
import { useContext } from "react";
import { View, Text, Image } from "react-native";

import { TouchableOpacity } from "react-native";
import { getMemberInfos, updateProfilePicture } from "@db/member";

export default function ProfilIcon({
	cosmetic,
}: {
	cosmetic: ProfileCosmetic;
}) {
	const { theme } = useContext(ThemeContext);
	const { points, setMember, member } = useData();

	const isGrayedOut = cosmetic.price > points.odyssee;

	const handlePress = async () => {
		if (!isGrayedOut) {
			await updateProfilePicture(cosmetic.slug);
			const updatedMember = await getMemberInfos({ forceRefresh: true });
			setMember(updatedMember);
		}
	};

	// console.log("member", member);

	return (
		<TouchableOpacity
			onPress={handlePress}
			disabled={isGrayedOut}
			className="flex flex-col items-center w-[31%] mx-auto my-1 py-2 rounded-xl"
			key={cosmetic.id}
			style={{
				backgroundColor: isGrayedOut
					? theme.colors.grayPrimary
					: theme.colors.cardBackground,
				borderColor:
					member?.profilePicture === cosmetic.slug
						? theme.colors.primary
						: theme.colors.cardBackground,
				borderWidth: 1,
				opacity: isGrayedOut ? 0.5 : 1,
			}}
		>
			<Text
				numberOfLines={1}
				style={{
					color: theme.colors.text,
					fontFamily: "BaskervilleBold",
				}}
				ellipsizeMode="tail"
				className="w-11/12 text-center font-semibold mb-1"
			>
				{cosmetic.name}
			</Text>
			<Image source={getIcon(cosmetic.slug)} className="w-24 h-24" />
			<View className="flex flex-row items-center justify-center py-2">
				<Text
					className="mx-1 font-semibold "
					style={{
						color: theme.colors.text,
					}}
				>
					{cosmetic.price}
				</Text>
				<MoneyOdyssee />
			</View>
		</TouchableOpacity>
	);
}