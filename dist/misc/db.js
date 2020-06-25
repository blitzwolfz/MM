"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuals = exports.deleteActive = exports.addUser = exports.updateProfile = exports.getProfile = exports.addProfile = exports.getSingularQuals = exports.getQuals = exports.getMatch = exports.getActive = exports.updateQuals = exports.insertQuals = exports.updateActive = exports.insertActive = exports.connectToDB = void 0;
const mongo = __importStar(require("mongodb"));
require("dotenv").config();
const MongoClient = mongo.MongoClient;
const client = new MongoClient(process.env.DBURL, { useUnifiedTopology: true });
async function connectToDB() {
    return new Promise(resolve => {
        client.connect(async (err) => {
            if (err)
                throw err;
            console.log("Successfully connected");
            client.db(process.env.DBNAME).createCollection("activematch");
            client.db(process.env.DBNAME).createCollection("quals");
            client.db(process.env.DBNAME).createCollection("users");
            resolve();
        });
    });
}
exports.connectToDB = connectToDB;
async function insertActive(activematch) {
    await client.db(process.env.DBNAME).collection("activematch").insertOne(activematch);
    console.log("Inserted ActiveMatches!");
}
exports.insertActive = insertActive;
async function updateActive(activematch) {
    let _id = activematch.channelid;
    await client.db(process.env.DBNAME).collection("activematch").updateOne({ _id }, { $set: activematch });
    console.log("Updated Match!");
}
exports.updateActive = updateActive;
async function insertQuals(Qual) {
    await client.db(process.env.DBNAME).collection("quals").insertOne(Qual);
    console.log("Updated Match!");
}
exports.insertQuals = insertQuals;
async function updateQuals(Qual) {
    let _id = Qual.channelid;
    await client.db(process.env.DBNAME).collection("quals").updateOne({ _id }, { $set: Qual });
    console.log("Inserted Quals!");
}
exports.updateQuals = updateQuals;
async function getActive() {
    console.log("Getting ActiveMatches");
    return await client.db(process.env.DBNAME).collection("activematch").find({}, { projection: { _id: 0 } }).toArray();
}
exports.getActive = getActive;
async function getMatch(channelid) {
    return client.db(process.env.DBNAME).collection("activematch").findOne({ _id: channelid });
}
exports.getMatch = getMatch;
async function getQuals() {
    console.log("Getting Quals!");
    return await client.db(process.env.DBNAME).collection("quals").find({}, { projection: { _id: 0 } }).toArray();
}
exports.getQuals = getQuals;
async function getSingularQuals(_id) {
    console.log("Getting Quals!");
    return await client.db(process.env.DBNAME).collection("quals").findOne({ _id }, { projection: { _id: 0 } });
}
exports.getSingularQuals = getSingularQuals;
async function addProfile(User) {
    await client.db(process.env.DBNAME).collection("users").insertOne(User);
}
exports.addProfile = addProfile;
async function getProfile(_id) {
    return client.db(process.env.DBNAME).collection("users").findOne({ _id: _id });
}
exports.getProfile = getProfile;
async function updateProfile(_id, field, num) {
    if (field === "wins") {
        client.db(process.env.DBNAME).collection("users").updateOne({ _id: _id }, { $inc: { "wins": num } });
    }
    else {
        client.db(process.env.DBNAME).collection("users").updateOne({ _id: _id }, { $inc: { "loss": num } });
    }
}
exports.updateProfile = updateProfile;
async function addUser(user) {
    await client.db(process.env.DBNAME).collection("users").insertOne(user);
}
exports.addUser = addUser;
async function deleteActive(match) {
    let _id = match.channelid;
    await client.db(process.env.DBNAME).collection("activematch").deleteOne({ _id });
    console.log("deleted active match");
}
exports.deleteActive = deleteActive;
async function deleteQuals(match) {
    await client.db(process.env.DBNAME).collection("quals").deleteOne({ _id: match.channelid });
    console.log("deleted quals");
}
exports.deleteQuals = deleteQuals;
