import React, { useState, useEffect } from "react";
import { Text, View, FlatList, ActivityIndicator } from "react-native";
import { getMembersPaginated } from "@db/member";
import { Member } from "@type/member";
import Friend from "@components/Agora/Friend";
import { useData } from "@context/DataContext";

const FriendList = () => {
	const { member } = useData();
	const [members, setMembers] = useState<Member[]>([]);
	const [loading, setLoading] = useState(true);
	const [lastVisibleDoc, setLastVisibleDoc] = useState<any>(null);
	const [hasMoreMembers, setHasMoreMembers] = useState(true);

	const fetchMembers = async (isRefreshing = false) => {
		try {
			if (isRefreshing) {
				setLastVisibleDoc(null);
				setMembers([]);
			}

			const { members: newMembers, lastVisible } = await getMembersPaginated(
				lastVisibleDoc
			);

			if (newMembers.length < 10) setHasMoreMembers(false);

			setMembers((prevMembers: any) => {
				const updatedMembers = isRefreshing
					? newMembers
					: [
							...prevMembers,
							...newMembers.filter(
								(newMember) =>
									!prevMembers.some((member) => member.uid === newMember.uid)
							),
					  ];

				return updatedMembers;
			});

			setLastVisibleDoc(lastVisible);
			setLoading(false);
		} catch (error) {
			console.error("Erreur lors de la récupération des membres: ", error);
		}
	};

	useEffect(() => {
		fetchMembers();
	}, []);

	const loadMoreMembers = () => {
		if (hasMoreMembers) fetchMembers();
	};

	if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

	return (
		<View>
			<FlatList
				data={members}
				numColumns={2}
				keyExtractor={(item) => item.uid}
				showsVerticalScrollIndicator={false}
				ListHeaderComponent={
					<View>
						<Text>Amis</Text>
						<Text>Vous avez {member?.friends?.length ?? "0"} amis</Text>
						<Text>
							Vous avez {member?.friendRequestsReceived?.length ?? "0"} demandes recues
						</Text>
						<Text>
							Vous avez {member?.friendRequestsSent?.length ?? "0"} demandes envoyées
						</Text>
					</View>
				}
				renderItem={({ item }) => <Friend member={item} />}
				onEndReached={loadMoreMembers}
				onEndReachedThreshold={0.5}
				className="w-[95%] mx-auto"
				ListFooterComponent={
					hasMoreMembers ? <ActivityIndicator size="large" color="#0000ff" /> : null
				}
			/>
		</View>
	);
};

export default FriendList;
