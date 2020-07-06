import { activematch, qualmatch, user, signups, matchlist } from "./struct";
export declare function connectToDB(): Promise<void>;
export declare function insertActive(activematch: activematch): Promise<void>;
export declare function updateActive(activematch: activematch): Promise<void>;
export declare function insertQuals(Qual: qualmatch): Promise<void>;
export declare function updateQuals(Qual: qualmatch): Promise<void>;
export declare function getActive(): Promise<activematch[]>;
export declare function getMatch(channelid: string): Promise<activematch>;
export declare function getQual(channelid: string): Promise<qualmatch>;
export declare function getQuals(): Promise<qualmatch[]>;
export declare function getSingularQuals(_id: string): Promise<qualmatch>;
export declare function addProfile(User: user): Promise<void>;
export declare function getProfile(_id: string): Promise<user>;
export declare function updateProfile(_id: string, field: string, num: number): Promise<void>;
export declare function addUser(user: user): Promise<void>;
export declare function deleteActive(match: activematch): Promise<void>;
export declare function deleteQuals(match: qualmatch): Promise<void>;
export declare function insertSignups(signup: signups): Promise<void>;
export declare function getSignups(): Promise<signups>;
export declare function updateSignup(signup: signups): Promise<void>;
export declare function deleteSignup(): Promise<string>;
export declare function insertMatchlist(matchlists: matchlist): Promise<void>;
export declare function getMatchlist(): Promise<matchlist>;
export declare function updateMatchlist(matchlists: matchlist): Promise<void>;
