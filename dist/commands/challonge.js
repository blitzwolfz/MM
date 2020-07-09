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
exports.matchlistmaker = exports.declarequalwinner = exports.ChannelCreation = exports.CreateChallongeMatchBracket = exports.CreateChallongeQualBracket = void 0;
const Discord = __importStar(require("discord.js"));
const db_1 = require("../misc/db");
const challonge = require("challonge-js");
async function CreateChallongeQualBracket(message, disclient, args) {
    if (message.member.roles.cache.has('724818272922501190')
        || message.member.roles.cache.has('724832462286356590')) {
        const client = challonge.createClient({
            apiKey: process.env.CHALLONGE
        });
        let id = (args.join("")).replace("https://challonge.com/", "");
        let matchlist = await db_1.getMatchlist();
        let Signups = await db_1.getSignups();
        console.log(id);
        if (Signups) {
            if (Signups.open === false) {
                for (let i = 0; i < Signups.users.length; i++) {
                    await client.participants.create({
                        id: id,
                        participant: {
                            name: (await disclient.users.fetch(Signups.users[i])).username
                        },
                        callback: (err, data) => {
                            console.log(err, data);
                        }
                    });
                }
            }
            else {
                return message.reply("Signups haven't closed");
            }
        }
        else {
            return message.reply("No one signed up");
        }
        matchlist.qualurl = `${id}`;
        await db_1.updateMatchlist(matchlist);
        console.timeEnd("aaa");
        return message.reply(new Discord.MessageEmbed()
            .setColor("#d7be26")
            .setTitle(`Tournement: ${id}`)
            .setDescription(`Here's the link to the brackers\nhttps://www.challonge.com/${id}`)
            .setTimestamp());
    }
    else {
        await (await disclient.users.fetch(message.author.id)).send("You aren't allowed to use that command!");
    }
}
exports.CreateChallongeQualBracket = CreateChallongeQualBracket;
async function CreateChallongeMatchBracket(message, disclient, args) {
    if (message.member.roles.cache.has('724818272922501190')
        || message.member.roles.cache.has('724818272922501190')
        || message.member.roles.cache.has('724832462286356590')) {
        const client = challonge.createClient({
            apiKey: process.env.CHALLONGE
        });
        let matchid = (args.join("")).replace("https://challonge.com/", "");
        let matchlist = await db_1.getMatchlist();
        console.log(matchid);
        let qualid = (matchlist.qualurl);
        qualid = qualid.replace("https://challonge.com/", "");
        console.log(qualid);
        console.log("ok");
        client.participants.index({
            id: qualid,
            callback: async (err, data) => {
                console.log("ok");
                console.log(err);
                console.log(data);
                for (let i = 0; i < data.length; i++) {
                    console.log("ok");
                    if (data[i].participant.finalRank <= 16) {
                        console.log("ok");
                        console.log(data[i].participant.name);
                        client.participants.create({
                            id: matchid,
                            participant: {
                                name: data[i].participant.name
                            },
                            callback: (err, data) => {
                                console.log(err, data);
                            }
                        });
                    }
                }
            }
        });
        matchlist.url = `${matchid}`;
        await db_1.updateMatchlist(matchlist);
        await message.reply(new Discord.MessageEmbed()
            .setColor("#d7be26")
            .setTitle(`Meme Mania ${args[0]}`)
            .setDescription(`Here's the link to the brackets\nhttps://www.challonge.com/${matchid}`)
            .setTimestamp());
    }
    else {
        await (await disclient.users.fetch(message.author.id)).send("You aren't allowed to use that command!");
    }
}
exports.CreateChallongeMatchBracket = CreateChallongeMatchBracket;
async function ChannelCreation(message, disclient, args) {
    console.log("OK");
    if (!args)
        return message.reply("Please input round number!");
    else {
        const client = challonge.createClient({
            apiKey: process.env.CHALLONGE
        });
        let matchlist = await db_1.getMatchlist();
        console.log(disclient.ws.ping);
        console.log("OK");
        await client.matches.index({
            id: matchlist.url,
            callback: async (err, data) => {
                if (err)
                    console.log(err);
                for (let i = 0; i < data.length; i++) {
                    if (data[i].match.round === parseInt(args[0])) {
                        if (data[i].match.winnerId === null && data[i].match.loserId === null) {
                            let oneid = data[i].match.player1Id;
                            let twoid = data[i].match.player2Id;
                            let channelstringname = "";
                            client.participants.index({
                                id: matchlist.url,
                                callback: async (err, data) => {
                                    if (err)
                                        console.log(err);
                                    for (let x = 0; x < data.length; x++) {
                                        if (data[x].participant.id === oneid) {
                                            channelstringname += data[x].participant.name.substring(0, 5);
                                        }
                                        if (channelstringname) {
                                            if (data[x].participant.id === twoid) {
                                                channelstringname += "vs" + data[x].participant.name.substring(0, 5);
                                                break;
                                            }
                                        }
                                    }
                                    if (channelstringname.includes("vs")) {
                                        await message.guild.channels.create(`${channelstringname}`, { type: 'text', topic: `Round ${args[0]}` })
                                            .then(async (channel) => {
                                            let category = await message.guild.channels.cache.find(c => c.name == "tournament" && c.type == "category");
                                            if (!category)
                                                throw new Error("Category channel does not exist");
                                            await channel.setParent(category.id);
                                        });
                                    }
                                }
                            });
                        }
                    }
                }
            }
        });
    }
}
exports.ChannelCreation = ChannelCreation;
async function declarequalwinner(message, client) {
    if (message.member.roles.cache.has('724818272922501190')
        || message.member.roles.cache.has('724818272922501190')
        || message.member.roles.cache.has('724832462286356590')) {
        try {
            let id = message.mentions.users.first().id;
            let match = await db_1.getMatchlist();
            if (!match) {
                let newmatch = {
                    _id: 3,
                    url: "",
                    qualurl: "",
                    users: [],
                };
                newmatch.users.push(id);
                await db_1.updateMatchlist(newmatch);
                return message.reply(", added user.");
            }
            else if (match) {
                if (match.users.includes(id)) {
                    return message.reply(", user already added.");
                }
                else {
                    match.users.push(id);
                    await db_1.updateMatchlist(match);
                    return message.reply(", added user.");
                }
            }
        }
        catch (err) {
            message.channel.send("```" + err + "```");
            return message.reply(", there is an error! Ping blitz and show him the error.");
        }
    }
    else {
        await (await client.users.fetch(message.author.id)).send("You aren't allowed to use that command!");
    }
}
exports.declarequalwinner = declarequalwinner;
async function matchlistmaker() {
    let match = await db_1.getMatchlist();
    if (!match) {
        let newmatch = {
            _id: 3,
            url: "",
            qualurl: "",
            users: [],
        };
        db_1.insertMatchlist(newmatch);
    }
}
exports.matchlistmaker = matchlistmaker;
