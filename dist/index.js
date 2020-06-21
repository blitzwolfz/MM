"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
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
console.log("Hello World, bot has begun life");
let matches;
let qualmatches;
const express = require('express');
const app = express();
app.use(express.static('public'));
const http = require('http');
var _server = http.createServer(app);
const client = new Discord.Client();
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
    console.log(`Logged in as ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag}`);
    console.log("OK");
    await db_1.connectToDB();
    matches = await db_1.getActive();
    qualmatches = await db_1.getQuals();
    await start_1.running(matches, client);
});
client.on("messageReactionAdd", async function (messageReaction, user) {
    var _a;
    console.log(`a reaction is added to a message`);
    if (user.bot)
        return;
    if (matches) {
        for (const match of matches) {
            console.log(match.p1.voters);
            console.log(match.p2.voters);
            if (user.id === match.p1.userid || user.id === match.p2.userid) {
                if (messageReaction.emoji.name === "🅱️" || messageReaction.emoji.name === "🅰️") {
                    await messageReaction.remove(user.id);
                    return await user.send("Can't vote on your own match");
                }
            }
            let id = (_a = client.channels.get(messageReaction.message.channel.id)) === null || _a === void 0 ? void 0 : _a.id;
            if (match.channelid === id) {
                if (!match.p1.voters.includes(user.id) && !match.p2.voters.includes(user.id)) {
                    if (messageReaction.emoji.name === "🅱️") {
                        match.p2.votes += 1;
                        match.p2.voters.push(user.id);
                        await user.send("Vote counted for meme B");
                        await messageReaction.remove(user.id);
                        await messageReaction.message.react("🅱️");
                    }
                    else if (messageReaction.emoji.name === "🅰️") {
                        match.p1.votes += 1;
                        match.p1.voters.push(user.id);
                        await user.send("Vote counted for meme A");
                        await messageReaction.remove(user.id);
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
                        await messageReaction.remove(user.id);
                        await messageReaction.message.react("🅱️");
                    }
                    else if (messageReaction.emoji.name === "🅰️") {
                        await user.send("You can't vote on the same meme twice");
                        await messageReaction.remove(user.id);
                        await messageReaction.message.react("🅱️");
                    }
                }
                else if (match.p2.voters.includes(user.id)) {
                    if (messageReaction.emoji.name === "🅱️") {
                        await user.send("You can't vote on the same meme twice");
                        await messageReaction.remove(user.id);
                        await messageReaction.message.react("🅱️");
                    }
                    else if (messageReaction.emoji.name === "🅰️") {
                        match.p1.votes += 1;
                        match.p1.voters.push(user.id);
                        await user.send("Vote counted for meme A");
                        match.p2.votes -= 1;
                        match.p2.voters.splice(match.p1.voters.indexOf(user.id), 1);
                        await messageReaction.remove(user.id);
                        await messageReaction.message.react("🅰️");
                    }
                }
                console.log(match.p1.voters);
                console.log(match.p2.voters);
            }
            await db_1.updateActive(match);
        }
    }
});
client.on("message", async (message) => {
    var _a;
    if (message.author.bot) {
        return;
    }
    const prefix = process.env.PREFIX;
    console.log(matches);
    console.log(qualmatches);
    if (message.content.indexOf(prefix) !== 0 || message.author.bot && message.author.id !== "688558229646475344") {
        return;
    }
    await start_1.running(matches, client);
    await start_1.qualrunning(qualmatches, client);
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
        await m.edit(`Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
    }
    else if (command === "submit") {
        await submit_1.submit(message, matches, client);
        if (!matches)
            await start_1.running(matches, client);
    }
    else if (command === "qualsubmit") {
        await submit_1.qualsubmit(message, qualmatches, client);
    }
    else if (command === "submittemplate" || command === "template") {
        await template_1.template(message, client);
    }
    else if (command === "start") {
        if (!message.member.roles.has('719936221572235295'))
            return message.reply("You don't have those premissions");
        await start_1.start(message, client);
    }
    else if (command === "startqual") {
        await start_1.startqual(message, client);
    }
    else if (command === "startmodqual") {
        await start_1.startmodqual(message);
    }
    else if (command === "startsplit") {
        await start_1.splitqual(qualmatches, client, message);
    }
    else if (command === "qualend") {
        if (!message.member.roles.has('719936221572235295'))
            return message.reply("You don't have those premissions");
        await winner_1.qualend(qualmatches, client, message);
    }
    else if (command === "end") {
        if (!message.member.roles.has('719936221572235295'))
            return message.reply("You don't have those premissions");
        await winner_1.endmatch(message, matches, client);
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
    matches = await db_1.getActive();
    qualmatches = await db_1.getQuals();
});
client.login(process.env.TOKEN);
