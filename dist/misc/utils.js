"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.qualifierresultadd = exports.clearstats = exports.createrole = exports.updatesomething = exports.deletechannels = exports.reminders = exports.dateBuilder = exports.indexOf2d = exports.forwardsFilter = exports.backwardsFilter = exports.removethreevotes = exports.hasthreevotes = exports.emojis = exports.getUser = void 0;
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
async function reminders(message, client, args) {
    let catchannels = message.guild.channels.cache.array();
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
                    for (let i = 0; i < match.players.length; i++) {
                        if (!match.playersdone.includes(match.players[i].userid)) {
                            s += `<@${match.players[i].userid}>`;
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
                        s += `<@${m.mentions.users.array()[e].id}>`;
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
    await message.channel.send(`<@${message.author.id}> gets ${pp} good boy points`);
}
exports.reminders = reminders;
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
            name: `${em1[i].name}`,
            value: `${parseInt(`${em[i].value.toLowerCase().includes("earned") ? (em[i].value.split(" ")[5].substr(0, 2) + " ") : "0"}`) + parseInt(`${em1[i].value.toLowerCase().includes("earned") ? (em1[i].value.split(" ")[5].substr(0, 2) + " ") : "0"}`)} `,
        });
    }
    fields.sort(function (a, b) {
        return ((parseInt(b.value)) - (parseInt(a.value)));
    });
    for (let v of fields) {
        v.value += " Points in total";
    }
    channel.send({ embed: {
            title: `Final Results for Group <#${channel.id}>`,
            description: `Top two move on`,
            fields,
            color: "#d7be26",
            timestamp: new Date()
        } });
    await (await client.channels.cache.get("722291182461386804"))
        .send({ embed: {
            title: `Final Results for Group <#${channel.id}>`,
            description: `Top two move on`,
            fields,
            color: "#d7be26",
            timestamp: new Date()
        } });
}
exports.qualifierresultadd = qualifierresultadd;
