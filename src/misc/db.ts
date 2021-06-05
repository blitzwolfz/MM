import * as mongo from "mongodb"

require("dotenv").config();

import { activematch, qualmatch, user, signups, matchlist, 
    verificationform, quallist, cockratingInterface, 
    modprofile, randomtempstruct, groupmatch, exhibition, configDB, reminder, duelprofile } from "./struct";

const MongoClient = mongo.MongoClient
//const assert = require("assert")

const client = new MongoClient(process.env.DBURL!, { useUnifiedTopology: true })

export async function connectToDB(): Promise<void> {
    return new Promise(resolve => {
        client.connect(async (err: any) => {
            if (err) throw err;
            console.log("Successfully connected");
            await client.db(process.env.DBNAME).createCollection("activematch");
            await client.db(process.env.DBNAME).createCollection("quals");
            await client.db(process.env.DBNAME).createCollection("users");
            await client.db(process.env.DBNAME).createCollection("signup")
            await client.db(process.env.DBNAME).createCollection("cockrating")
            await client.db(process.env.DBNAME).createCollection("modprofiles")
            await client.db(process.env.DBNAME).createCollection("719406444109103117")
            await client.db(process.env.DBNAME).createCollection("819167358828281876")
            await resolve();
        });
    });
}

export async function updater(coll:string, filter:object, update:object){
    await client.db(process.env.DBNAME).collection(coll).updateMany(filter, update)
}

export async function insertDoc(coll:string, upd:object){
    await client.db(process.env.DBNAME).collection(coll).insertOne(upd)
}

export async function getDoc(coll:string, id:string) {
    return await client.db(process.env.DBNAME).collection(coll).findOne({_id:id})
}

export async function updateDoc(coll:string, id:string, upd:object) {
    return await client.db(process.env.DBNAME).collection(coll).updateOne({_id:id}, {$set:upd})
}

export async function deleteDoc(coll:string, id:string) {
    return await client.db(process.env.DBNAME).collection(coll).deleteOne({_id:id})
}

export async function insertActive(activematch: activematch): Promise<void> {
    await client.db(process.env.DBNAME).collection("activematch").insertOne(activematch);
    console.log("Inserted ActiveMatches!")
}

export async function dbSoftReset(): Promise<void> {
    await client.db(process.env.DBNAME).collection("users").deleteMany({})
    await client.db(process.env.DBNAME).collection("cockrating").deleteMany({})
    await client.db(process.env.DBNAME).collection("modprofiles").deleteMany({})
}

export async function updateActive(activematch: activematch): Promise<void> {
    let _id = activematch.channelid
    await client.db(process.env.DBNAME).collection("activematch").updateOne({_id}, {$set: activematch});
    console.log("Updated Match!")
}

export async function insertQuals(Qual: qualmatch): Promise<void> {
    await client.db(process.env.DBNAME).collection("quals").insertOne(Qual);
    console.log("Updated Match!")
}

export async function updateQuals(Qual: qualmatch): Promise<void> {
    let _id = Qual.channelid
    await client.db(process.env.DBNAME).collection("quals").updateOne({_id}, {$set: Qual});
    console.log("Inserted Quals!")
}

export async function getActive(): Promise<activematch[]>{
    console.log("Getting ActiveMatches")
    // return await client.db(process.env.DBNAME).collection("activematch").find({}, {projection:{ _id: 0 }}).select(['activematch']).toArray();
    return await client.db(process.env.DBNAME).collection("activematch").find({}).toArray();
}

export async function getMatch(_id:string, q?:string): Promise<activematch>{
    return await client.db(process.env.DBNAME).collection("activematch").findOne({_id})!;
}

export async function getQual(channelid:string): Promise<qualmatch>{
    return await client.db(process.env.DBNAME).collection("quals").findOne({_id:channelid})!;
}

export async function getQuals(): Promise<qualmatch[]>{
    console.log("Getting Quals!")
    return await client.db(process.env.DBNAME).collection("quals").find({}, {projection:{ _id: 0 }}).toArray();
}

export async function getSingularQuals(_id:string): Promise<qualmatch>{
    console.log("Getting Quals!")
    return await client.db(process.env.DBNAME).collection("quals").findOne({_id}, {projection:{ _id: 0 }})!;
}

