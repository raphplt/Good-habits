import CachedImage from "@components/Shared/CachedImage";
import { useTheme } from "@context/ThemeContext";
import { getFriends } from "@db/member";
import { Member } from "@type/member";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Share, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Iconify } from "react-native-iconify";

const FriendPreview = () => {
	const [friends, setFriends] = useState<
		(Partial<Member> & { currentLevel?: string })[]
	>([]);
	const { theme } = useTheme();
	const { t } = useTranslation();

	useEffect(() => {
		const fetch = async () => {
			const friends = await getFriends();
			setFriends(friends);
		};
		fetch();
	}, []);

	const inviteFriends = async () => {
		try {
			const result = await Share.share({
				message:
					"Rejoins-moi sur cette super application ! Télécharge-la ici : https://example.com/download",
			});
			if (result.action === Share.sharedAction) {
				console.log("Partage réussi");
			} else if (result.action === Share.dismissedAction) {
				console.log("Partage annulé");
			}
		} catch (error) {
			console.error("Erreur lors du partage :", error);
		}
	};

	return (
		<ScrollView
			showsHorizontalScrollIndicator={false}
			horizontal
			contentContainerStyle={{ paddingHorizontal: 8 }}
			className="py-2"
		>
			<Pressable onPress={inviteFriends} className="ml-2 mr-1">
				<LinearGradient
					colors={[theme.colors.blueSecondary, theme.colors.cardBackground]}
					style={{
						width: 80,
						height: 80,
						borderRadius: 40,
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Iconify icon="mdi:account-plus" color={theme.colors.primary} size={32} />
				</LinearGradient>
				<Text
					style={{
						color: theme.colors.text,
						fontSize: 12,
						textAlign: "center",
						marginTop: 4,
					}}
				>
					{t("invite_friends")}
				</Text>
			</Pressable>

			{friends.map((friend, index) => (
				<View key={index} style={{ alignItems: "center", marginRight: 12 }}>
					<LinearGradient
						colors={["#ff9a9e", "#fad0c4"]}
						style={{
							width: 80,
							height: 80,
							borderRadius: 40,
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<CachedImage
							imagePath={`images/cosmetics/${friend.profilePicture}.png`}
							style={{
								width: 70,
								height: 70,
								borderRadius: 35,
								borderWidth: 2,
								borderColor: "white",
							}}
						/>
					</LinearGradient>
					<Text
						style={{
							color: theme.colors.text,
							fontSize: 13,
							marginTop: 4,
							textAlign: "center",
							maxWidth: 80,
						}}
						numberOfLines={1}
					>
						{friend.nom}
					</Text>
				</View>
			))}
		</ScrollView>
	);
};

export default FriendPreview;
