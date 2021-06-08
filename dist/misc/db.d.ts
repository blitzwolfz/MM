import * as mongo from "mongodb";
import { activematch, qualmatch, user, signups, matchlist, verificationform, quallist, cockratingInterface, modprofile, randomtempstruct, groupmatch, exhibition, configDB, reminder, duelprofile } from "./struct";
export declare function connectToDB(): Promise<void>;
export declare function dbTester(): Promise<void>;
export declare function updater(coll: string, filter: object, update: object): Promise<void>;
export declare function insertDoc(coll: string, upd: object): Promise<void>;
export declare function getDoc(coll: string, id: string): Promise<any>;
export declare function updateDoc(coll: string, id: string, upd: object): Promise<mongo.UpdateWriteOpResult>;
export declare function deleteDoc(coll: string, id: string): Promise<mongo.DeleteWriteOpResultObject>;
export declare function insertActive(activematch: activematch): Promise<void>;
export declare function dbSoftReset(): Promise<void>;
export declare function updateActive(activematch: activematch): Promise<void>;
export declare function insertQuals(Qual: qualmatch): Promise<void>;
export declare function updateQuals(Qual: qualmatch): Promise<void>;
export declare function getActive(): Promise<activematch[]>;
export declare function getMatch(_id: string, q?: string): Promise<activematch>;
export declare function getQual(channelid: string): Promise<qualmatch>;
export declare function getQuals(): Promise<qualmatch[]>;
export declare function getSingularQuals(_id: string): Promise<qualmatch>;
export declare function addProfile(User: user): Promise<void>;
export declare function getAllProfiles(field: string): Promise<user[]>;
export declare function getProfile(_id: string): Promise<user>;
export declare function updateProfile(_id: string, field: string, num: any): Promise<void>;
export declare function changefield(): Promise<void>;
export declare function addUser(user: user): Promise<void>;
export declare function deleteActive(match: activematch): Promise<void>;
export declare function deleteQuals(match: qualmatch): Promise<void>;
export declare function insertSignups(signup: signups): Promise<void>;
export declare function getSignups(): Promise<signups>;
export declare function updateSignup(signup: signups): Promise<void>;
export declare function deleteSignup(): Promise<string>;
export declare function insertQuallist(qualist: quallist): Promise<void>;
export declare function getQuallist(): Promise<quallist>;
export declare function updateQuallist(qualist: quallist): Promise<void>;
export declare function deleteQuallist(): Promise<string>;
export declare function insertMatchlist(matchlists: matchlist): Promise<void>;
export declare function getMatchlist(): Promise<matchlist>;
export declare function updateMatchlist(matchlists: matchlist): Promise<void>;
export declare function getConfig(): Promise<configDB>;
export declare function updateConfig(c: configDB): Promise<void>;
export declare function insertConfig(): Promise<void>;
export declare function insertVerify(verifyform: verificationform): Promise<void>;
export declare function getVerify(): Promise<verificationform>;
export declare function updateVerify(verifyform: verificationform): Promise<void>;
export declare function insertCockrating(cockratingForm: cockratingInterface): Promise<void>;
export declare function getCockrating(id: string): Promise<cockratingInterface>;
export declare function updateCockrating(cockratingForm: cockratingInterface): Promise<void>;
export declare function getAllCockratings(): Promise<cockratingInterface[]>;
export declare function getModProfile(_id: string): Promise<modprofile>;
export declare function addModProfile(User: modprofile): Promise<void>;
export declare function updateModProfile(_id: string, field: string, num: number): Promise<void>;
export declare function resetModProfile(_id: string, profile: modprofile): Promise<void>;
export declare function getAllModProfiles(sortby: string): Promise<modprofile[]>;
export declare function gettempStruct(_id: string): Promise<randomtempstruct>;
export declare function inserttemplate(lists: any[]): Promise<void>;
export declare function gettemplatedb(): Promise<{
    _id: "templatelist";
    list: string[];
}>;
export declare function updatetemplatedb(lists: string[]): Promise<void>;
export declare function getthemes(): Promise<{
    _id: "themelist";
    list: string[];
}>;
export declare function updateThemedb(st: {
    _id: "themelist";
    list: string[];
}): Promise<void>;
export declare function inserttempStruct(struct: randomtempstruct): Promise<void>;
export declare function updatetempStruct(_id: string, struct: randomtempstruct): Promise<void>;
export declare function deletetempStruct(_id: string): Promise<void>;
export declare function getalltempStructs(): Promise<randomtempstruct[]>;
export declare function insertGroupmatch(match: groupmatch): Promise<void>;
export declare function updateGroupmatch(activematch: groupmatch): Promise<void>;
export declare function getGroupmatches(): Promise<groupmatch[]>;
export declare function getGroupmatch(_id: string): Promise<groupmatch>;
export declare function deleteGroupmatch(match: groupmatch): Promise<void>;
export declare function getExhibition(): Promise<exhibition>;
export declare function updateExhibition(ex: exhibition): Promise<void>;
export declare function insertExhibition(): Promise<void>;
export declare function insertReminder(r: reminder): Promise<void>;
export declare function getReminder(id: string): Promise<reminder>;
export declare function getReminders(q?: object): Promise<reminder[]>;
export declare function updateReminder(r: reminder): Promise<void>;
export declare function deleteReminder(r: reminder): Promise<void>;
export declare function addDuelProfile(User: duelprofile, guild: string): Promise<void>;
export declare function getAllDuelProfiles(guild: string): Promise<duelprofile[]>;
export declare function getDuelProfile(_id: string, guild: string): Promise<duelprofile>;
export declare function updateDuelProfile(_id: string, u: duelprofile, guild: string): Promise<void>;
