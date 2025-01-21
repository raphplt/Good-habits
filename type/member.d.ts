import { Answer } from "./answer";
import { UserLevel } from "./levels";
import { UserHabit } from "./userHabit";

export interface Member {
	uid: string;
	nom: string;
	motivation?: Answer;
	objectifs?: Answer[];
	temps?: Answer;
	aspects?: Answer[];
	profilePicture: string;
	friends?: string[];
	friendRequestsSent?: string[];
	friendRequestsReceived?: string[];
	activityConfidentiality?: "public" | "private" | "friends";
	levels?: UserLevel[];
}