export async function addProfile(User:user): Promise<void> {
    await client.db(process.env.DBNAME).collection("users").insertOne(User)!;
}

export async function getAllProfiles(field:string): Promise<user[]> {
    if(field !== "ratio"){
        return await client.db(process.env.DBNAME).collection("users").find({}).sort({[field]: -1}).toArray();

    }

    else{
        let arr:user[] = await client.db(process.env.DBNAME).collection("users").find({}).sort({[field]: -1}).toArray();
        console.log(await arr.sort(function(a, b) {

            let sum1 = 0;

            if(b.wins+b.loss !== 0){
                sum1 = (Math.floor(b.wins/(b.wins+b.loss) * 100))
            }

            let sum2 = 0;

            if(a.wins+a.loss !== 0){
                sum2 = (Math.floor(a.wins/(a.wins+a.loss) * 100))
            }

            return sum1 - sum2;
        }))

        return await arr.sort(function(a, b) {

            let sum1 = 0;

            if(b.wins+b.loss !== 0){
                sum1 = (Math.floor(b.wins/(b.wins+b.loss) * 100))
            }

            let sum2 = 0;

            if(a.wins+a.loss !== 0){
                sum2 = (Math.floor(a.wins/(a.wins+a.loss) * 100))
            }

            return sum1 - sum2;
        });
    }

}

export async function getProfile(_id: string): Promise<user> {
    return client.db(process.env.DBNAME).collection("users").findOne({_id:_id})!;
}

export async function updateProfile(_id:string, field:string, num: any): Promise<void> {
    //await client.db(process.env.DBNAME).collection("modprofiles").updateOne({_id:_id}, {$inc:{[field]:num}})!
    if(field === "name"){
        await client.db(process.env.DBNAME).collection("users").updateOne({_id:_id}, {$set:{[field]:num}})!;
    }
    else{
        await client.db(process.env.DBNAME).collection("users").updateOne({_id:_id}, {$inc:{[field]:num}})!;
    }
}

export async function changefield(): Promise<void> {
    await client.db(process.env.DBNAME).collection("users").updateMany( {}, { $rename: { "votes": "memesvoted" } } )  
    
}

export async function addUser(user:user): Promise<void> {
    await client.db(process.env.DBNAME).collection("users").insertOne(user)!;
}

export async function deleteActive(match: activematch): Promise<void>{
    let _id = match.channelid
    await client.db(process.env.DBNAME).collection("activematch").deleteOne({_id})
    console.log("deleted active match")
}

export async function deleteQuals(match: qualmatch): Promise<void>{
    await client.db(process.env.DBNAME).collection("quals").deleteOne({_id:match.channelid})
    console.log("deleted quals")
}

export async function insertSignups(signup: signups): Promise<void>{
    await client.db(process.env.DBNAME).collection("signup").insertOne(signup)
}

export async function getSignups(): Promise<signups>{
    return await client.db(process.env.DBNAME).collection("signup").findOne({ _id: 1 })!;
}

export async function updateSignup(signup: signups): Promise<void> {
    await client.db(process.env.DBNAME).collection("signup").updateOne({_id:1}, {$set: signup});
}

export async function deleteSignup(): Promise<string>{
    await client.db(process.env.DBNAME).collection("signup").deleteOne({_id: 1})
    return "Signups are now deleted!";
}

//Break

export async function insertQuallist(qualist: quallist): Promise<void>{
    await client.db(process.env.DBNAME).collection("signup").insertOne(qualist)
}

export async function getQuallist(): Promise<quallist>{
    return await client.db(process.env.DBNAME).collection("signup").findOne({ _id: 2 })!;
}

export async function updateQuallist(qualist: quallist): Promise<void> {
    await client.db(process.env.DBNAME).collection("signup").updateOne({_id:2}, {$set: qualist});
}

export async function deleteQuallist(): Promise<string>{
    await client.db(process.env.DBNAME).collection("signup").deleteOne({_id: 2})
    return "Quallist are now deleted!";
}

//Break

export async function insertMatchlist(matchlists: matchlist): Promise<void>{
    await client.db(process.env.DBNAME).collection("signup").insertOne(matchlists)
}

export async function getMatchlist(): Promise<matchlist>{
    return await client.db(process.env.DBNAME).collection("signup").findOne({ _id: 3 })!;
}

