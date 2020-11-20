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
exports.deleteExhibitionchannels = exports.exhibition = void 0;
const Discord = __importStar(require("discord.js"));
const db_1 = require("../misc/db");
const randomtemp_1 = require("../misc/randomtemp");
async function exhibition(message, client, args) {
    var _a, _b;
    if (message.mentions.users.array().length === 0) {
        return message.reply("Please mention someone");
    }
    if (args.length < 2) {
        return message.reply("Please use flag theme or template");
    }
    let ex = await db_1.getExhibition();
    if (ex.cooldowns.some(x => x.user === message.author.id)) {
        return message.reply("It hasn't been 3h yet");
    }
    let m = message;
    const filter = (response) => {
        return (("accept").toLowerCase() === response.content.toLowerCase());
    };
    var res;
    console.log(`Value of res is: ${res}`);
    await ((_a = message.mentions.users.first()) === null || _a === void 0 ? void 0 : _a.send("Do you accept this match?").then(async (userdm) => {
        console.log(userdm.channel.id);
        await userdm.channel.awaitMessages(filter, { max: 1, time: 90000, errors: ['time'] })
            .then(async (collected) => {
            await m.channel.send(`${collected.first().author} got the correct answer!`);
            res = true;
        })
            .catch(async (collected) => {
            await m.author.send(`<@${m.author.id}> match has been declined`);
            res = false;
            return;
        });
    }));
    console.log(`Value of res is: ${res}`);
    if (res) {
        await message.channel.send("OK");
        let guild = client.guilds.cache.get("719406444109103117");
        let category = await guild.channels.cache.find(c => c.name == "matches" && c.type == "category");
        await (guild === null || guild === void 0 ? void 0 : guild.channels.create(`${message.author.username}-vs-${(_b = message.mentions.users.first()) === null || _b === void 0 ? void 0 : _b.username}`, { type: 'text', topic: `Exhibition Match`, parent: category.id }).then(async (channel) => {
            await channel.lockPermissions();
            await channel.createOverwrite(message.author.id, { "READ_MESSAGE_HISTORY": true, "SEND_MESSAGES": true });
            await channel.createOverwrite(message.mentions.users.first().id, { "READ_MESSAGE_HISTORY": true, "SEND_MESSAGES": true });
            let newmatch = {
                _id: channel.id,
                channelid: channel.id,
                split: false,
                exhibition: true,
                messageID: "",
                template: "",
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
                newmatch.template = templatelist[Math.floor(Math.random() * (((templatelist.length - 1) - 1) - 1) + 1)];
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
                    .setImage(newmatch.template)
                    .setColor("#d7be26")
                    .setTimestamp());
                await user2.send(new Discord.MessageEmbed()
                    .setTitle("Your template")
                    .setImage(newmatch.template)
                    .setColor("#d7be26")
                    .setTimestamp());
            }
            await user1.send(`Your match has been split.\nYou have 30 mins to complete your portion\nUse \`!submit\` to submit each image seperately`);
            await user2.send(`Your match has been split.\nYou have 30 mins to complete your portion\nUse \`!submit\` to submit each image seperately`);
            ex.activematches.push(channel.id);
            ex.cooldowns.push({
                user: user1.id,
                time: Math.floor(Date.now() / 1000)
            });
            await db_1.updateExhibition(ex);
            await db_1.insertActive(newmatch);
        }));
    }
}
exports.exhibition = exhibition;
async function deleteExhibitionchannels(client) {
    var ex = await db_1.getExhibition();
    for (let ii = 0; ii < ex.activematches.length; ii++) {
        let ch = await client.channels.fetch(ex.activematches[ii]);
        if (!ch) {
            continue;
        }
        if (Math.floor(Date.now() / 1000) - Math.floor(ch.createdTimestamp / 1000) > 7200) {
            await ch.delete();
            ex.activematches.splice(ii, 1);
            ii++;
        }
    }
    for (let i = 0; i < ex.cooldowns.length; i++) {
        let us = await client.users.fetch(ex.cooldowns[i].user);
        if (!ex.cooldowns[i]) {
            continue;
        }
        if (Math.floor(Date.now() / 1000) - Math.floor(ex.cooldowns[i].time) >= 10800) {
            await us.send("You can start another exhibition match!");
            ex.cooldowns.splice(i, 1);
            i++;
        }
    }
    await db_1.updateExhibition(ex);
}
exports.deleteExhibitionchannels = deleteExhibitionchannels;
