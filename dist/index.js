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
const signups_1 = require("./commands/signups");
const challonge_1 = require("./commands/challonge");
const verify_1 = require("./misc/verify");
const lbs_1 = require("./misc/lbs");
const modprofiles_1 = require("./misc/modprofiles");
const randomtemp_1 = require("./misc/randomtemp");
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
    await db_1.connectToDB();
    client.user.setActivity(`Warming up`);
    console.log(`Logged in as ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag}`);
    console.log("OK");
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
    await client.channels.cache.get("722616679280148504").send("<@239516219445608449>", {
        embed: {
            description: `Updates/Restart has worked`,
            color: "#d7be26",
            timestamp: new Date()
        }
    });
    client.user.setActivity(`${process.env.STATUS}`);
});
client.on("guildMemberAdd", async function (member) {
    var _a, _b;
    await member.roles.add("730650583413030953");
    await ((_a = member.user) === null || _a === void 0 ? void 0 : _a.send("Please start verification with `!verify <reddit username>` in the verification channel."));
    console.log(`a user joins a guild: ${(_b = member.user) === null || _b === void 0 ? void 0 : _b.username}`);
});
client.on("messageReactionAdd", async function (messageReaction, user) {
    if (user.bot)
        return;
    if (messageReaction.emoji.name === '🅰️' || messageReaction.emoji.name === '🅱️' && user.id !== "722303830368190485") {
        if (messageReaction.partial)
            await messageReaction.fetch();
        if (messageReaction.message.partial)
            await messageReaction.message.fetch();
        if (user.client.guilds.cache
            .get(messageReaction.message.guild.id)
            .members.cache.get(user.id)
            .roles.cache.has("719936221572235295")
            === true) {
            if (messageReaction.emoji.name === '🅰️') {
                let id = await (await db_1.getMatch(messageReaction.message.channel.id)).p1.userid;
                await start_1.splitregular(messageReaction.message, client, id);
                await db_1.updateModProfile(messageReaction.message.author.id, "modactions", 1);
                await db_1.updateModProfile(messageReaction.message.author.id, "matchportionsstarted", 1);
                await messageReaction.users.remove(user.id);
            }
            else if (messageReaction.emoji.name === '🅱️') {
                let id = await (await db_1.getMatch(messageReaction.message.channel.id)).p2.userid;
                await start_1.splitregular(messageReaction.message, client, id);
                await db_1.updateModProfile(messageReaction.message.author.id, "modactions", 1);
                await db_1.updateModProfile(messageReaction.message.author.id, "matchportionsstarted", 1);
                await messageReaction.users.remove(user.id);
            }
        }
        else {
            await messageReaction.users.remove(user.id);
            await user.send("No.");
        }
    }
    if (!utils_1.emojis.includes(messageReaction.emoji.name))
        return;
    console.log(`a reaction is added to a message`);
    let temps = await db_1.getalltempStructs();
    if ((messageReaction.emoji.name === utils_1.emojis[1] || messageReaction.emoji.name === utils_1.emojis[0])
        && await db_1.getMatch(messageReaction.message.channel.id)) {
        let match = await db_1.getMatch(messageReaction.message.channel.id);
        if (messageReaction.partial)
            await messageReaction.fetch();
        if (messageReaction.message.partial)
            await messageReaction.message.fetch();
        if (!match)
            return;
        if (user.id !== match.p1.userid && user.id !== match.p2.userid) {
            if (messageReaction.emoji.name === utils_1.emojis[0]) {
                if (match.p1.voters.includes(user.id)) {
                    await user.send("You can't vote on the same meme twice");
                    await messageReaction.users.remove(user.id);
                    await messageReaction.message.react(utils_1.emojis[0]);
                }
                else {
                    match.p1.votes += 1;
                    match.p1.voters.push(user.id);
                    if (match.p2.voters.includes(user.id)) {
                        match.p2.votes -= 1;
                        match.p2.voters.splice(match.p2.voters.indexOf(user.id), 1);
                    }
                    await messageReaction.users.remove(user.id);
                    await messageReaction.message.react(utils_1.emojis[0]);
                    await user.send(`Vote counted for Player 1's memes in <#${match.channelid}>. You gained 2 points for voting`);
                }
            }
            else if (messageReaction.emoji.name === utils_1.emojis[1]) {
                if (match.p2.voters.includes(user.id)) {
                    await user.send("You can't vote on the same meme twice");
                    await messageReaction.users.remove(user.id);
                    await messageReaction.message.react(utils_1.emojis[1]);
                }
                else {
                    match.p2.votes += 1;
                    match.p2.voters.push(user.id);
                    await user.send(`Vote counted for Player 2's memes in <#${match.channelid}>. You gained 2 points for voting`);
                    if (match.p1.voters.includes(user.id)) {
                        match.p1.votes -= 1;
                        match.p1.voters.splice(match.p1.voters.indexOf(user.id), 1);
                    }
                    await messageReaction.users.remove(user.id);
                    await messageReaction.message.react(utils_1.emojis[1]);
                }
            }
            await db_1.updateActive(match);
        }
        else {
            await messageReaction.users.remove(user.id);
            await user.send("Can't vote on your own match");
        }
    }
    if (utils_1.emojis.includes(messageReaction.emoji.name) && await db_1.getQual(messageReaction.message.channel.id)) {
        let match = await db_1.getQual(messageReaction.message.channel.id);
        if (!match)
            return;
        if (messageReaction.partial)
            await messageReaction.fetch();
        if (messageReaction.message.partial)
            await messageReaction.message.fetch();
        if (match.votingperiod === false)
            return;
        if (match.playerids.includes(user.id)) {
            await messageReaction.users.remove(user.id);
            return user.send("You can't vote in your own qualifers");
        }
        if (messageReaction.emoji.name === utils_1.emojis[6]) {
            match.votes = utils_1.removethreevotes(match.votes, user.id);
            await db_1.updateQuals(match);
            messageReaction.users.remove(user.id);
            return user.send("Your votes have been reset");
        }
        else {
            let i = utils_1.emojis.indexOf(messageReaction.emoji.name);
            if (utils_1.hasthreevotes(match.votes, user.id)) {
                await messageReaction.users.remove(user.id);
                return user.send("You used up all your votes. Please hit the recycle emote to reset your votes");
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
                return user.send(`Your vote for meme ${i + 1} in <#${match.channelid}> been counted. You gained 2 points for voting`);
            }
        }
    }
    if (temps) {
        for (const temp of temps) {
            console.log(temp);
            let templatelist = await randomtemp_1.getRandomTemplateList(client);
            if (messageReaction.emoji.name === '🌀' && user.id !== "722303830368190485") {
                let random = templatelist[Math.floor(Math.random() * (((templatelist.length - 1) - 1) - 1) + 1)];
                let embed = new Discord.MessageEmbed()
                    .setDescription("Random template")
                    .setImage(random)
                    .setColor("#d7be26")
                    .setTimestamp();
                console.log(await messageReaction.message.id);
                temp.url = random;
                await (await client.channels.cache.get("722616679280148504")
                    .messages.fetch(temp.messageid))
                    .edit({ embed });
                await db_1.updatetempStruct(temp._id, temp);
                await messageReaction.users.remove(user.id);
            }
            if (messageReaction.emoji.name === utils_1.emojis[7] && user.id !== "722303830368190485") {
                temp.found = true;
                await db_1.updatetempStruct(temp._id, temp);
                await messageReaction.message.delete();
            }
            else if (messageReaction.emoji.name === '❌' && user.id !== "722303830368190485") {
                temp.time = 121;
                await db_1.updatetempStruct(temp._id, temp);
            }
        }
    }
});
client.on("message", async (message) => {
    var _a, _b, _c, _d, _e, _f, _g;
    if (message.content.indexOf(process.env.PREFIX) !== 0 || message.author.bot) {
        if (message.author.id !== "688558229646475344")
            return;
    }
    var args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
    if (!args || args.length === 0) {
        return;
    }
    ;
    const command = (_a = args === null || args === void 0 ? void 0 : args.shift()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    if (!command) {
        return;
    }
    ;
    if (command === "s") {
        await start_1.qualrunning(client);
        await start_1.running(client);
    }
    if (command === "forcepoll") {
        let match = await db_1.getMatch(message.channel.id);
        if (Math.floor(Math.random() * (5 - 1) + 1) % 2 === 1) {
            let temp = match.p1;
            match.p1 = match.p2;
            match.p2 = temp;
        }
        match.p1.time = (Math.floor(Date.now() / 1000)) - 3600;
        match.p2.time = (Math.floor(Date.now() / 1000)) - 3600;
        match.votingperiod = true;
        match.votetime = (Math.floor(Date.now() / 1000));
        await db_1.updateActive(match);
        await start_1.reload(message, client);
    }
    else if (command === "ping") {
        const m = await message.channel.send("Ping?");
        await m.edit(`Latency is ${m.createdTimestamp - message.createdTimestamp}ms. Discord API Latency is ${Math.round(client.ws.ping)}ms`);
    }
    else if (command === "say") {
        const sayMessage = args.join(" ");
        if (sayMessage.match(/@everyone/) && !message.member.permissions.has(['MANAGE_MESSAGES'])) {
            await message.channel.send(`-mute <@${message.author.id}>`);
            return message.reply("YOU DARE PING EVERYONE!");
        }
        message.delete().catch(console.log);
        message.channel.send(sayMessage);
    }
    else if (command === "purge" || command === "clear") {
        if (!message.member.permissions.has(['MANAGE_MESSAGES'], true)) {
            return message.reply("you don't have those premissions");
        }
        console.log(args);
        const amount = parseInt(args[0]);
        const user = message.mentions.users.first();
        if (!amount || amount < 1 || amount > 100)
            return message.reply("Please give a number between 1 to 100");
        await message.channel.messages.fetch({
            limit: amount
        })
            .then(async (messages) => {
            if (user) {
                const filterBy = user;
                let deletemessages = messages.filter(m => m.author.id === filterBy.id).array().slice(0, amount);
                await message.channel.bulkDelete(deletemessages).catch(error => console.log(error.stack));
            }
            else {
                await message.channel.bulkDelete(messages).catch(error => console.log(error.stack));
            }
        });
    }
    else if (command === "reminder") {
        await utils_1.reminders(message, client, args);
    }
    else if (command === "createrole") {
        if (!message.member.roles.cache.has('719936221572235295'))
            return message.reply("You don't have those premissions");
        await utils_1.createrole(message, args);
    }
    else if (command === "deletechannels") {
        if (!message.member.roles.cache.has('719936221572235295'))
            return message.reply("You don't have those premissions");
        await utils_1.deletechannels(message, args);
    }
    else if (command === "test") {
        let r = message.guild.roles.cache.find(role => role.name.toLowerCase() == args.join(" ").toLowerCase());
        await message.channel.send(`${r}`);
    }
    else if (command === "createqualgroup") {
        if (!message.member.roles.cache.has('719936221572235295'))
            return message.reply("You don't have those premissions");
        if (message.channel.id === "722285800225505879" || message.channel.id === "722285842705547305" || message.channel.id === "724839353129369681")
            return;
        await challonge_1.CreateQualGroups(message, args);
    }
    else if (command === "viewgroups") {
        if (!message.member.roles.cache.has('719936221572235295'))
            return message.reply("You don't have those premissions");
        if (message.channel.id === "722285800225505879" || message.channel.id === "722285842705547305" || message.channel.id === "724839353129369681")
            return;
        message.channel.send({ embed: await lbs_1.quallistGroups(message, client, args) });
    }
    else if (command === "search") {
        if (!message.member.roles.cache.has('719936221572235295'))
            return message.reply("You don't have those premissions");
        await challonge_1.GroupSearch(message, args);
    }
    else if (command === "declarequalwinner") {
        await challonge_1.declarequalwinner(message, client);
    }
    else if (command === "removequalwinner") {
        await challonge_1.removequalwinner(message, client);
    }
    if (command === "verify" || command === "code") {
        await verify_1.verify(message, client);
    }
    else if (command === "submit") {
        if (message.channel.id === "722285800225505879" || message.channel.id === "722285842705547305" || message.channel.id === "724839353129369681")
            return;
        await submit_1.submit(message, client);
    }
    else if (command === "qualsubmit") {
        if (message.channel.id === "722285800225505879" || message.channel.id === "722285842705547305" || message.channel.id === "724839353129369681")
            return;
        await submit_1.qualsubmit(message, client);
    }
    else if (command === "submittemplate" || command === "template") {
        await template_1.template(message, client);
    }
    else if (command === "start") {
        if (!message.member.roles.cache.has('719936221572235295'))
            return message.reply("You don't have those premissions");
        await start_1.start(message, client);
        await db_1.updateModProfile(message.author.id, "modactions", 1);
        await db_1.updateModProfile(message.author.id, "matchesstarted", 1);
    }
    else if (command === "forefeit") {
        if (!message.member.roles.cache.has('719936221572235295'))
            return message.reply("You don't have those premissions");
        await message.reply("Not ready");
    }
    else if (command === "checkmatch") {
        if (!message.member.roles.cache.has('719936221572235295'))
            return message.reply("You don't have those premissions");
        if (await db_1.getMatch(message.channel.id)) {
            message.reply("there is an active match");
        }
        else if (await db_1.getQual(message.channel.id)) {
            message.reply("there is an active qualifier match");
        }
        else {
            message.reply("there are no matches");
        }
    }
    else if (command === "startqual") {
        if (!message.member.roles.cache.has('719936221572235295'))
            return message.reply("You don't have those premissions");
        await start_1.startqual(message, client);
        await db_1.updateModProfile(message.author.id, "modactions", 1);
        await db_1.updateModProfile(message.author.id, "matchesstarted", 1);
    }
    else if (command === "startmodqual" || command === "splitqual") {
        if (!message.member.roles.cache.has('719936221572235295'))
            return message.reply("You don't have those premissions");
        await start_1.startmodqual(message, client);
        await db_1.updateModProfile(message.author.id, "modactions", 1);
        await db_1.updateModProfile(message.author.id, "matchesstarted", 1);
    }
    else if (command === "startmodmatch" || command === "splitmatch" || command === "split") {
        if (!message.member.roles.cache.has('719936221572235295'))
            return message.reply("You don't have those premissions");
        await start_1.startregularsplit(message, client);
        await db_1.updateModProfile(message.author.id, "modactions", 1);
        await db_1.updateModProfile(message.author.id, "matchesstarted", 1);
    }
    else if (command === "settheme" || command === "themeset") {
        if (!message.mentions.channels.first())
            return message.reply("please, state the channel for the qualifier");
        if (!args[1])
            return message.reply("please enter a theme");
        let match = await db_1.getQual(message.mentions.channels.first().id);
        match.template = args.slice(1).join(" ");
        await client.channels.cache.get("738047732312309870")
            .send(`<#${match.channelid}> theme is ${args.slice(1).join(" ")}`);
        await db_1.updateQuals(match);
        await message.reply("Theme has been set!");
    }
    else if (command === "approve") {
        if (!message.member.roles.cache.has('719936221572235295'))
            return message.reply("You don't have those premissions");
        if (message.channel.id === "722285800225505879" || message.channel.id === "722285842705547305" || message.channel.id === "724839353129369681")
            return;
        await template_1.approvetemplate(message, client);
        await db_1.updateModProfile(message.author.id, "modactions", 1);
    }
    else if (command === "create") {
        await user_1.createrUser(message);
    }
    else if (command === "modcreate") {
        if (!message.member.roles.cache.has('719936221572235295'))
            return message.reply("You don't have those premissions");
        await modprofiles_1.createmodprofile(message);
    }
    else if (command === "modstats") {
        if (!message.member.roles.cache.has('719936221572235295'))
            return message.reply("You don't have those premissions");
        await modprofiles_1.viewmodprofile(message, client, args);
    }
    else if (command === "modlb") {
        if (!message.member.roles.cache.has('719936221572235295'))
            return message.reply("You don't have those premissions");
        await modprofiles_1.modLB(message, client, args);
    }
    else if (command === "resetmodprofiles") {
        if (message.author.id !== "239516219445608449")
            return message.reply("You don't have those premissions");
        await modprofiles_1.clearmodstats(message);
    }
    else if (command === "cr" || command === "cockrating") {
        if (!message.member.roles.cache.has('719936221572235295')) {
            return message.reply("You are not cock rating master.");
        }
        else {
            let id = (((_d = (_c = (_b = message.mentions) === null || _b === void 0 ? void 0 : _b.users) === null || _c === void 0 ? void 0 : _c.first()) === null || _d === void 0 ? void 0 : _d.id) || message.author.id);
            let form = await db_1.getCockrating(id);
            let max = 100;
            let min = (id === "239516219445608449" ? Math.floor(Math.random() * ((max - 35) - 35) + 1) : Math.floor(Math.random() * ((max - 1) - 1) + 1));
            if (!form) {
                message.reply(`<@${id}> has ${max === min ? `100% good cock` : `${min}/${max} cock.`}`);
                let newform = {
                    _id: id,
                    num: min,
                    time: Math.floor(Date.now() / 1000)
                };
                await db_1.insertCockrating(newform);
            }
            if (Math.floor(Date.now() / 1000) - form.time < 259200) {
                return message.reply("It has not been 3 days");
            }
            else {
                message.reply(`<@${id}> has ${max === min ? `100% good cock` : `${min}/${max} cock. The previous rating was ${form.num}/${max} cock`}`);
                form.num = min;
                form.time = Math.floor(Date.now() / 1000);
                await db_1.updateCockrating(form);
            }
        }
    }
    else if (command === "mr" || command === "manualrating" || command === "powercock") {
        if (!message.member.roles.cache.has('719936221572235295')) {
            return message.reply("You are not cock rating master.");
        }
        else {
            let id = (((_g = (_f = (_e = message.mentions) === null || _e === void 0 ? void 0 : _e.users) === null || _f === void 0 ? void 0 : _f.first()) === null || _g === void 0 ? void 0 : _g.id) || message.author.id);
            let form = await db_1.getCockrating(id);
            let max = 100;
            let min = parseInt(args[1] || args[0]);
            if (!form) {
                message.reply(`<@${id}> has ${max === min ? `100% good cock` : `${min}/${max} cock.`}`);
                let newform = {
                    _id: id,
                    num: min,
                    time: Math.floor(Date.now() / 1000)
                };
                await db_1.insertCockrating(newform);
            }
            else {
                message.reply(`<@${id}> has ${max === min ? `100% good cock` : `${min}/${max} cock. The previous rating was ${form.num}/${max} cock`}`);
                form.num = min;
                await db_1.updateCockrating(form);
            }
        }
    }
    else if (command === "crlb") {
        await lbs_1.cockratingLB(message, client, args);
    }
    else if (command === "lb") {
        await lbs_1.winningLB(message, client, args);
    }
    else if (command === "stats") {
        await user_1.stats(message, client);
    }
    else if (command === "startsplitqual") {
        if (!message.member.roles.cache.has('719936221572235295'))
            return message.reply("You don't have those premissions");
        await start_1.splitqual(client, message);
        await db_1.updateModProfile(message.author.id, "modactions", 1);
        await db_1.updateModProfile(message.author.id, "matchportionsstarted", 1);
    }
    else if (command === "matchstats") {
        if (!message.member.roles.cache.has('719936221572235295'))
            return message.reply("You don't have those premissions");
        await start_1.matchstats(message, client);
    }
    else if (command === "startsplit") {
        if (!message.member.roles.cache.has('719936221572235295'))
            return message.reply("You don't have those premissions");
        await start_1.splitregular(message, client);
        await db_1.updateModProfile(message.author.id, "modactions", 1);
        await db_1.updateModProfile(message.author.id, "matchportionsstarted", 1);
    }
    else if (command === "reload") {
        if (!message.member.roles.cache.has('719936221572235295'))
            return message.reply("You don't have those premissions");
        await start_1.reload(message, client);
    }
    else if (command === "qualend") {
        if (!message.member.roles.cache.has('719936221572235295'))
            return message.reply("You don't have those premissions");
        await winner_1.qualend(client, message.channel.id);
    }
    else if (command === "end") {
        if (!message.member.roles.cache.has('719936221572235295'))
            return message.reply("You don't have those premissions");
        await winner_1.end(client, message.channel.id);
    }
    else if (command === "cancel") {
        if (!message.member.roles.cache.has('719936221572235295'))
            return message.reply("You don't have those premissions");
        await winner_1.cancelmatch(message);
    }
    else if (command === "modhelp") {
        if (!message.member.roles.cache.has('719936221572235295'))
            return message.reply("You don't have those premissions");
        await message.channel.send({ embed: help_1.ModHelp });
    }
    else if (command === "help") {
        await message.channel.send({ embed: help_1.UserHelp });
    }
    else if (command === "signuphelp") {
        if (!message.member.roles.cache.has('719936221572235295'))
            return message.reply("You don't have those premissions");
        await message.channel.send({ embed: help_1.ModSignupHelp });
    }
    else if (command === "challongehelp") {
        if (!message.member.roles.cache.has('719936221572235295'))
            return message.reply("You don't have those premissions");
        await message.channel.send({ embed: help_1.ModChallongeHelp });
    }
    else if (command === "pullout" || command === "goingformilk" || command === "unsignup" || command === "withdraw" || command === "removesignup") {
        await signups_1.removesignup(message);
    }
    else if (command === "viewsignup" || command === "viewlist") {
        await signups_1.activeOffers(message, client, args);
    }
    else if (command === "viewmatchlist" || command === "matchlist") {
        await signups_1.matchlistEmbed(message, client);
    }
    else if (command === "startsignup") {
        await signups_1.startsignup(message, client);
    }
    else if (command === "matchlistmaker") {
        if (message.channel.id === "722285800225505879" || message.channel.id === "722285842705547305" || message.channel.id === "724839353129369681")
            return;
        await challonge_1.matchlistmaker();
    }
    else if (command === "createqualiferbracket" || command === "createqualbracket") {
        if (message.member.roles.cache.has('724818272922501190')
            || message.member.roles.cache.has('724832462286356590'))
            await challonge_1.matchlistmaker();
        await challonge_1.CreateChallongeQualBracket(message, client, args);
    }
    else if (command === "createbracket") {
        if (message.member.roles.cache.has('724818272922501190')
            || message.member.roles.cache.has('724832462286356590'))
            await challonge_1.CreateChallongeMatchBracket(message, client, args, (await client.guilds.cache.get("719406444109103117")));
    }
    else if (command === "channelcreate") {
        if (message.member.roles.cache.has('724818272922501190')
            || message.member.roles.cache.has('724832462286356590'))
            await challonge_1.ChannelCreation(message, client, args);
    }
    else if (command === "qualchannelcreate") {
        await challonge_1.QualChannelCreation(message, args);
    }
    else if (command === "reopensignup") {
        if (message.member.roles.cache.has('724818272922501190')
            || message.member.roles.cache.has('724832462286356590'))
            await signups_1.reopensignup(message, client);
    }
    else if (command === "closesignup") {
        if (message.member.roles.cache.has('724818272922501190')
            || message.member.roles.cache.has('724832462286356590'))
            await signups_1.closesignup(message, client);
    }
    else if (command === "signup") {
        await signups_1.signup(message, client);
    }
    else if (command === "removesignup") {
        await signups_1.removesignup(message);
    }
    else if (command === "deletesignup") {
        if (message.member.roles.cache.has('724818272922501190')
            || message.member.roles.cache.has('724832462286356590')) {
            message.reply(await db_1.deleteSignup());
        }
        else {
            message.reply("No.");
        }
    }
    else if (command === "vs") {
        let users = [];
        for (let i = 0; i < args.length; i++) {
            let userid = await utils_1.getUser(args[i]);
            if (userid) {
                users.push(userid);
            }
        }
        await card_1.vs(message.channel.id, client, users);
    }
    (await client.channels.cache.get("734075282708758540")).send(`ok`);
});
client.login(process.env.TOKEN);
