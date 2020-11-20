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
exports.insertExhibition = exports.updateExhibition = exports.getExhibition = exports.deleteGroupmatch = exports.getGroupmatch = exports.getGroupmatches = exports.updateGroupmatch = exports.insertGroupmatch = exports.getalltempStructs = exports.deletetempStruct = exports.updatetempStruct = exports.inserttempStruct = exports.getthemes = exports.insertlist = exports.gettempStruct = exports.getAllModProfiles = exports.resetModProfile = exports.updateModProfile = exports.addModProfile = exports.getModProfile = exports.getAllCockratings = exports.updateCockrating = exports.getCockrating = exports.insertCockrating = exports.updateVerify = exports.getVerify = exports.insertVerify = exports.updateMatchlist = exports.getMatchlist = exports.insertMatchlist = exports.deleteQuallist = exports.updateQuallist = exports.getQuallist = exports.insertQuallist = exports.deleteSignup = exports.updateSignup = exports.getSignups = exports.insertSignups = exports.deleteQuals = exports.deleteActive = exports.addUser = exports.changefield = exports.updateProfile = exports.getProfile = exports.getAllProfiles = exports.addProfile = exports.getSingularQuals = exports.getQuals = exports.getQual = exports.getMatch = exports.getActive = exports.updateQuals = exports.insertQuals = exports.updateActive = exports.insertActive = exports.connectToDB = void 0;
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
            await client.db(process.env.DBNAME).createCollection("activematch");
            await client.db(process.env.DBNAME).createCollection("quals");
            await client.db(process.env.DBNAME).createCollection("users");
            await client.db(process.env.DBNAME).createCollection("signup");
            await client.db(process.env.DBNAME).createCollection("cockrating");
            await client.db(process.env.DBNAME).createCollection("modprofiles");
            await resolve();
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
async function getMatch(_id) {
    let e = await client.db(process.env.DBNAME).collection("activematch").findOne({ _id });
    console.log(e);
    return e;
}
exports.getMatch = getMatch;
async function getQual(channelid) {
    return await client.db(process.env.DBNAME).collection("quals").findOne({ _id: channelid });
}
exports.getQual = getQual;
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
async function getAllProfiles(field) {
    return await client.db(process.env.DBNAME).collection("users").find({}).sort({ [field]: -1 }).toArray();
}
exports.getAllProfiles = getAllProfiles;
async function getProfile(_id) {
    return client.db(process.env.DBNAME).collection("users").findOne({ _id: _id });
}
exports.getProfile = getProfile;
async function updateProfile(_id, field, num) {
    if (field === "name") {
        await client.db(process.env.DBNAME).collection("users").updateOne({ _id: _id }, { $set: { [field]: num } });
    }
    else {
        await client.db(process.env.DBNAME).collection("users").updateOne({ _id: _id }, { $inc: { [field]: num } });
    }
}
exports.updateProfile = updateProfile;
async function changefield() {
    await client.db(process.env.DBNAME).collection("users").updateMany({}, { $rename: { "votes": "memesvoted" } });
}
exports.changefield = changefield;
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
async function insertSignups(signup) {
    await client.db(process.env.DBNAME).collection("signup").insertOne(signup);
}
exports.insertSignups = insertSignups;
async function getSignups() {
    return await client.db(process.env.DBNAME).collection("signup").findOne({ _id: 1 });
}
exports.getSignups = getSignups;
async function updateSignup(signup) {
    await client.db(process.env.DBNAME).collection("signup").updateOne({ _id: 1 }, { $set: signup });
}
exports.updateSignup = updateSignup;
async function deleteSignup() {
    await client.db(process.env.DBNAME).collection("signup").deleteOne({ _id: 1 });
    return "Signups are now deleted!";
}
exports.deleteSignup = deleteSignup;
async function insertQuallist(qualist) {
    await client.db(process.env.DBNAME).collection("signup").insertOne(qualist);
}
exports.insertQuallist = insertQuallist;
async function getQuallist() {
    return await client.db(process.env.DBNAME).collection("signup").findOne({ _id: 2 });
}
exports.getQuallist = getQuallist;
async function updateQuallist(qualist) {
    await client.db(process.env.DBNAME).collection("signup").updateOne({ _id: 2 }, { $set: qualist });
}
exports.updateQuallist = updateQuallist;
async function deleteQuallist() {
    await client.db(process.env.DBNAME).collection("signup").deleteOne({ _id: 2 });
    return "Quallist are now deleted!";
}
exports.deleteQuallist = deleteQuallist;
async function insertMatchlist(matchlists) {
    await client.db(process.env.DBNAME).collection("signup").insertOne(matchlists);
}
exports.insertMatchlist = insertMatchlist;
async function getMatchlist() {
    return await client.db(process.env.DBNAME).collection("signup").findOne({ _id: 3 });
}
exports.getMatchlist = getMatchlist;
async function updateMatchlist(matchlists) {
    await client.db(process.env.DBNAME).collection("signup").updateOne({ _id: 3 }, { $set: matchlists });
}
exports.updateMatchlist = updateMatchlist;
async function insertVerify(verifyform) {
    await client.db(process.env.DBNAME).collection("signup").insertOne(verifyform);
}
exports.insertVerify = insertVerify;
async function getVerify() {
    return await client.db(process.env.DBNAME).collection("signup").findOne({ _id: 4 });
}
exports.getVerify = getVerify;
async function updateVerify(verifyform) {
    await client.db(process.env.DBNAME).collection("signup").updateOne({ _id: 4 }, { $set: verifyform });
}
exports.updateVerify = updateVerify;
async function insertCockrating(cockratingForm) {
    await client.db(process.env.DBNAME).collection("cockrating").insertOne(cockratingForm);
}
exports.insertCockrating = insertCockrating;
async function getCockrating(id) {
    return await client.db(process.env.DBNAME).collection("cockrating").findOne({ _id: id });
}
exports.getCockrating = getCockrating;
async function updateCockrating(cockratingForm) {
    let _id = cockratingForm._id;
    await client.db(process.env.DBNAME).collection("cockrating").updateOne({ _id }, { $set: cockratingForm });
}
exports.updateCockrating = updateCockrating;
async function getAllCockratings() {
    return await client.db(process.env.DBNAME).collection("cockrating").find({}).sort({ num: -1 }).toArray();
}
exports.getAllCockratings = getAllCockratings;
async function getModProfile(_id) {
    return client.db(process.env.DBNAME).collection("modprofiles").findOne({ _id: _id });
}
exports.getModProfile = getModProfile;
async function addModProfile(User) {
    await client.db(process.env.DBNAME).collection("modprofiles").insertOne(User);
}
exports.addModProfile = addModProfile;
async function updateModProfile(_id, field, num) {
    await client.db(process.env.DBNAME).collection("modprofiles").updateOne({ _id: _id }, { $inc: { [field]: num } });
}
exports.updateModProfile = updateModProfile;
async function resetModProfile(_id, profile) {
    await client.db(process.env.DBNAME).collection("modprofiles").updateOne({ _id: _id }, { $set: profile });
}
exports.resetModProfile = resetModProfile;
async function getAllModProfiles(sortby) {
    return await client.db(process.env.DBNAME).collection("modprofiles").find({}).sort({ [sortby]: -1 }).toArray();
}
exports.getAllModProfiles = getAllModProfiles;
async function gettempStruct(_id) {
    return client.db(process.env.DBNAME).collection("tempstruct").findOne({ _id: _id });
}
exports.gettempStruct = gettempStruct;
async function insertlist(lists) {
    let e = {
        _id: "templatelist",
        list: lists
    };
    await client.db(process.env.DBNAME).collection("tempstruct").insertOne(e);
}
exports.insertlist = insertlist;
async function getthemes() {
    return client.db(process.env.DBNAME).collection("tempstruct").findOne({ _id: "themelist" });
}
exports.getthemes = getthemes;
async function inserttempStruct(struct) {
    await client.db(process.env.DBNAME).collection("tempstruct").insertOne(struct);
}
exports.inserttempStruct = inserttempStruct;
async function updatetempStruct(_id, struct) {
    await client.db(process.env.DBNAME).collection("tempstruct").updateOne({ _id }, { $set: struct });
}
exports.updatetempStruct = updatetempStruct;
async function deletetempStruct(_id) {
    await client.db(process.env.DBNAME).collection("tempstruct").deleteOne({ _id });
}
exports.deletetempStruct = deletetempStruct;
async function getalltempStructs() {
    let e = await client.db(process.env.DBNAME).collection("tempstruct").find({}).toArray();
    e.splice(0, 1);
    return e;
}
exports.getalltempStructs = getalltempStructs;
async function insertGroupmatch(match) {
    await client.db(process.env.DBNAME).collection("groupmatch").insertOne(match);
    console.log("Inserted ActiveMatches!");
}
exports.insertGroupmatch = insertGroupmatch;
async function updateGroupmatch(activematch) {
    let _id = activematch._id;
    await client.db(process.env.DBNAME).collection("groupmatch").updateOne({ _id }, { $set: activematch });
    console.log("Updated Group Match!");
}
exports.updateGroupmatch = updateGroupmatch;
async function getGroupmatches() {
    console.log("Getting groupmatches");
    return await client.db(process.env.DBNAME).collection("groupmatch").find({}, { projection: { _id: 0 } }).toArray();
}
exports.getGroupmatches = getGroupmatches;
async function getGroupmatch(_id) {
    return await client.db(process.env.DBNAME).collection("groupmatch").findOne({ _id });
}
exports.getGroupmatch = getGroupmatch;
async function deleteGroupmatch(match) {
    let _id = match._id;
    await client.db(process.env.DBNAME).collection("groupmatch").deleteOne({ _id });
    console.log("deleted group match");
}
exports.deleteGroupmatch = deleteGroupmatch;
async function getExhibition() {
    return await client.db(process.env.DBNAME).collection("signup").findOne({ _id: 5 });
}
exports.getExhibition = getExhibition;
async function updateExhibition(ex) {
    await client.db(process.env.DBNAME).collection("signup").updateOne({ _id: 5 }, { $set: ex });
}
exports.updateExhibition = updateExhibition;
async function insertExhibition() {
    let e = {
        _id: 5,
        cooldowns: [],
        activematches: [],
        activeoffers: []
    };
    await client.db(process.env.DBNAME).collection("signup").insertOne(e);
}
exports.insertExhibition = insertExhibition;
