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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchlistmaker = exports.removequalwinner = exports.declarequalwinner = exports.GroupSearch = exports.matchwinner = exports.CreateCustomQualGroups = exports.CreateQualGroups = exports.QualChannelCreation = exports.dirtyChannelcreate = exports.ChannelCreation = exports.CreateChallongeMatchBracket = exports.CreateChallongeQualBracket = void 0;
const Discord = __importStar(require("discord.js"));
const db_1 = require("../misc/db");
const utils_1 = require("../misc/utils");
const card_1 = require("./card");
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
async function CreateChallongeMatchBracket(message, disclient, args, guild) {
    if (message.member.roles.cache.has('724818272922501190')
        || message.member.roles.cache.has('724818272922501190')
        || message.member.roles.cache.has('724832462286356590')) {
        const client = challonge.createClient({
            apiKey: process.env.CHALLONGE
        });
        let matchid = (args.join("")).replace("https://challonge.com/", "");
        let matchlist = await db_1.getMatchlist();
        matchlist.users = await shuffle(matchlist.users);
        matchlist.users = await shuffle(matchlist.users);
        matchlist.users = await shuffle(matchlist.users);
        matchlist.users = await shuffle(matchlist.users);
        matchlist.users = await shuffle(matchlist.users);
        for (let i = 0; i < matchlist.users.length; i++) {
            console.log("ok");
            let name = (await (await guild.members.fetch(matchlist.users[i])).nickname) || await (await disclient.users.fetch(matchlist.users[i])).username;
            client.participants.create({
                id: matchid,
                participant: {
                    name: name
                },
                callback: (err, data) => {
                    console.log(err, data);
                }
            });
        }
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
    if (!args)
        return message.reply("Please input round number!");
    else {
        let names = [];
        let guild = disclient.guilds.cache.get("719406444109103117");
        let match = await db_1.getMatchlist();
        for (let i = 0; i < match.users.length; i++) {
            try {
                let name = ((await (await guild.members.fetch(match.users[i])).nickname) || await (await disclient.users.fetch(match.users[i])).username);
                names.push([name, match.users[i]]);
            }
            catch {
                message.channel.send(`${match.users[i]} is fucked`);
            }
        }
        const client = challonge.createClient({
            apiKey: process.env.CHALLONGE
        });
        let matchlist = await db_1.getMatchlist();
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
                            if (oneid === null || twoid === null)
                                continue;
                            let channelstringname = "";
                            let name1 = "";
                            let name2 = "";
                            let matchid = data[i].match.id;
                            client.participants.index({
                                id: matchlist.url,
                                callback: async (err, data) => {
                                    if (err)
                                        console.log(err);
                                    for (let x = 0; x < data.length; x++) {
                                        if (data[x].participant.id === oneid) {
                                            channelstringname += data[x].participant.name.substring(0, 10);
                                            name1 = data[x].participant.name;
                                            break;
                                        }
                                    }
                                    for (let y = 0; y < data.length; y++) {
                                        if (data[y].participant.id === twoid) {
                                            channelstringname += "-vs-" + data[y].participant.name.substring(0, 10);
                                            name2 = data[y].participant.name;
                                            break;
                                        }
                                    }
                                    if (channelstringname.includes("-vs-")) {
                                        await message.guild.channels.create(channelstringname, { type: 'text', topic: `${matchid},${oneid},${twoid}` })
                                            .then(async (channel) => {
                                            let category = await message.guild.channels.cache.find(c => c.name == "matches" && c.type == "category");
                                            if (!category)
                                                throw new Error("Category channel does not exist");
                                            await channel.setParent(category.id);
                                            await channel.lockPermissions();
                                            let id1 = utils_1.indexOf2d(names, name1, 0, 1);
                                            let id2 = utils_1.indexOf2d(names, name2, 0, 1);
                                            await card_1.vs(channel, disclient, await disclient.users.fetch(id1), await disclient.users.fetch(id2));
                                            await channel.send(`<@${id1}> <@${id2}> You have ${args[1]}h to complete this match. Contact a ref to begin, you may also split your match`);
                                            let time = 48;
                                            let timeArr = [];
                                            timeArr.push(time * 3600);
                                            if ((time - 2) * 3600 > 0) {
                                                timeArr.push((time - 2) * 3600);
                                            }
                                            if ((time - 12) * 3600 > 0) {
                                                timeArr.push((time - 12) * 3600);
                                            }
                                            if ((time - 24) * 3600 > 0) {
                                                timeArr.push((time - 24) * 3600);
                                            }
                                            await db_1.insertReminder({
                                                _id: channel.id,
                                                mention: `<@${id1}> <@${id2}>`,
                                                channel: channel.id,
                                                type: "match",
                                                time: timeArr,
                                                timestamp: Math.floor(Date.now() / 1000),
                                                basetime: time * 3600
                                            });
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
    return message.reply("Made all channels");
}
exports.ChannelCreation = ChannelCreation;
async function dirtyChannelcreate(message, disclient, args) {
    let ids = args.slice(2);
    for (let i = 0; i < ids.length; i++) {
        let channelstringname = await (await disclient.users.fetch(ids[i])).username.substring(0, 10) + "-vs-" + await (await disclient.users.fetch(ids[i + 1])).username.substring(0, 10);
        await message.guild.channels.create(channelstringname, { type: 'text', topic: `` })
            .then(async (channel) => {
            let category = await message.guild.channels.cache.find(c => c.name == "matches" && c.type == "category");
            await channel.send(`<@${ids[i]}> <@${ids[i + 1]}> You have ${args[1]}h to complete this match. Contact a ref to begin, you may also split your match`);
            if (!category)
                throw new Error("Category channel does not exist");
            await channel.setParent(category.id);
            await channel.lockPermissions();
            let t = await db_1.getMatchlist();
            let time = 48;
            let timeArr = [];
            if ((time - 2) * 3600 > 0) {
                timeArr.push((time - 2) * 3600);
            }
            if ((time - 12) * 3600 > 0) {
                timeArr.push((time - 12) * 3600);
            }
            if ((time - 24) * 3600 > 0) {
                timeArr.push((time - 24) * 3600);
            }
            await db_1.insertReminder({
                _id: channel.id,
                mention: `<@${ids[i]}> <@${ids[i + 1]}>`,
                channel: channel.id,
                type: "match",
                time: timeArr,
                timestamp: Math.floor(Date.now() / 1000),
                basetime: time * 3600
            });
            t.qualurl = Math.round(message.createdTimestamp / 1000).toString();
            await db_1.updateMatchlist(t);
        });
        i += 2;
    }
}
exports.dirtyChannelcreate = dirtyChannelcreate;
async function QualChannelCreation(message, args) {
    let groups = await db_1.getQuallist();
    let time = args[1];
    let qlist = await db_1.getMatchlist();
    for (let i = 0; i < groups.users.length; i++) {
        if (groups.users[i].length > 0) {
            let category = await message.guild.channels.cache.find(c => c.name == "qualifiers" && c.type == "category");
            await message.guild.channels.create(`Group ${i + 1}`, { type: 'text', topic: `Round ${args[0]}`, parent: category.id })
                .then(async (channel) => {
                let string = "";
                for (let u of groups.users[i]) {
                    string += `<@${u}> `;
                }
                let time2 = 36;
                let timeArr = [];
                if ((time2 - 2) * 3600 > 0) {
                    timeArr.push((time2 - 2) * 3600);
                }
                if ((time2 - 12) * 3600 > 0) {
                    timeArr.push((time2 - 12) * 3600);
                }
                await db_1.insertReminder({
                    _id: channel.id,
                    mention: string,
                    channel: channel.id,
                    type: "match",
                    time: timeArr,
                    timestamp: Math.floor(Date.now() / 1000),
                    basetime: time2 * 3600
                });
                await channel.send(`${string}, Portion ${args[0]} has begun, and you have ${time}h to complete it. Contact a ref to begin your portion!`);
                qlist.qualurl = channel.createdTimestamp.toString();
            });
        }
    }
    await db_1.updateMatchlist(qlist);
    return message.reply("Made all channels");
}
exports.QualChannelCreation = QualChannelCreation;
async function CreateQualGroups(message, args) {
    if (message.member.roles.cache.has('724818272922501190')
        || message.member.roles.cache.has('724832462286356590')) {
        if (!args) {
            return message.reply("Please enter how many people you want in a group");
        }
        let gNum = parseInt(args[0]);
        let Signups = await db_1.getSignups();
        if (Signups) {
            if (Signups.open === false) {
                for (let x = 0; x < 5; x++) {
                    Signups.users = await shuffle(Signups.users);
                }
                let groups = await makeGroup(gNum, Signups.users);
                await shuffle(groups);
                let qualgroups = await db_1.getQuallist();
                if (qualgroups) {
                    qualgroups.users = groups;
                    await db_1.updateQuallist(qualgroups);
                }
                else {
                    qualgroups = {
                        _id: 2,
                        url: "",
                        users: groups
                    };
                    await db_1.insertQuallist(qualgroups);
                }
                return message.reply("Made qualifier groups");
            }
            else {
                return message.reply("Signups haven't closed");
            }
        }
        else {
            return message.reply("No one signed up");
        }
    }
}
exports.CreateQualGroups = CreateQualGroups;
async function CreateCustomQualGroups(message, args) {
    if (message.member.roles.cache.has('724818272922501190')
        || message.member.roles.cache.has('724832462286356590')) {
        if (!args) {
            return message.reply("Please enter how many people you want in a group");
        }
        let gNum = parseInt(args[0]);
        let am = parseInt(args[2]);
        let gNum2 = parseInt(args[1]);
        let am2 = parseInt(args[3]);
        let Signups = await db_1.getSignups();
        if (Signups) {
            if (Signups.open === false) {
                let groups = [];
                for (let x = 0; x < am2 + gNum2 + am + gNum; x++) {
                    Signups.users = await shuffle(Signups.users);
                }
                groups = (await makeCustomGroup(gNum, Signups.users.slice(0, am + 1)));
                message.reply(await (await makeCustomGroup(gNum, Signups.users.slice(0, am + 1))).length);
                groups = groups.concat(await makeCustomGroup(gNum2, Signups.users.slice(am + 1, am2)));
                message.reply(await (await makeCustomGroup(gNum, Signups.users.slice(am + 1, am2))).length);
                let qualgroups = await db_1.getQuallist();
                if (qualgroups) {
                    qualgroups.users = groups;
                    await db_1.updateQuallist(qualgroups);
                    return message.reply("Made qualifier groups");
                }
                else {
                    qualgroups = {
                        _id: 2,
                        url: "",
                        users: groups
                    };
                    await db_1.insertQuallist(qualgroups);
                    return message.reply("Made qualifier groups");
                }
            }
            else {
                return message.reply("Signups haven't closed");
            }
        }
        else {
            return message.reply("No one signed up");
        }
    }
}
exports.CreateCustomQualGroups = CreateCustomQualGroups;
async function makeGroup(amount, list) {
    let chunks = [], i = 0, n = 63;
    while (i <= n) {
        chunks.push(list.slice(i, i += amount));
    }
    n = Math.abs(list.length - i);
    if (n > 0) {
        for (let x = 0; x < n; x++) {
            console.log(x);
            chunks[x].push(list[i]);
            i += 1;
        }
    }
    return chunks;
}
async function makeCustomGroup(amount, list) {
    let chunks = [], i = 0, n = list.length;
    while (i < n) {
        chunks.push(list.slice(i, i += amount));
    }
    return chunks;
}
async function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
async function matchwinner(args) {
    const client = challonge.createClient({
        apiKey: process.env.CHALLONGE
    });
    let score = `${args[1]}-${args[2]}`;
    client.matches.update({
        id: await (await db_1.getMatchlist()).url,
        matchId: args[0],
        match: {
            scoresCsv: score,
            winnerId: args[3]
        },
        callback: (err, data) => {
            console.log(err, data);
        }
    });
}
exports.matchwinner = matchwinner;
async function GroupSearch(message, args) {
    var _a, _b, _c;
    let signup = await db_1.getQuallist();
    let id = (((_c = (_b = (_a = message.mentions) === null || _a === void 0 ? void 0 : _a.users) === null || _b === void 0 ? void 0 : _b.first()) === null || _c === void 0 ? void 0 : _c.id) || args[0] || message.author.id);
    if (!id)
        return message.reply("invaild input. Please use User ID or a User mention");
    if (!message.member.roles.cache.has('719936221572235295')) {
        for (let i = 0; i < signup.users.length; i++) {
            if (signup.users[i].includes(id)) {
                return await message.reply(`This person is in <#${message.guild.channels.cache.find(channel => channel.name === `group-${i + 1}`).id}>`);
            }
        }
        return message.reply("They are not in a group");
    }
    else {
        if (id !== message.author.id)
            return message.reply("You don't have those premissions");
        else {
            if (!message.member.roles.cache.has('719936221572235295')) {
                for (let i = 0; i < signup.users.length; i++) {
                    if (signup.users[i].includes(id)) {
                        return await message.reply(`You are in <#${message.guild.channels.cache.find(channel => channel.name === `group-${i + 1}`).id}>`);
                    }
                }
                return message.reply("They are not in a group");
            }
        }
    }
}
exports.GroupSearch = GroupSearch;
async function declarequalwinner(message, client) {
    var _a, _b;
    if (message.member.roles.cache.has('724818272922501190')
        || message.member.roles.cache.has('724818272922501190')
        || message.member.roles.cache.has('724832462286356590') || !message.member.roles.cache.has('719936221572235295')) {
        try {
            let id = message.mentions.users.first().id;
            let match = await db_1.getMatchlist();
            if (match) {
                if (match.users.includes(id)) {
                    return message.reply(" user already added.");
                }
                else {
                    match.users.push(id);
                    await db_1.updateMatchlist(match);
                    db_1.updateProfile(id, "wins", 1);
                    db_1.updateProfile(id, "points", 25);
                    await ((_a = message.mentions.users.first()) === null || _a === void 0 ? void 0 : _a.send("Congrats on winning your qualifer. Now get ready for the bracket portion"));
                    return message.reply("added user.");
                }
            }
            else {
                let newmatch = {
                    _id: 3,
                    url: "",
                    qualurl: "",
                    users: [],
                };
                newmatch.users.push(id);
                await db_1.insertMatchlist(newmatch);
                await ((_b = message.mentions.users.first()) === null || _b === void 0 ? void 0 : _b.send("Congrats on winning your qualifer. Now get ready for the bracket portion"));
                return message.reply("added user.");
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
async function removequalwinner(message, client) {
    if (message.member.roles.cache.has('724818272922501190')
        || message.member.roles.cache.has('724818272922501190')
        || message.member.roles.cache.has('724832462286356590') || !message.member.roles.cache.has('719936221572235295')) {
        try {
            let id = message.mentions.users.first().id;
            let match = await db_1.getMatchlist();
            if (match) {
                if (match.users.includes(id)) {
                    match.users.splice(match.users.indexOf(id), 1);
                    await db_1.updateMatchlist(match);
                    return message.reply("user removed.");
                }
                else {
                    return message.reply("user not on list");
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
exports.removequalwinner = removequalwinner;
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
    else {
        match.qualurl = "";
        match.users = [];
        match.url = "";
        await db_1.updateMatchlist(match);
    }
}
exports.matchlistmaker = matchlistmaker;
