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
exports.cooldownremove = exports.duelcheck = exports.deleteExhibitionchannels = exports.exhibition = void 0;
const Discord = __importStar(require("discord.js"));
const db_1 = require("../misc/db");
const duellb_1 = require("../misc/duellb");
const randomtemp_1 = require("../misc/randomtemp");
const utils_1 = require("../misc/utils");
async function exhibition(message, client, args) {
    var _a, _b, _c;
    if (!message.mentions.users.array()) {
        return message.reply("Please mention someone");
    }
    else if (((_a = message.mentions.users.first()) === null || _a === void 0 ? void 0 : _a.id) === message.author.id) {
        return message.reply("No boni");
    }
    if (args.length < 2) {
        return message.reply("Please use flag theme flag or template flag");
    }
    if (args.length >= 3) {
        return message.reply("No too many arguments. Use either theme flag or template flag");
    }
    else if (!["template", "theme"].includes(args[1].toLowerCase())) {
        return message.reply("Please use theme flag  or template flag");
    }
    let ex = await db_1.getExhibition();
    if (ex.cooldowns.some(x => x.user === message.author.id)) {
        return message.reply("It hasn't been 1h yet");
    }
    let m = message;
    const filter = (response) => {
        return (("accept").toLowerCase() === response.content.toLowerCase());
    };
    var res;
    let id2 = message.mentions.users.first();
    ex.cooldowns.push({
        user: id2.id,
        time: Math.floor(Date.now() / 1000)
    });
    ex.cooldowns.push({
        user: m.author.id,
        time: Math.floor(Date.now() / 1000)
    });
    await db_1.updateExhibition(ex);
    ex = await db_1.getExhibition();
    await ((_b = message.mentions.users.first()) === null || _b === void 0 ? void 0 : _b.send(`<@${m.author.id}> wants to duel you. Send Accept to continue, or don't reply to not`).then(async (userdm) => {
        await userdm.channel.awaitMessages(filter, { max: 1, time: 90000, errors: ['time'] })
            .then(async (collected) => {
            await m.channel.send(`${collected.first().author} accepted, <@${m.author.id}>!`);
            res = true;
        })
            .catch(async (collected) => {
            await m.author.send(`<@${m.author.id}> match has been declined`);
            res = false;
            ex.cooldowns.splice(ex.cooldowns.findIndex(x => x.user === id2.id), 1);
            ex.cooldowns.splice(ex.cooldowns.findIndex(x => x.user === m.author.id), 1);
            await db_1.updateExhibition(ex);
            return;
        });
    }));
    if (res) {
        await db_1.updateExhibition(ex);
        ex = await db_1.getExhibition();
        let guild = client.guilds.cache.get(message.guild.id);
        let category = await guild.channels.cache.find(c => c.name.toLowerCase() == "duels" && c.type == "category");
        await (guild === null || guild === void 0 ? void 0 : guild.channels.create(`${message.author.username}-vs-${(_c = message.mentions.users.first()) === null || _c === void 0 ? void 0 : _c.username}`, { type: 'text', topic: `Exhibition Match`, parent: category.id }).then(async (channel) => {
            try {
                await channel.lockPermissions();
            }
            catch (error) {
                console.log(error);
                console.log("Can't lock channel");
            }
            let newmatch = {
                _id: channel.id,
                channelid: channel.id,
                split: false,
                exhibition: true,
                messageID: "",
                template: [],
                theme: "",
                tempfound: false,
                p1: {
                    userid: message.author.id,
                    memedone: false,
                    donesplit: false,
                    time: Math.floor(Date.now() / 1000),
                    memelink: "",
                    votes: 0,
                    voters: [],
                    halfreminder: false,
                    fivereminder: false,
                },
                p2: {
                    userid: message.mentions.users.first().id,
                    memedone: false,
                    donesplit: false,
                    time: Math.floor(Date.now() / 1000),
                    memelink: "",
                    votes: 0,
                    voters: [],
                    halfreminder: false,
                    fivereminder: false,
                },
                votetime: Math.floor(Date.now() / 1000),
                votingperiod: false,
            };
            let user1 = message.author;
            let user2 = message.mentions.users.first();
            if (args[1] === "template") {
                let templatelist = await randomtemp_1.getRandomTemplateList(client);
                newmatch.template.push(templatelist[Math.floor(Math.random() * (((templatelist.length - 1) - 1) - 1) + 1)]);
            }
            if (args[1] === "theme") {
                let templatelist = await randomtemp_1.getRandomThemeList(client);
                newmatch.theme = templatelist[Math.floor(Math.random() * (((templatelist.length - 1) - 1) - 1) + 1)];
            }
            let embed = new Discord.MessageEmbed()
                .setTitle(`Match between ${user1.username ? user1.username : (await message.guild.members.fetch(user1.id)).nickname} and ${user2.username ? user2.username : (await message.guild.members.fetch(user2.id)).nickname}`)
                .setColor("#d7be26")
                .setDescription(`<@${user1.id}> and <@${user2.id}> both have 30 mins to complete your memes.\n Contact admins if you have an issue.`)
                .setTimestamp();
            channel.send({ embed });
            if (args[1] === "theme") {
                await user1.send(`Your theme is: ${newmatch.theme}`);
                await user2.send(`Your theme is: ${newmatch.theme}`);
            }
            else {
                await user1.send(new Discord.MessageEmbed()
                    .setTitle("Your template")
                    .setImage(newmatch.template[0])
                    .setColor("#d7be26")
                    .setTimestamp());
                await user2.send(new Discord.MessageEmbed()
                    .setTitle("Your template")
                    .setImage(newmatch.template[0])
                    .setColor("#d7be26")
                    .setTimestamp());
            }
            ex.activematches.push(channel.id);
            await db_1.updateExhibition(ex);
            await user1.send(`You have 30 mins to complete your meme\nUse \`!submit\` to submit each image`);
            await user2.send(`You have 30 mins to complete your meme\nUse \`!submit\` to submit each image`);
            await user1.send(`Image link if embed doesn't show:\`${newmatch.template[0]}\``);
            await user2.send(`Image link if embed doesn't show:\`${newmatch.template[0]}\``);
            await db_1.insertActive(newmatch);
            await duellb_1.createDuelProfileatMatch(user1.id, guild.id);
            await duellb_1.createDuelProfileatMatch(user2.id, guild.id);
        }));
    }
}
exports.exhibition = exhibition;
async function deleteExhibitionchannels(client) {
    var _a;
    var ex = await db_1.getExhibition();
    let guild = await client.guilds.cache.get("719406444109103117");
    for (let ii = 0; ii < ex.activematches.length; ii++) {
        if (!(guild === null || guild === void 0 ? void 0 : guild.channels.cache.has(ex.activematches[ii]))) {
            ex.activematches.splice(ii, 1);
            ii++;
            continue;
        }
        let ch = await ((_a = client.channels) === null || _a === void 0 ? void 0 : _a.fetch(ex.activematches[ii]));
        if (Math.floor(Date.now() / 1000) - Math.floor(ch.createdTimestamp / 1000) > 7200) {
            await ch.delete();
            ex.activematches.splice(ii, 1);
            ii++;
        }
        if (!ch || ch === undefined) {
            ex.activematches.splice(ii, 1);
            ii++;
        }
    }
    for (let i = 0; i < ex.cooldowns.length; i++) {
        let us = await client.users.fetch(ex.cooldowns[i].user);
        if (!ex.cooldowns[i]) {
            continue;
        }
        if (Math.floor(Date.now() / 1000) - Math.floor(ex.cooldowns[i].time) >= 3600) {
            try {
                await us.send("You can start another exhibition match!");
            }
            catch {
                console.log("Could not dm user that cooldown is over");
            }
            ex.cooldowns.splice(i, 1);
            i++;
        }
    }
    await db_1.updateExhibition(ex);
}
exports.deleteExhibitionchannels = deleteExhibitionchannels;
async function duelcheck(message) {
    let ex = await db_1.getExhibition();
    if (!ex.cooldowns.some(x => x.user === message.author.id)) {
        return message.reply("You can start another duel.");
    }
    else if (ex.cooldowns.some(x => x.user === message.author.id)) {
        let i = ex.cooldowns.findIndex(x => x.user === message.author.id);
        await message.reply(`Time till you can start another duel: ${await utils_1.toHHMMSS(ex.cooldowns[i].time, 1800)}`);
    }
}
exports.duelcheck = duelcheck;
async function cooldownremove(message) {
    let ex = await db_1.getExhibition();
    for (let x of message.mentions.users.array()) {
        ex.cooldowns.splice(ex.cooldowns.findIndex(c => c.user === x.id));
        await db_1.updateExhibition(ex);
        await message.channel.send(`<@${x.id}> has been reset`);
    }
}
exports.cooldownremove = cooldownremove;