export async function updateMatchlist(matchlists: matchlist): Promise<void> {
    await client.db(process.env.DBNAME).collection("signup").updateOne({_id:3}, {$set: matchlists});
}

export async function getConfig(): Promise<configDB> {
    return client.db(process.env.DBNAME)?.collection("signup")?.findOne({ _id: "config" })!;
}

export async function updateConfig(c:configDB): Promise<void> {
    client.db(process.env.DBNAME)?.collection("signup")?.updateOne({ _id: "config"}, {$set: c} )!;
}

export async function insertConfig() {
    let c:configDB = {
        _id:"config",
        upmsg: ""
    }

    client.db(process.env.DBNAME)?.collection("signup")?.insertOne(c)!;
}


// export async function deleteMatchlist(): Promise<string>{
//     await client.db(process.env.DBNAME).collection("signup").deleteOne({_id: 3})
//     return "Matchlist are now deleted!";
// }

export async function insertVerify(verifyform: verificationform): Promise<void>{
    await client.db(process.env.DBNAME).collection("signup").insertOne(verifyform)
}

export async function getVerify(): Promise<verificationform>{
    return await client.db(process.env.DBNAME).collection("signup").findOne({ _id: 4 })!;
}

export async function updateVerify(verifyform: verificationform): Promise<void> {
    await client.db(process.env.DBNAME).collection("signup").updateOne({_id:4}, {$set: verifyform});
}

export async function insertCockrating(cockratingForm: cockratingInterface): Promise<void>{
    await client.db(process.env.DBNAME).collection("cockrating").insertOne(cockratingForm)
}

export async function getCockrating(id: string): Promise<cockratingInterface>{
    return await client.db(process.env.DBNAME).collection("cockrating").findOne({ _id:id })!;
}

export async function updateCockrating(cockratingForm: cockratingInterface): Promise<void> {
    let _id = cockratingForm._id
    await client.db(process.env.DBNAME).collection("cockrating").updateOne({_id}, {$set: cockratingForm});
}

export async function getAllCockratings(): Promise<cockratingInterface[]>{
    return await client.db(process.env.DBNAME).collection("cockrating").find({}).sort({num:-1}).toArray();
}

/*Mod profiles*/

export async function getModProfile(_id: string): Promise<modprofile> {
    return client.db(process.env.DBNAME).collection("modprofiles").findOne({_id:_id})!;
}

export async function addModProfile(User:modprofile): Promise<void> {
    await client.db(process.env.DBNAME).collection("modprofiles").insertOne(User)!;
}

export async function updateModProfile(_id:string, field:string, num: number, ): Promise<void> {

    await client.db(process.env.DBNAME).collection("modprofiles").updateOne({_id:_id}, {$inc:{[field]:num}})!
}

export async function resetModProfile(_id:string, profile:modprofile){
    await client.db(process.env.DBNAME).collection("modprofiles").updateOne({_id:_id}, {$set:profile})!;
}

export async function getAllModProfiles(sortby: string): Promise<modprofile[]>{
    return await client.db(process.env.DBNAME).collection("modprofiles").find({}).sort({[sortby]:-1}).toArray();
}


/*Temp struct*/

export async function gettempStruct(_id: string): Promise<randomtempstruct> {
    return client.db(process.env.DBNAME).collection("tempstruct").findOne({_id:_id})!;
}

export async function inserttemplate(lists:any[]) {
    let e = {
        _id:"templatelist",
        list:lists
    }

    console.log(e)
    await client.db(process.env.DBNAME).collection("tempstruct").insertOne(e)    
}

export async function gettemplatedb(): Promise<{_id:"templatelist", list: string[]}> {
    return client.db(process.env.DBNAME).collection("tempstruct").findOne({_id:"templatelist"})!;   
}

export async function updatetemplatedb(lists:string[]) {
    let e = {
        _id:"templatelist",
        list:lists
    }

    console.log(e)
    await client.db(process.env.DBNAME).collection("tempstruct").updateOne({_id:"templatelist"}, {$set: e})    
}

export async function getthemes(): Promise<{
    _id:"themelist",
    list:string[]
}>{
    return client.db(process.env.DBNAME).collection("tempstruct").findOne({_id:"themelist"})!;   
}

export async function updateThemedb(st:{_id:"themelist",list:string[]}) {
    await client.db(process.env.DBNAME).collection("tempstruct").updateOne({_id:"themelist"}, {$set: st})!;
}

