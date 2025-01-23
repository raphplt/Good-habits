import {
	collection,
	doc,
	setDoc,
	updateDoc,
	serverTimestamp,
	where,
	query,
	getDocs,
	limit,
	orderBy,
	startAfter,
	arrayRemove,
	arrayUnion,
	getDoc,
	Timestamp,
} from "firebase/firestore";
import { db, auth } from ".";
import { getMemberProfileByUid } from "./member";
import { getHabitById } from "./userHabit";
import { CategoryTypeSelect } from "@utils/category.type";
import { DailyLog, Log } from "@type/log";

export const REACTION_TYPES = ["flame", "heart", "like"];

/**
 *  Ajoute un log pour une habitude donnée
 * @param habitId
 * @param logDate
 */
export const setHabitLog = async (habitId: string, logDate: string) => {
	try {
		const uid = auth.currentUser?.uid;
		if (!uid) throw new Error("Utilisateur non authentifié");
		if (!habitId) throw new Error("[SET] - Identifiant de l'habitude manquant");

		const logsCollectionRef = collection(db, "habitsLogs");

		const q = query(
			logsCollectionRef,
			where("uid", "==", uid),
			where("habitId", "==", habitId)
		);

		const querySnapshot = await getDocs(q);

		const logDateObj = new Date(logDate);
		const newDailyLog: DailyLog = { date: logDateObj };

		if (querySnapshot.empty) {
			const newLogDocRef = doc(logsCollectionRef);

			const newLog: Log = {
				id: newLogDocRef.id,
				uid: uid,
				habitId: habitId,
				logs: [newDailyLog],
				createdAt: new Date(),
			};

			await setDoc(newLogDocRef, newLog);
		} else {
			const logDoc = querySnapshot.docs[0];
			const logDocRef = doc(db, "habitsLogs", logDoc.id);

			const existingLogs: DailyLog[] = logDoc.data().logs || [];
			const updatedLogs = [...existingLogs, newDailyLog];
			const mostRecentLog = updatedLogs
				.filter((log) => log.date)
				.sort((a, b) => b.date.getTime() - a.date.getTime())[0]
				.date.toISOString();
			await updateDoc(logDocRef, {
				logs: updatedLogs,
				mostRecentLog,
				updatedAt: serverTimestamp(),
			});
		}
	} catch (error) {
		console.error("Erreur lors de l'ajout ou de la mise à jour du log :", error);
		throw error;
	}
};

/**
 * Récupère les logs pour une habitude donnée
 * @param habitId
 * @returns
 */
export const getHabitLogs = async (habitId: string) => {
	try {
		const uid = auth.currentUser?.uid;
		if (!uid) throw new Error("Utilisateur non authentifié");
		if (!habitId) throw new Error("[GET] - Identifiant de l'habitude manquant");

		const logsCollectionRef = collection(db, "habitsLogs");

		const q = query(
			logsCollectionRef,
			where("uid", "==", uid),
			where("habitId", "==", habitId)
		);

		const querySnapshot = await getDocs(q);

		if (querySnapshot.empty) {
			return null;
		}

		const logDoc = querySnapshot.docs[0];
		const habitLogs = logDoc.data().logs;

		return habitLogs;
	} catch (error) {
		console.error("Erreur lors de la récupération des logs :", error);
		throw error;
	}
};
/**
 *  Fonction pour récupérer l'ensemble des logs de l'utilisateur
 * @param param0
 * @returns
 */
export const getAllHabitLogs = async ({
	signal,
	forceRefresh,
}: {
	signal?: AbortSignal;
	forceRefresh?: boolean;
}) => {
	try {
		if (signal?.aborted) {
			throw new Error("Requête annulée");
		}

		const uid = auth.currentUser?.uid;
		if (!uid) throw new Error("Utilisateur non authentifié");

		const logsCollectionRef = collection(db, "habitsLogs");

		const q = query(logsCollectionRef, where("uid", "==", uid));

		const querySnapshot = await getDocs(q);

		if (querySnapshot.empty) {
			return [];
		}

		const allLogs = querySnapshot.docs.map((doc) => {
			const data = doc.data();
			const logs: DailyLog[] = (data.logs || []).map((log: any) => {
				const date =
					log.date instanceof Timestamp ? log.date.toDate() : new Date(log.date);
				return {
					date,
					reactions: log.reactions || [],
				};
			});
			const mostRecentLog =
				data.mostRecentLog instanceof Timestamp
					? data.mostRecentLog.toDate()
					: new Date(data.mostRecentLog);

			return {
				habitId: data.habitId,
				logs,
				id: doc.id,
				mostRecentLog,
				uid: data.uid,
				createdAt: data.createdAt
					? data.createdAt instanceof Timestamp
						? data.createdAt.toDate()
						: new Date(data.createdAt)
					: undefined,
				updatedAt: data.updatedAt
					? data.updatedAt instanceof Timestamp
						? data.updatedAt.toDate()
						: new Date(data.updatedAt)
					: undefined,
			};
		});

		return allLogs;
	} catch (error) {
		console.error("Erreur lors de la récupération des logs :", error);
		throw error;
	}
};

/**
 * Récupère, par pagination, la liste des logs (habitsLogs),
 * classés par mostRecentLog desc, et filtre (ou convertit) les dailyLogs
 * pour ne garder que ceux au **nouveau** format { date, reactions }.
 */
