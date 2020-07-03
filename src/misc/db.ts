import * as mongo from "mongodb"

require("dotenv").config();

import { activematch, qualmatch, user, signups, matchlist } from "./struct";

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
            await resolve();
        });
    });
}

export async function insertActive(activematch: activematch): Promise<void> {
    await client.db(process.env.DBNAME).collection("activematch").insertOne(activematch);
    console.log("Inserted ActiveMatches!")
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
    return await client.db(process.env.DBNAME).collection("activematch").find({}, {projection:{_id:0}}).toArray();
}

export async function getMatch(channelid:string): Promise<activematch>{
    return client.db(process.env.DBNAME).collection("activematch").findOne({_id:channelid})!;
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

export async function getProfile(_id: string): Promise<user> {
    return client.db(process.env.DBNAME).collection("users").findOne({_id:_id})!;
}

export async function updateProfile(_id:string, field:string, num: number): Promise<void> {
    if(field === "wins"){
        client.db(process.env.DBNAME).collection("users").updateOne({_id:_id}, {$inc:{"wins":num}})!;
    }

    else{
        client.db(process.env.DBNAME).collection("users").updateOne({_id:_id}, {$inc:{"loss":num}})!;
    }
    
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

// export async function insertQuallist(qualist: quallist): Promise<void>{
//     await client.db(process.env.DBNAME).collection("signup").insertOne(qualist)
// }

// export async function getQuallist(): Promise<quallist>{
//     return await client.db(process.env.DBNAME).collection("signup").findOne({ _id: 2 })!;
// }

// export async function updateQuallist(qualist: quallist): Promise<void> {
//     await client.db(process.env.DBNAME).collection("signup").updateOne({_id:2}, {$set: qualist});
// }

// export async function deleteQuallist(): Promise<string>{
//     await client.db(process.env.DBNAME).collection("signup").deleteOne({_id: 2})
//     return "Quallist are now deleted!";
// }

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

// export async function deleteMatchlist(): Promise<string>{
//     await client.db(process.env.DBNAME).collection("signup").deleteOne({_id: 3})
//     return "Matchlist are now deleted!";
// }