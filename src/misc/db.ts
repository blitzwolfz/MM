import * as mongo from "mongodb"

require("dotenv").config();

import { activematch, qualmatch, user } from "./struct";

const MongoClient = mongo.MongoClient
//const assert = require("assert")

const client = new MongoClient(process.env.DBURL!)

export async function connectToDB(): Promise<void> {
    return new Promise(resolve => {
        client.connect(async (err: any) => {
            if (err) throw err;
            console.log("Successfully connected");
            client.db(process.env.DBNAME).createCollection("activematch");
            client.db(process.env.DBNAME).createCollection("quals");
            client.db(process.env.DBNAME).createCollection("users");
            resolve();
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

export async function getQuals(): Promise<qualmatch[]>{
    console.log("Getting Quals!")
    return await client.db(process.env.DBNAME).collection("quals").find({}, {projection:{ _id: 0 }}).toArray();
}

export async function getUserProfile(_id: string): Promise<user> {
    return client.db(process.env.DBNAME).collection("users").findOne({ _id })!;
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