export async function inserttempStruct(struct:randomtempstruct): Promise<void> {
    await client.db(process.env.DBNAME).collection("tempstruct").insertOne(struct)!;
}

export async function updatetempStruct(_id:string, struct:randomtempstruct): Promise<void> {
    await client.db(process.env.DBNAME).collection("tempstruct").updateOne({_id}, {$set: struct})!;
}

export async function deletetempStruct(_id:string): Promise<void>{
    await client.db(process.env.DBNAME).collection("tempstruct").deleteOne({_id});
}

export async function getalltempStructs(): Promise<randomtempstruct[]> {
    let e = await client.db(process.env.DBNAME).collection("tempstruct").find({}).toArray()!;

    e.splice(0, 1)

    return e
}

/*Group struct*/

export async function insertGroupmatch(match: groupmatch): Promise<void> {
    await client.db(process.env.DBNAME).collection("groupmatch").insertOne(match);
    console.log("Inserted ActiveMatches!")
}

export async function updateGroupmatch(activematch: groupmatch): Promise<void> {
    let _id = activematch._id
    await client.db(process.env.DBNAME).collection("groupmatch").updateOne({_id}, {$set: activematch});
    console.log("Updated Group Match!")
}

export async function getGroupmatches(): Promise<groupmatch[]>{
    console.log("Getting groupmatches")
    // return await client.db(process.env.DBNAME).collection("activematch").find({}, {projection:{ _id: 0 }}).select(['activematch']).toArray();
    return await client.db(process.env.DBNAME).collection("groupmatch").find({}, {projection:{_id:0}}).toArray();
}

export async function getGroupmatch(_id:string): Promise<groupmatch>{
    return await client.db(process.env.DBNAME).collection("groupmatch").findOne({_id})!;
}

export async function deleteGroupmatch(match: groupmatch): Promise<void>{
    let _id = match._id
    await client.db(process.env.DBNAME).collection("groupmatch").deleteOne({_id})
    console.log("deleted group match")
}


//exhibition matches

export async function getExhibition(): Promise<exhibition>{
    return await client.db(process.env.DBNAME).collection("signup").findOne({ _id: 5 })!;
}

export async function updateExhibition(ex: exhibition){
    await client.db(process.env.DBNAME).collection("signup").updateOne({_id: 5}, {$set: ex});        
}

export async function insertExhibition(){

    let e:exhibition ={
        _id: 5,
        cooldowns: [],
        activematches: [],
        activeoffers: []
    }
    await client.db(process.env.DBNAME).collection("signup").insertOne(e);        
}

//Reminder db commands
export async function insertReminder(r:reminder) {
    await client.db(process.env.DBNAME).collection("reminders").insertOne(r) 
}

export async function getReminder(id:string): Promise<reminder> {
    return await client.db(process.env.DBNAME).collection("reminders").findOne({_id:id})!
}

export async function getReminders(q?:object): Promise<reminder[]> {
    if(q){
        return await client.db(process.env.DBNAME).collection("reminders").find(q).toArray()
    }
    return await client.db(process.env.DBNAME).collection("reminders").find({}).toArray()
}

export async function updateReminder(r:reminder) {
    await client.db(process.env.DBNAME).collection("reminders").updateOne({_id:r._id}, {$set: r})    
}

export async function deleteReminder(r:reminder) {
    await client.db(process.env.DBNAME).collection("reminders").deleteOne({_id:r._id})  
}

export async function addDuelProfile(User:duelprofile, guild:string): Promise<void> {
    await client.db(process.env.DBNAME).collection(guild).insertOne(User)!;
}

export async function getAllDuelProfiles(guild:string): Promise<duelprofile[]> {
    return client.db(process.env.DBNAME).collection(guild).find({}).toArray()
}

export async function getDuelProfile(_id: string, guild:string): Promise<duelprofile> {
    //@ts-ignore
    return client.db(process.env.DBNAME)!.collection(guild)!.findOne({_id:_id})!;
}

export async function updateDuelProfile(_id:string, u:duelprofile, guild:string): Promise<void> {
    //await client.db(process.env.DBNAME).collection("modprofiles").updateOne({_id:_id}, {$inc:{[field]:num}})!
    await client.db(process.env.DBNAME).collection(guild).updateOne({_id:_id}, {$set: u})!;
}