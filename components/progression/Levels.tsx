import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { useData } from "@context/DataContext";
import { getUserLevelsByUserId, initUserLevels } from "@db/levels";
import SectionHeader from "./SectionHeader";
import LevelItem from "./LevelItem";
import { CombinedLevel } from "@type/levels";
import { useTranslation } from "react-i18next";
import { useHabits } from "@context/HabitsContext";

const Levels = () => {
	const { usersLevels, setUsersLevels, isLoading, member } = useData();
	const { genericLevels, refreshGenericLevels, setGenericLevels } = useHabits();
	const { t } = useTranslation();
	const [showLevels, setShowLevels] = useState(true);
	const [previousLevels, setPreviousLevels] = useState(usersLevels);
	const [hasRefetched, setHasRefetched] = useState(false);

	if (!member) return null;
	// useEffect(() => {
	// 	const initializeLevels = async () => {
	// 		if (!Object.keys(usersLevels).length && !isLoading) {
	// 			await initUserLevels(member.uid, genericLevels);
	// 			const updatedLevels = await getUserLevelsByUserId(member.uid);
	// 			console.log("Updated levels: ", updatedLevels);
	// 			setUsersLevels(updatedLevels);
	// 		}
	// 	};

	// 	initializeLevels();
	// }, [member, genericLevels, usersLevels, isLoading]);

	useEffect(() => {
		// Vérifie si un des genericLevels n'a pas de propriété icon
		const missingIcon = genericLevels.some((level) => !level.icon);
		if (missingIcon && !hasRefetched) {
			console.log("Refreshing generic levels");
			refreshGenericLevels(true);
			setHasRefetched(true);
			setGenericLevels(genericLevels);
		}
	}, [genericLevels, hasRefetched, refreshGenericLevels]);

	const combinedLevels: CombinedLevel[] = Object.entries(usersLevels)
		.map(([levelId, userLevel]) => {
			const genericLevel = genericLevels.find((level) => level.id === levelId);
			if (!genericLevel) {
				console.log(`No generic level found for levelId: ${levelId}`);
				return null;
			}
			return {
				...userLevel,
				...genericLevel,
				levelId,
				name: genericLevel.name || "Unknown",
				description: genericLevel.description || "",
				color: genericLevel.color || "#000",
				associatedCategoryIds: genericLevel.associatedCategoryIds || [],
			};
		})
		.filter((level): level is CombinedLevel => level !== null);

	const filteredLevels = combinedLevels.filter(
		(level) => level.name !== "Niveau général"
	);

	// console.log("Filtered levels: ", filteredLevels);

	return (
		<>
			<SectionHeader
				title={t("levels")}
				show={showLevels}
				setShow={setShowLevels}
				icon="levels"
			>
				<View className="w-[95%] mx-auto mb-2 mt-2">
					<ScrollView>
						{filteredLevels.map((item) => (
							<LevelItem key={item.levelId} level={item} />
						))}
					</ScrollView>
				</View>
			</SectionHeader>
		</>
	);
};

export default Levels;
