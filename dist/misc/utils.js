"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reminders = exports.dateBuilder = exports.indexOf2d = exports.forwardsFilter = exports.backwardsFilter = exports.removethreevotes = exports.hasthreevotes = exports.emojis = exports.getUser = void 0;
const db_1 = require("./db");
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
    for (let channel of catchannels) {
        try {
            if (channel.parent && channel.parent.name === "matches") {
                if (await db_1.getMatch(channel.id)) {
                    let match = await db_1.getMatch(channel.id);
                    if (match.split) {
                        if (!match.p1.memedone && !match.p2.memedone) {
                            await client.channels.cache.get(channel.id)
                                .send(`<@${match.p1.userid}> and <@${match.p2.userid}> you have ${args[0]}h left to complete your match`);
                        }
                        else if (match.p1.memedone) {
                            await client.channels.cache.get(channel.id)
                                .send(`<@${match.p2.userid}> you have ${args[0]}h left to complete your match`);
                        }
                        else if (match.p2.memedone) {
                            await client.channels.cache.get(channel.id)
                                .send(`<@${match.p1.userid}> you have ${args[0]}h left to complete your match`);
                        }
                    }
                }
                else {
                    let all = (await (await client.channels.fetch(channel.id))
                        .messages.fetch({ limit: 100 }));
                    console.log(`The length is: ${all.array().length}`);
                    if (all.array().length === 1) {
                        let m = all.last();
                        await m.channel
                            .send(`<@${m.mentions.users.first().id}> and <@${m.mentions.users.array()[1].id}>, you have ${args[0]}h left to complete your match`);
                    }
                }
            }
        }
        catch {
            continue;
        }
    }
}
exports.reminders = reminders;
