"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.duelstats = exports.duelprofilecreate = exports.createDuelProfileatMatch = exports.duelLB = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("./db");
const utils_1 = require("./utils");
async function duelLB(message, client, args) {
    var _a;
    let profiles = await db_1.getAllDuelProfiles(message.guild.id);
    let symbol = "wins";
    let page = typeof args[2] == "undefined" ? isNaN(parseInt(args[1])) ? 1 : parseInt(args[1]) : args[2];
    ;
    switch ((_a = args[1]) === null || _a === void 0 ? void 0 : _a[0]) {
        case "p":
            symbol = "points";
            break;
        case "r":
            symbol = "ratio";
            break;
        case "l":
            symbol = "loss";
            break;
        case "v":
            symbol = "votetally";
            break;
        default: symbol = "wins";
    }
    const m = (await message.channel.send({ embed: await makeProfileEmbed(page, client, profiles, symbol, message.author.id) }));
    await m.react("⬅");
    await m.react("➡");
    const backwards = m.createReactionCollector(utils_1.backwardsFilter, { time: 100000 });
    const forwards = m.createReactionCollector(utils_1.forwardsFilter, { time: 100000 });
    backwards.on('collect', async () => {
        m.reactions.cache.forEach(reaction => reaction.users.remove(message.author.id));
        m.edit({ embed: await makeProfileEmbed(--page, client, profiles, symbol, message.author.id) });
    });
    forwards.on('collect', async () => {
        m.reactions.cache.forEach(reaction => reaction.users.remove(message.author.id));
        m.edit({ embed: await makeProfileEmbed(++page, client, profiles, symbol, message.author.id) });
    });
}
exports.duelLB = duelLB;
async function makeProfileEmbed(page = 1, client, profiles, symbol, userid) {
    page = page < 1 ? 1 : page;
    if (page > profiles.length) {
        page = 0;
    }
    const fields = [];
    let index = (0 + page - 1) * 10;
    if (symbol === "ratio") {
        function ratioCalc(x) {
            return Math.floor(x.wins / (x.wins + x.loss) * 100);
        }
        profiles.sort(function (a, b) {
            return ratioCalc(b) - ratioCalc(a);
        });
    }
    else {
        profiles.sort(function (a, b) {
            return b[symbol] - a[symbol];
        });
    }
    for (let i = index; i < index + 10; i++) {
        let obj = profiles[i];
        try {
            let strr = "";
            if (symbol === "ratio") {
                let mat = Math.floor(obj.wins / (obj.wins + obj.loss) * 100);
                if (obj.wins + obj.loss === 0)
                    mat = 0;
                strr += "Win Ratio: " + `${mat}`;
            }
            else {
                switch (symbol) {
                    case "loss":
                        strr += `Losses: ${obj.loss}`;
                        break;
                    case "votetally":
                        strr += `Total votes recieved: ${obj.votetally}`;
                        break;
                    default:
                        strr += `Wins: ${obj.wins}`;
                }
            }
            fields.push({
                name: `${i + 1}) ${await (await client.users.fetch(profiles[i]._id)).username}`,
                value: strr,
            });
        }
        catch {
            continue;
        }
    }
    let strrr = "";
    switch (symbol) {
        case "ratio":
            strrr += `Win rate.`;
            break;
        case "loss":
            strrr += `Losses.`;
            break;
        case "votetally":
            strrr += `Total Votes Recieved.`;
            break;
        default:
            strrr += `Wins.`;
    }
    return {
        title: `Leaderboard sorted by ${strrr} You are on page ${page || 1} of ${Math.floor(profiles.length / 10) + 1}`,
        description: `Your rank is: ${profiles.findIndex(item => item._id == userid) + 1}`,
        fields,
        color: "#d7be26",
        timestamp: new Date()
    };
}
async function createDuelProfileatMatch(userId, guildid) {
    if (await db_1.getDuelProfile(userId, guildid)) {
        return;
    }
    else {
        await db_1.addDuelProfile({
            _id: userId,
            votetally: 0,
            points: 0,
            wins: 0,
            loss: 0,
        }, guildid);
    }
}
exports.createDuelProfileatMatch = createDuelProfileatMatch;
async function duelprofilecreate(message, client, args) {
    let imgurl = args[1] ? (client.users.cache.get(message.mentions.users.first().id).displayAvatarURL()) : message.author.displayAvatarURL();
    if (await db_1.getDuelProfile(message.author.id, message.guild.id)) {
        return message.reply("That user profile does exist! Please do `!duel stats` to check the user profile");
    }
    else {
        await db_1.addDuelProfile({
            _id: message.author.id,
            votetally: 0,
            points: 0,
            wins: 0,
            loss: 0,
        }, message.guild.id);
        await message.channel.send(new discord_js_1.MessageEmbed()
            .setTitle(`Duelist: ${message.author.username}`)
            .setColor("RANDOM")
            .setThumbnail(`${imgurl}`)
            .addFields({ name: 'Total points', value: `${0}` }, { name: 'Total wins', value: `${0}` }, { name: 'Total loss', value: `${0}` }, { name: 'Total matches', value: `${0}` }, { name: 'Win Rate', value: `${0}%` }));
    }
}
exports.duelprofilecreate = duelprofilecreate;
async function duelstats(message, client, args) {
    let user = await db_1.getDuelProfile((args[1] ? (message.mentions.users.first().id) : message.author.id), message.guild.id);
    let imgurl = args[1] ? (client.users.cache.get(message.mentions.users.first().id).displayAvatarURL()) : message.author.displayAvatarURL();
    let name = args[1] ? (client.users.cache.get(message.mentions.users.first().id).username) : message.author.username;
    if (!user) {
        return message.reply("That user profile does not exist! Please do `!duel create` to create your own user profile");
    }
    else if (user) {
        let wr = Math.floor(user.wins / (user.wins + user.loss) * 100);
        if (user.loss + user.wins === 0)
            wr = 0;
        let UserEmbed = new discord_js_1.MessageEmbed()
            .setTitle(`Duelist: ${name}`)
            .setThumbnail(imgurl)
            .setColor("RANDOM")
            .addFields({ name: 'Total Points', value: `${user.points}` }, { name: 'Total Wins', value: `${user.wins}` }, { name: 'Total Loss', value: `${user.loss}` }, { name: 'Total Matches', value: `${user.wins + user.loss}` }, { name: 'Win Rate', value: `${wr}%` });
        await message.channel.send(UserEmbed);
    }
}
exports.duelstats = duelstats;
