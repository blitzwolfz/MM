import { activematch, qualmatch, user } from "./struct";
export declare function connectToDB(): Promise<void>;
export declare function insertActive(activematch: activematch): Promise<void>;
export declare function updateActive(activematch: activematch): Promise<void>;
export declare function insertQuals(Qual: qualmatch): Promise<void>;
export declare function updateQuals(Qual: qualmatch): Promise<void>;
export declare function getActive(): Promise<activematch[]>;
export declare function getQuals(): Promise<qualmatch[]>;
export declare function addProfile(User: user): Promise<void>;
export declare function getProfile(userid: string): Promise<user>;
export declare function addUser(user: user): Promise<void>;
export declare function deleteActive(match: activematch): Promise<void>;
export declare function deleteQuals(match: qualmatch): Promise<void>;
