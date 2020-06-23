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
const Discord = __importStar(require("discord.js"));
require("dotenv").config();
const submit_1 = require("./commands/submit");
const start_1 = require("./commands/start");
const winner_1 = require("./commands/winner");
const card_1 = require("./commands/card");
const utils_1 = require("./misc/utils");
const help_1 = require("./commands/help");
const db_1 = require("./misc/db");
const template_1 = require("./commands/template");
const user_1 = require("./commands/user");
console.log("Hello World, bot has begun life");
const express = require('express');
const app = express();
app.use(express.static('public'));
const http = require('http');
var _server = http.createServer(app);
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
app.get('/', (_request, response) => {
    response.sendFile(__dirname + "/index.html");
    console.log(Date.now() + " Ping Received");
    response.sendStatus(200);
});
const listener = app.listen(process.env.PORT, () => {
    console.log('Your app is listening on port ' + listener.address().port);
});
client.on('ready', async () => {
    var _a;
    client.user.setActivity(`Warming up`);
    console.log(`Logged in as ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag}`);
    console.log("OK");
    await db_1.connectToDB();
    let matches = await db_1.getActive();
    if (matches) {
        for (const match of matches) {
            if (match.votingperiod) {
                let channel = client.channels.cache.get(match.channelid);
                channel.messages.fetch(match.messageID).then(async (msg) => {
                    if (msg.partial) {
                        await msg.fetch();
                    }
                });
            }
        }
    }
    await start_1.running(client);
    await start_1.qualrunning(client);
    client.user.setActivity(`We da best in the game`);
});
client.on("messageReactionAdd", async function (messageReaction, user) {
    var _a;
    console.log(`a reaction is added to a message`);
    if (user.bot)
        return;
    let matches = await db_1.getActive();
    let quals = await db_1.getQuals();
    if (matches) {
        for (const match of matches) {
            console.log(match.p1.voters);
            console.log(match.p2.voters);
            if (messageReaction.partial)
                await messageReaction.fetch();
            if (messageReaction.message.partial)
                await messageReaction.message.fetch();
            if (user.id === match.p1.userid || user.id === match.p2.userid) {
                if (messageReaction.emoji.name === "🅱️") {
                    await messageReaction.users.remove(user.id);
                    return await user.send("Can't vote on your own match");
                }
                if (messageReaction.emoji.name === "🅰️") {
                    await messageReaction.message.react("🅰️");
                    await messageReaction.users.remove(user.id);
                    return await user.send("Can't vote on your own match");
                }
            }
            let id = (_a = client.channels.cache.get(messageReaction.message.channel.id)) === null || _a === void 0 ? void 0 : _a.id;
            if (match.channelid === id) {
                if (!match.p1.voters.includes(user.id) && !match.p2.voters.includes(user.id)) {
                    if (messageReaction.emoji.name === "🅱️") {
                        match.p2.votes += 1;
                        match.p2.voters.push(user.id);
                        await user.send("Vote counted for meme B");
                        await messageReaction.users.remove(user.id);
                        await messageReaction.message.react("🅱️");
                    }
                    else if (messageReaction.emoji.name === "🅰️") {
                        match.p1.votes += 1;
                        match.p1.voters.push(user.id);
                        await user.send("Vote counted for meme A");
                        await messageReaction.users.remove(user.id);
                        await messageReaction.message.react("🅱️");
                    }
                }
                else if (match.p1.voters.includes(user.id)) {
                    if (messageReaction.emoji.name === "🅱️") {
                        match.p2.votes += 1;
                        match.p2.voters.push(user.id);
                        await user.send("Vote counted for meme B");
                        match.p1.votes -= 1;
                        match.p1.voters.splice(match.p1.voters.indexOf(user.id), 1);
                        await messageReaction.users.remove(user.id);
                        await messageReaction.message.react("🅱️");
                    }
                    else if (messageReaction.emoji.name === "🅰️") {
                        await user.send("You can't vote on the same meme twice");
                        await messageReaction.users.remove(user.id);
                        await messageReaction.message.react("🅱️");
                    }
                }
                else if (match.p2.voters.includes(user.id)) {
                    if (messageReaction.emoji.name === "🅱️") {
                        await user.send("You can't vote on the same meme twice");
                        await messageReaction.users.remove(user.id);
                        await messageReaction.message.react("🅱️");
                    }
                    else if (messageReaction.emoji.name === "🅰️") {
                        match.p1.votes += 1;
                        match.p1.voters.push(user.id);
                        await user.send("Vote counted for meme A");
                        match.p2.votes -= 1;
                        match.p2.voters.splice(match.p1.voters.indexOf(user.id), 1);
                        await messageReaction.users.remove(user.id);
                        await messageReaction.message.react("🅰️");
                    }
                }
                console.log(match.p1.voters);
                console.log(match.p2.voters);
            }
            await db_1.updateActive(match);
        }
    }
    if (quals) {
        for (const match of quals) {
            utils_1.hasthreevotes(match.votes, user.id);
            if (messageReaction.partial)
                await messageReaction.fetch();
            if (messageReaction.message.partial)
                await messageReaction.message.fetch();
            if (utils_1.emojis.includes(messageReaction.emoji.name)) {
                let i = utils_1.emojis.indexOf(messageReaction.emoji.name);
                console.log(messageReaction.emoji.name, utils_1.emojis[6]);
                if (messageReaction.emoji.name === utils_1.emojis[6]) {
                    match.votes = utils_1.removethreevotes(match.votes, user.id);
                    await db_1.updateQuals(match);
                    await messageReaction.users.remove(user.id);
                    return user.send("Your votes have been reset");
                }
                if (!match.playersdone.includes(match.playerids[i])) {
                    await messageReaction.users.remove(user.id);
                    return user.send("You can't for a non meme");
                }
                else if (match.votes[i].includes(user.id)) {
                    await messageReaction.users.remove(user.id);
                    return user.send("You can't for a meme twice. Hit the recycle emote to reset your votes");
                }
                else {
                    match.votes[i].push(user.id);
                    await messageReaction.users.remove(user.id);
                    await db_1.updateQuals(match);
                    return user.send("You vote has been counted.");
                }
            }
        }
    }
});
client.on("message", async (message) => {
    var _a;
    const prefix = process.env.PREFIX;
    console.log(await db_1.getActive());
    console.log(await db_1.getQuals());
    if (message.content.indexOf(prefix) !== 0 || message.author.bot) {
        if (message.author.id !== "688558229646475344")
            return;
    }
    await start_1.running(client);
    await start_1.qualrunning(client);
    var args = message.content.slice(prefix.length).trim().split(/ +/g);
    if (!args || args.length === 0) {
        return;
    }
    ;
    const command = (_a = args === null || args === void 0 ? void 0 : args.shift()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    if (!command) {
        return;
    }
    ;
    if (command === "ping") {
        const m = await message.channel.send("Ping?");
        await m.edit(`Latency is ${m.createdTimestamp - message.createdTimestamp}ms. Discord API Latency is ${Math.round(client.ws.ping)}ms`);
    }
    else if (command === "submit") {
        await submit_1.submit(message, client);
    }
    else if (command === "qualsubmit") {
        await submit_1.qualsubmit(message, client);
    }
    else if (command === "submittemplate" || command === "template") {
        await template_1.template(message, client);
    }
    else if (command === "start") {
        if (!message.member.roles.cache.has('719936221572235295'))
            return message.reply("You don't have those premissions");
        await start_1.start(message, client);
    }
    else if (command === "startqual") {
        if (!message.member.roles.cache.has('719936221572235295'))
            return message.reply("You don't have those premissions");
        await start_1.startqual(message, client);
    }
    else if (command === "startmodqual" || command === "splitqual") {
        if (!message.member.roles.cache.has('719936221572235295'))
            return message.reply("You don't have those premissions");
        await start_1.startmodqual(message, client);
    }
    else if (command === "startmodmatch" || command === "splitmatch") {
        if (!message.member.roles.cache.has('719936221572235295'))
            return message.reply("You don't have those premissions");
        await start_1.startregularsplit(message, client);
    }
    else if (command === "approve") {
        if (!message.member.roles.cache.has('719936221572235295'))
            return message.reply("You don't have those premissions");
        await template_1.approvetemplate(message, client);
    }
    else if (command === "create") {
        await user_1.createrUser(message);
    }
    else if (command === "stats") {
        await user_1.stats(message, client);
    }
    else if (command === "startsplitqual") {
        if (!message.member.roles.cache.has('719936221572235295'))
            return message.reply("You don't have those premissions");
        await start_1.splitqual(client, message);
    }
    else if (command === "startsplit") {
        if (!message.member.roles.cache.has('719936221572235295'))
            return message.reply("You don't have those premissions");
        await start_1.splitregular(message, client);
    }
    else if (command === "qualend") {
        if (!message.member.roles.cache.has('719936221572235295'))
            return message.reply("You don't have those premissions");
        await winner_1.qualend(client, message.channel.id);
    }
    else if (command === "end") {
        if (!message.member.roles.cache.has('719936221572235295'))
            return message.reply("You don't have those premissions");
        await winner_1.endmatch(message, client);
    }
    else if (command === "modhelp") {
        await message.channel.send({ embed: help_1.ModHelp });
    }
    else if (command === "help") {
        await message.channel.send({ embed: help_1.UserHelp });
    }
    else if (command === "vs") {
        let users = [];
        for (let i = 0; i < args.length; i++) {
            let userid = await utils_1.getUser(args[i]);
            if (userid) {
                users.push(userid);
            }
        }
        await card_1.vs(message, client, users);
    }
});
client.login(process.env.TOKEN);
