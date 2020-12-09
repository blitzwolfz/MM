"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toS = exports.toHHMMSS = exports.qualifierresultadd = exports.clearstats = exports.createrole = exports.updatesomething = exports.deletechannels = exports.autoreminders = exports.aautoreminders = exports.reminders = exports.dateBuilder = exports.indexOf2d = exports.forwardsFilter = exports.backwardsFilter = exports.removethreevotes = exports.hasthreevotes = exports.emojis = exports.getUser = void 0;
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
exports.backwardsFilter = (reaction, user) => reaction.emoji.name === '⬅' && !user.bot;
exports.forwardsFilter = (reaction, user) => reaction.emoji.name === '➡' && !user.bot;
function indexOf2d(arr, item, searchpos, returnpos) {
    for (let i = 0; i < arr.length; i++) {
        console.log(arr[i][searchpos]);
        console.log(arr[i][returnpos]);
        if (arr[i][searchpos] == item) {
            console.log(arr[i][returnpos]);
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
    console.log(d.getMonth());
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
        console.log(catchannels.length);
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
                    console.log(`The length is: ${all.array().length}`);
                    if (all.array().length === 1) {
                        let m = all.first();
                        await m.channel
                            .send(`<@${m.mentions.users.first().id}> and <@${m.mentions.users.array()[1].id}>, you have ${args[0]}h left to complete your match`);
                    }
                }
            }
            else if (channel.parent && channel.parent.name === "qualifiers") {
                if (await db_1.getQual(channel.id) && !args[2]) {
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
                if (args[2] === "start") {
                    let all = (await (await client.channels.fetch(channel.id))
                        .messages.fetch({ limit: 100 }));
                    console.log(`The length is: ${all.array().length}`);
                    let m = all.last();
                    let s = "";
                    for (let e = 0; e < m.mentions.users.array().length; e++) {
                        s += `<@${m.mentions.users.array()[e].id}> `;
                    }
                    await m.channel
                        .send(`<@${s}>, you have ${args[0]}h left to complete portion ${args[1]}`);
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
async function qualifierresultadd(channel, client, msg1, msg2) {
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
    for (let i = 0; i < em1.length; i++) {
        console.log(`${em[i].value.toLowerCase().includes("earned") ? (em[i].value.split(" ")[5].substr(0, 2) + " ") : "0"}`);
        console.log(`${em1[i].value.toLowerCase().includes("earned") ? (em1[i].value.split(" ")[5].substr(0, 2) + " ") : "0"}`);
        fields.push({
            name: `${em1[i].name.substr(0, em1[1].name.indexOf("|") - 1)}`,
            value: `${parseInt(`${em[i].value.toLowerCase().includes("earned") ? (em[i].value.split(" ")[5].substr(0, 2) + " ") : "0"}`) + parseInt(`${em1[i].value.toLowerCase().includes("earned") ? (em1[i].value.split(" ")[5].substr(0, 2) + " ") : "0"}`)} `,
        });
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
exports.qualifierresultadd = qualifierresultadd;
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