export const getAllUsersLogsPaginated = async (
	pageSize: number = 10, //TODO temp
	lastVisibleDoc: any = null,
	confidentiality: string = "public",
	friends: string[] = []
) => {
	try {
		const logsCollectionRef = collection(db, "habitsLogs");

		let logsQuery = query(
			logsCollectionRef,
			orderBy("mostRecentLog", "desc"),
			limit(pageSize)
		);

		if (lastVisibleDoc) {
			logsQuery = query(logsQuery, startAfter(lastVisibleDoc));
		}

		const querySnapshot = await getDocs(logsQuery);

		if (querySnapshot.empty) {
			return { logs: [], lastVisible: null, hasMore: false };
		}

		const rawLogs = await Promise.all(
			querySnapshot.docs.map(async (docSnap) => {
				const logData = docSnap.data();
				if (!logData) return null;

				// Convertir le champ logs en DailyLog[], en filtrant les anciennes valeurs (strings)
				const dailyLogs: DailyLog[] = (logData.logs || [])
					// On ne garde que les objets
					.filter((dl: any) => typeof dl === "object" && dl.date)
					.map((dl: any) => {
						// Convertit le timestamp en Date
						let dateAsDate: Date;
						if (dl.date instanceof Timestamp) {
							dateAsDate = dl.date.toDate();
						} else if (dl.date instanceof Date) {
							dateAsDate = dl.date;
						} else {
							// Ultime fallback si c’est un string "YYYY-MM-DD" ou ISO
							dateAsDate = new Date(dl.date);
						}
						return {
							...dl,
							date: dateAsDate,
							reactions: dl.reactions || [],
						};
					});

				// Convertir mostRecentLog (Timestamp -> Date)
				let mostRecentLog: Date | undefined = undefined;
				if (logData.mostRecentLog instanceof Timestamp) {
					mostRecentLog = logData.mostRecentLog.toDate();
				} else if (logData.mostRecentLog instanceof Date) {
					mostRecentLog = logData.mostRecentLog;
				}

				// Récupération des infos du membre et de l’habitude
				const memberInfo = await getMemberProfileByUid(logData.uid);
				const habitInfo: any = await getHabitById(logData.habitId);

				// Filtrage par type d’habitude
				if (!habitInfo || habitInfo.type === CategoryTypeSelect.negative) {
					return null;
				}

				// Filtrage par confidentialité du membre
				if (!memberInfo || memberInfo.activityConfidentiality === "private") {
					return null;
				}
				if (
					memberInfo.activityConfidentiality === "friends" &&
					!friends.includes(memberInfo.uid)
				) {
					return null;
				}

				// Filtrage "public/friends" global
				if (confidentiality === "friends" && !friends.includes(memberInfo.uid)) {
					return null;
				}

				return {
					id: docSnap.id,
					uid: logData.uid,
					habitId: logData.habitId,
					logs: dailyLogs,
					mostRecentLog,
					member: memberInfo || null,
					habit: habitInfo || null,
				};
			})
		);

		// Filtre les null
		const filteredLogs = rawLogs.filter((log) => log !== null);
		const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

		return {
			logs: filteredLogs,
			lastVisible,
			hasMore: querySnapshot.size === pageSize,
		};
	} catch (error) {
		console.error("Erreur lors de la récupération des logs :", error);
		throw error;
	}
};

/**
 * Ajoute une réaction (inchangé, sauf que maintenant on sait
 * qu'on a bien un dailyLog { date, reactions })
 */
export const addReactionToLog = async (
	logId: string,
	uid: string,
	type: string,
	logDate: string
) => {
	const logRef = doc(db, "habitsLogs", logId);
	const logDoc = await getDoc(logRef);
	if (!logDoc.exists()) throw new Error("Log not found");

	const logData = logDoc.data() as Log;

	const updatedLogs = (logData.logs || []).map((dailyLog) => {
		// Convert date en Date
		const dateAsDate =
			dailyLog.date instanceof Date ? dailyLog.date : new Date(dailyLog.date);

		if (dateAsDate.toISOString() === logDate) {
			const updatedReactions = dailyLog.reactions
				? [...dailyLog.reactions, { uid, type }]
				: [{ uid, type }];
			return { ...dailyLog, reactions: updatedReactions };
		}
		return dailyLog;
	});

	await updateDoc(logRef, { logs: updatedLogs });
};

/**
 * Retire une réaction (idem)
 */
export const removeReactionFromLog = async (
	logId: string,
	uid: string,
	type: string,
	logDate: string
) => {
	const logRef = doc(db, "habitsLogs", logId);
	const logDoc = await getDoc(logRef);
	if (!logDoc.exists()) throw new Error("Log not found");

	const logData = logDoc.data() as Log;

	const updatedLogs = (logData.logs || []).map((dailyLog) => {
		const dateAsDate =
			dailyLog.date instanceof Date ? dailyLog.date : new Date(dailyLog.date);

		if (dateAsDate.toISOString() === logDate) {
			const updatedReactions = dailyLog.reactions?.filter(
				(reaction) => !(reaction.uid === uid && reaction.type === type)
			);
			return { ...dailyLog, reactions: updatedReactions };
		}
		return dailyLog;
	});

	await updateDoc(logRef, { logs: updatedLogs });
};