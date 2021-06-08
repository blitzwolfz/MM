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
exports.saveDatatofile = exports.CycleRestart = exports.SeasonRestart = exports.toS = exports.toHHMMSS = exports.resultadd = exports.qualifierresultadd = exports.oldqualifierresultadd = exports.clearstats = exports.createrole = exports.updatesomething = exports.deletechannels = exports.autoreminders = exports.aautoreminders = exports.delay = exports.aaautoreminders = exports.reminders = exports.dateBuilder = exports.indexOf2d = exports.forwardsFilter = exports.backwardsFilter = exports.removethreevotes = exports.hasthreevotes = exports.emojis = exports.getUser = void 0;
const Discord = __importStar(require("discord.js"));
const challonge_1 = require("../commands/challonge");
const signups_1 = require("../commands/signups");
const start_1 = require("../commands/start");
const db_1 = require("./db");
const modprofiles_1 = require("./modprofiles");
async function getUser(mention) {
    const matches = mention.match(/^<@!?(\d+)>$/);
    if (!matches)
        return;
    const id = matches[1];
    return id;
}
exports.getUser = getUser;
exports.emojis = [
    "1️⃣",
    "2️⃣",
    "3️⃣",
    "4️⃣",
    "5️⃣",
    "6️⃣",
    "♻️",
    "✅",
    "❌",
    "🌀"
];
function hasthreevotes(arr, search) {
    let x = 0;
    arr.some((row) => {
        if (row.includes(search))
            x++;
    });
    if (x >= 2) {
        return true;
    }
    return false;
}
exports.hasthreevotes = hasthreevotes;
function removethreevotes(arr, search) {
    for (let i = 0; i < arr.length; i++) {
        for (let x = 0; x < arr[i].length; x++) {
            if (arr[i][x] === search) {
                arr[i].splice(x, 1);
            }
        }
    }
    return arr;
}
exports.removethreevotes = removethreevotes;
const backwardsFilter = (reaction, user) => reaction.emoji.name === '⬅' && !user.bot;
exports.backwardsFilter = backwardsFilter;
const forwardsFilter = (reaction, user) => reaction.emoji.name === '➡' && !user.bot;
exports.forwardsFilter = forwardsFilter;
function indexOf2d(arr, item, searchpos, returnpos) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][searchpos] == item) {
            return arr[i][returnpos];
        }
    }
    return -1;
}
exports.indexOf2d = indexOf2d;
function dateBuilder() {
    let d = new Date();
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
    return `${day}, ${month} ${date} ${year}`;
}
exports.dateBuilder = dateBuilder;
async function reminders(client, args) {
    let guild = client.guilds.cache.get("719406444109103117");
    let catchannels = guild.channels.cache.array();
    let pp = 0;
    for (let channel of catchannels) {
        try {
            if (channel.parent && channel.parent.name === "matches") {
                if (await db_1.getMatch(channel.id)) {
                    let match = await db_1.getMatch(channel.id);
                    if (match.split) {
                        if (!match.p1.memedone && !match.p2.memedone) {
                            await client.channels.cache.get(channel.id)
                                .send(`<@${match.p1.userid}>and <@${match.p2.userid}> you have ${args[0]}h left to complete your match`);
                        }
                        else if (match.p1.memedone) {
                            await client.channels.cache.get(channel.id)
                                .send(`<@${match.p2.userid}>you have ${args[0]}h left to complete your match`);
                        }
                        else if (match.p2.memedone) {
                            await client.channels.cache.get(channel.id)
                                .send(`<@${match.p1.userid}>you have ${args[0]}h left to complete your match`);
                        }
                    }
                }
                else {
                    let all = (await (await client.channels.fetch(channel.id))
                        .messages.fetch({ limit: 100 }));
                    let m = all.first();
                    await m.channel
                        .send(`<@${m.mentions.users.first().id}> and <@${m.mentions.users.array()[1].id}>, you have ${args[0]}h left to complete your match`);
                }
            }
            else if (channel.parent && channel.parent.name === "qualifiers") {
                if (await db_1.getQual(channel.id)) {
                    let match = await db_1.getQual(channel.id);
                    let s = "";
                    if (match.votingperiod === true)
                        continue;
                    for (let i = 0; i < match.players.length; i++) {
                        if (!match.playersdone.includes(match.players[i].userid)) {
                            s += `<@${match.players[i].userid}> `;
                        }
                    }
                    await client.channels.cache.get(channel.id)
                        .send(`${s} you have ${args[0]}h left to complete portion ${args[1]}`);
                }
                else {
                    let n = parseInt(channel.name.toLowerCase().split(" ").join("").replace("group", "")) - 1;
                    let x = await (await db_1.getQuallist()).users[n];
                    let s = "";
                    for (let e = 0; e < x.length; e++) {
                        s += `<@${x[e]}> `;
                    }
                    await client.channels.cache.get(channel.id)
                        .send(`<@${s}>, you have ${args[0]}h left to complete portion`);
                }
            }
        }
        catch {
            continue;
        }
        pp += 1;
    }
    try {
        await console.log(`Me gets ${pp} good boy points`);
    }
    catch (error) {
    }
    await autoreminders(client);
}
exports.reminders = reminders;
async function aaautoreminders(client) {
    var _a, _b;
    let reminders = await db_1.getReminders();
    for (let r of reminders) {
        if (Math.floor(Date.now() / 1000) - r.timestamp >= r.time[r.time.length - 1]) {
            if (r.type === "match") {
                if (r.basetime !== r.time[r.time.length - 1]) {
                    for (let xx of r.mention.match(/\d+/g)) {
                        try {
                            (await client.users.fetch(xx)).send(`You have ${(r.basetime - r.time[r.time.length - 1]) / 3600}h left to do your match`);
                        }
                        catch (error) {
                            console.log(error.message);
                            (await client.channels.fetch(r.channel)).send(`${xx} you have ${(r.basetime - r.time[r.time.length - 1]) / 3600}h left to do your match`);
                        }
                    }
                }
                if (r.basetime === r.time[r.time.length - 1]) {
                    let c = client.channels.cache.get(r.channel);
                    let m = (await c.messages.fetch({ limit: 100 })).last();
                    let arr = r.mention.match(/\d+/g);
                    for (let xx of arr) {
                        await start_1.splitregular(m, client, xx);
                        await client.channels.cache.get("748760056333336627").send({
                            embed: {
                                description: `<@${(_a = client.user) === null || _a === void 0 ? void 0 : _a.id}>/${(_b = client.user) === null || _b === void 0 ? void 0 : _b.tag} has auto started <@${xx}> in <#${r.channel}>`,
                                color: "#d7be26",
                                timestamp: new Date()
                            }
                        });
                    }
                }
                r.time.pop();
                if (r.time.length === 0) {
                    await db_1.deleteReminder(r);
                }
                else
                    await db_1.updateReminder(r);
            }
            if (r.type === "meme") {
                (await client.users.cache.get(r._id)).send(`${r.mention} you have ${(r.basetime - r.time[r.time.length - 1]) / 60}m left to do your portion`);
                r.time.pop();
                if (r.time.length === 0) {
                    await db_1.deleteReminder(r);
                }
                else
                    await db_1.updateReminder(r);
            }
        }
    }
}
exports.aaautoreminders = aaautoreminders;
async function delay(message, client, args) {
    let reminder = await db_1.getReminder(await message.mentions.channels.first().id);
    if (message.mentions.channels.array().length === 0) {
        return message.reply("Please mention a channel");
    }
    args.pop();
    let time = 0;
    for (let x of args) {
        if (x.includes("h")) {
            x.replace("h", "");
            time += (parseInt(x) * 3600);
        }
        if (x.includes("m")) {
            x.replace("m", "");
            time += (parseInt(x) * 60);
        }
    }
    if (time === 0) {
        return message.reply("Please enter a valid time in either ``xh xm``, ``xh``, or ``xm`` format.");
    }
    reminder.basetime += time;
    reminder.time[0] += time;
    await db_1.updateReminder(reminder);
    return message.channel.send(`Delayed by ${args.join(" ")}`);
}
exports.delay = delay;
async function aautoreminders(client, ...st) {
    var _a, _b, _c, _d, _e, _f;
    let catchannels = client.guilds.cache.get("719406444109103117").channels.cache.array();
    for (let channel of catchannels) {
        try {
            let all = (await (await client.channels.fetch(channel.id))
                .messages.fetch({ limit: 100 }));
            if (channel.parent && channel.parent.name === "matches") {
                let now = Math.ceil(Math.round(Math.floor(Date.now() / 1000) - Math.floor(1607365500000 / 1000)) / 100) * 100;
                if (await db_1.getMatch(channel.id)) {
                    let match = await db_1.getMatch(channel.id);
                    let stmsg = "";
                    if (!match.p1.memedone)
                        stmsg += `<@${match.p1.userid}>`;
                    if (!match.p2.memedone)
                        stmsg += ` <@${match.p2.userid}>`;
                    if (match.split) {
                        if (stmsg) {
                            if (now === 43200) {
                                await client.channels.cache.get(channel.id)
                                    .send(`${stmsg} you have 12h left to complete your match`);
                            }
                            else if (now === 86400) {
                                await client.channels.cache.get(channel.id)
                                    .send(`${stmsg} you have 24h left to complete your match`);
                            }
                            else if (now === 7200) {
                                await client.channels.cache.get(channel.id)
                                    .send(`${stmsg} you have 2h left to complete your match`);
                            }
                        }
                    }
                    else {
                        if (now === 43200) {
                            await client.channels.cache.get(channel.id)
                                .send(`<@${(_a = all.first()) === null || _a === void 0 ? void 0 : _a.mentions.users.array()[0].id}><@${(_b = all.first()) === null || _b === void 0 ? void 0 : _b.mentions.users.array()[1].id}> you have 12h left to complete your match`);
                        }
                        else if (now === 86400) {
                            await client.channels.cache.get(channel.id)
                                .send(`<@${(_c = all.first()) === null || _c === void 0 ? void 0 : _c.mentions.users.array()[0].id}><@${(_d = all.first()) === null || _d === void 0 ? void 0 : _d.mentions.users.array()[1].id}> you have 24h left to complete your match`);
                        }
                        else if (now === 7200) {
                            await client.channels.cache.get(channel.id)
                                .send(`<@${(_e = all.first()) === null || _e === void 0 ? void 0 : _e.mentions.users.array()[0].id}><@${(_f = all.first()) === null || _f === void 0 ? void 0 : _f.mentions.users.array()[1].id}> you have 2h left to complete your match`);
                        }
                    }
                }
            }
        }
        catch {
            continue;
        }
    }
}
exports.aautoreminders = aautoreminders;
async function autoreminders(client) {
    if (Math.floor((Date.now()) - parseInt(await (await db_1.getMatchlist()).qualurl)) < 165601 * 1000 && Math.floor((Date.now()) - parseInt(await (await db_1.getMatchlist()).qualurl)) > 165600 * 1000) {
        setTimeout(() => { console.log("World!"); }, 2000);
        await reminders(client, ["2"]);
    }
    else if (Math.floor((Date.now()) - parseInt(await (await db_1.getMatchlist()).qualurl)) < 129601 * 1000 && Math.floor((Date.now()) - parseInt(await (await db_1.getMatchlist()).qualurl)) > 129600 * 1000) {
        await reminders(client, ["12"]);
    }
    else if (Math.floor((Date.now()) - parseInt(await (await db_1.getMatchlist()).qualurl)) < 86401 * 1000 && Math.floor((Date.now()) - parseInt(await (await db_1.getMatchlist()).qualurl)) > 86400 * 1000) {
        await reminders(client, ["24"]);
    }
}
exports.autoreminders = autoreminders;
async function deletechannels(message, args) {
    let catchannels = message.guild.channels.cache.array();
    for (let channel of catchannels) {
        try {
            if (channel.parent && channel.parent.name === args[0]) {
                await channel.delete();
            }
        }
        catch {
            continue;
        }
    }
}
exports.deletechannels = deletechannels;
async function updatesomething(message) {
    let allusers = await db_1.getAllProfiles("wins");
    try {
        for (let u of allusers) {
            try {
                await db_1.updateProfile(u._id, "memesvoted", 0);
            }
            catch (err) {
                await message.channel.send("```" + err + "```");
            }
        }
    }
    catch (err) {
        message.channel.send("```" + err + "```");
    }
    await message.channel.send("Done");
}
exports.updatesomething = updatesomething;
async function createrole(message, args) {
    if (!args)
        return message.reply("you forgot to add command flags. `!createrole <name> <multiple | deafult is 1>`");
    let name = args[0];
    if (!args[0])
        return message.reply("Please give a name!!!!");
    let amount = typeof args[1] == "undefined" ? 1 : parseInt(args[1]);
    if (amount === 1) {
        try {
            message.guild.roles.create({
                data: {
                    name: name,
                    color: 'GREY',
                },
                reason: 'idfk',
            })
                .then(console.log)
                .catch(console.error);
        }
        catch (err) {
            message.channel.send("```" + err + "```");
            return message.reply(", there is an error! Ping blitz and show him the error.");
        }
    }
    else if (amount > 1 && amount <= 20) {
        for (let x = 0; x < amount; x++) {
            try {
                message.guild.roles.create({
                    data: {
                        name: `${name}${x + 1}`,
                        color: 'GREY',
                    },
                    reason: 'idfk',
                }).then(async (r) => {
                    message.channel.send(`Role ${name}${x}: <@&${r.id}>`);
                });
            }
            catch (err) {
                message.channel.send("```" + err + "```");
                return message.reply(", there is an error! Ping blitz and show him the error.");
            }
        }
    }
}
exports.createrole = createrole;
async function clearstats(message) {
    let profiles = await db_1.getAllProfiles("memesvoted");
    for (let i = 0; i < profiles.length; i++) {
        await db_1.updateProfile(profiles[i]._id, "memesvoted", -(profiles[i].memesvoted));
    }
    await message.reply("Voting stats been cleared have been cleared");
    await modprofiles_1.clearmodstats(message);
}
exports.clearstats = clearstats;
async function oldqualifierresultadd(channel, client, msg1, msg2) {
    let m = await channel.messages.fetch(msg1);
    let em = m.embeds[0].fields;
    em.sort(function (a, b) {
        return ((b.name.length) - (a.name.length));
    });
    let m1 = await channel.messages.fetch(msg2);
    let em1 = m1.embeds[0].fields;
    em1.sort(function (a, b) {
        return ((b.name.length) - (a.name.length));
    });
    const fields = [];
    let i = 0;
    while (i < em.length) {
        for (let p = 0; p < em1.length; p++) {
            if (em[i].value.split(" ")[10] === em1[p].value.split(" ")[10]) {
                fields.push({
                    name: `${em1[p].name.substr(0, em1[1].name.indexOf("|") - 1)}`,
                    value: `${parseInt(`${em[i].value.toLowerCase().includes("earned") ? (em[i].value.split(" ")[5].substr(0, 2) + " ") : "0"}`) + parseInt(`${em1[p].value.toLowerCase().includes("earned") ? (em1[p].value.split(" ")[5].substr(0, 2) + " ") : "0"}`)} `,
                });
                i += 1;
            }
        }
    }
    fields.sort(function (a, b) {
        return ((parseInt(b.value)) - (parseInt(a.value)));
    });
    for (let v of fields) {
        v.value += " Points in total";
    }
    channel.send({
        embed: {
            title: `Final Results for ${channel.name}`,
            description: `Top two move on`,
            fields,
            color: "#d7be26",
            timestamp: new Date()
        }
    });
    await (await client.channels.cache.get("722291182461386804"))
        .send({
        embed: {
            title: `Final Results for Group ${channel.name}`,
            description: `Top two move on`,
            fields,
            color: "#d7be26",
            timestamp: new Date()
        }
    });
}
exports.oldqualifierresultadd = oldqualifierresultadd;
async function qualifierresultadd(c, client, msg1, msg2) {
    let m = await c.messages.fetch(msg1);
    let m2 = await c.messages.fetch(msg2);
    let em = m.embeds[0].fields;
    let em2 = m2.embeds[0].fields;
    for (let i = 0; i < em.length; i++) {
        em[i].name = (em[i].value.split(/[^0-9.]+/g))[3];
        em[i].value = (em[i].value.split(/[^0-9.]+/g))[2];
    }
    for (let ii = 0; ii < em.length; ii++) {
        em2[ii].name = (em2[ii].value.split(/[^0-9.]+/g))[3];
        em2[ii].value = (em2[ii].value.split(/[^0-9.]+/g))[2];
    }
    em.sort(function (a, b) {
        return (parseInt(b.name) - parseInt(a.name));
    });
    em2.sort(function (a, b) {
        return (parseInt(b.name) - parseInt(a.name));
    });
    let fields = em;
    const em3 = [];
    for (let y = 0; y < em.length; y++) {
        em3.push({
            name: (await client.users.cache.get(em[y].name)).username,
            value: `${parseInt(em[y].value) + parseInt(em2[y].value)} Points in Total`,
            inline: false
        });
    }
    em3.sort((a, b) => b.value.length - a.value.length);
    fields = em3;
    c.send({
        embed: {
            title: `Final Results for Group ${c.name}`,
            description: `Top two move on`,
            fields,
            color: "#d7be26",
            timestamp: new Date()
        }
    });
    await (await client.channels.cache.get("722291182461386804")).send({
        embed: {
            title: `Final Results for Group ${c.name}`,
            description: `Players with highest move on`,
            fields,
            color: "#d7be26",
            timestamp: new Date()
        }
    });
}
exports.qualifierresultadd = qualifierresultadd;
async function resultadd(channel, client, ids) {
    var _a, _b, _c;
    let msgArr = [];
    for (let i of ids) {
        msgArr.push(await channel.messages.fetch(i));
    }
    let finalResults = [];
    for (let msg of msgArr) {
        let embed = msg.embeds[0];
        for (let f of embed.fields) {
            let key = `${(_a = f.value.match(/\d+/g)) === null || _a === void 0 ? void 0 : _a.splice(1)[1]}`.toString();
            if (!finalResults.find(x => x.name === key)) {
                finalResults.push({
                    name: key,
                    value: parseInt((_b = f.value.match(/\d+/g)) === null || _b === void 0 ? void 0 : _b.splice(1)[0])
                });
            }
            else {
                finalResults[finalResults.findIndex(x => x.name === key)].value += parseInt((_c = f.value.match(/\d+/g)) === null || _c === void 0 ? void 0 : _c.splice(1)[0]);
            }
        }
    }
    finalResults.sort(function (a, b) {
        return b.value - a.value;
    });
    for (let f of finalResults) {
        f.value = `Got ${f.value} in total | UserID:${f.name}`;
        f.name = (await client.users.fetch(f.name)).username;
    }
    return {
        title: `Final Results for Group ${channel.name}`,
        description: `Players with highest move on`,
        fields: finalResults,
        color: "#d7be26",
        timestamp: new Date()
    };
}
exports.resultadd = resultadd;
async function toHHMMSS(timestamp, howlong) {
    return new Date((howlong - (Math.floor(Date.now() / 1000) - timestamp)) * 1000).toISOString().substr(11, 8);
}
exports.toHHMMSS = toHHMMSS;
async function toS(timestamp) {
    if (!timestamp)
        return null;
    var hms = timestamp.split(':');
    return (+hms[0]) * 60 * 60 + (+hms[1]) * 60 + (+hms[2] || 0);
}
exports.toS = toS;
async function SeasonRestart(message, client) {
    await db_1.dbSoftReset();
    await message.reply("Season has been reset");
    await CycleRestart(message, client);
}
exports.SeasonRestart = SeasonRestart;
async function CycleRestart(message, client) {
    if (await (await db_1.getSignups()).open === false) {
        await db_1.deleteSignup();
    }
    await db_1.deleteQuallist();
    await challonge_1.matchlistmaker();
    await clearstats(message);
    await signups_1.startsignup(message, client);
    await message.reply("Season has been reset");
}
exports.CycleRestart = CycleRestart;
async function saveDatatofile(message) {
    let u = await db_1.getAllProfiles("wins");
    let m = await db_1.getAllModProfiles("matchportionsstarted");
    let c = await db_1.getAllCockratings();
    let u2 = {
        "e": u
    };
    let m2 = {
        "e": m
    };
    let c2 = {
        "e": c
    };
    var json = JSON.stringify(u2);
    var json2 = JSON.stringify(m2);
    var json3 = JSON.stringify(c2);
    var fs = require('fs');
    let e = await fs.writeFile('user.json', json, 'utf8', function (err) {
        if (err)
            return console.log(err);
    });
    let e2 = await fs.writeFile('mods.json', json2, 'utf8', function (err) {
        if (err)
            return console.log(err);
    });
    let e3 = await fs.writeFile('cr.json', json3, 'utf8', function (err) {
        if (err)
            return console.log(err);
    });
    const buffer = fs.readFileSync("./user.json");
    const attachment = new Discord.MessageAttachment(buffer, 'u.json');
    const buffer2 = fs.readFileSync("./mods.json");
    const attachment2 = new Discord.MessageAttachment(buffer2, 'm.json');
    const buffer3 = fs.readFileSync("./cr.json");
    const attachment3 = new Discord.MessageAttachment(buffer3, 'c.json');
    await message.channel.send(attachment);
    await message.channel.send(attachment2);
    await message.channel.send(attachment3);
}
exports.saveDatatofile = saveDatatofile;
