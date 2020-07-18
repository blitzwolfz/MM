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
exports.reload = exports.startregularsplit = exports.splitregular = exports.splitqual = exports.qualrunning = exports.running = exports.startmodqual = exports.startqual = exports.start = void 0;
const discord = __importStar(require("discord.js"));
const utils_1 = require("../misc/utils");
const prefix = process.env.PREFIX;
const winner_1 = require("./winner");
const card_1 = require("./card");
const db_1 = require("../misc/db");
const user_1 = require("./user");
const qualrunn_1 = require("./qualrunn");
async function start(message, client) {
    let users = [];
    var args = message.content.slice(prefix.length).trim().split(/ +/g);
    if (args.length < 3) {
        return message.reply("invalid response. Command is `!start @user1 @user2 template link`\n or `!start @user1 @user2 theme description`");
    }
    for (let i = 0; i < args.length; i++) {
        let userid = await utils_1.getUser(args[i]);
        if (userid) {
            users.push(userid);
        }
    }
    let user1 = (await client.users.fetch(users[0]));
    let user2 = (await client.users.fetch(users[1]));
    user_1.createAtUsermatch(user1);
    user_1.createAtUsermatch(user2);
    let newmatch = {
        _id: message.channel.id,
        channelid: message.channel.id,
        split: false,
        messageID: "",
        p1: {
            userid: user1.id,
            memedone: false,
            donesplit: true,
            time: Math.floor(Date.now() / 1000),
            memelink: "",
            votes: 0,
            voters: [],
        },
        p2: {
            userid: user2.id,
            memedone: false,
            donesplit: true,
            time: Math.floor(Date.now() / 1000),
            memelink: "",
            votes: 0,
            voters: [],
        },
        votetime: Math.floor(Date.now() / 1000),
        votingperiod: false,
    };
    await card_1.vs(message, client, users);
    let embed = new discord.MessageEmbed()
        .setTitle(`Match between ${user1.username} and ${user2.username}`)
        .setColor("#d7be26")
        .setDescription(`<@${user1.id}> and <@${user2.id}> both have 40 mins to complete your memes.\n Contact admins if you have an issue.`)
        .setTimestamp();
    message.channel.send({ embed });
    if (["t", "template"].includes(args[3])) {
        let att = new discord.MessageAttachment(message.attachments.array()[0].url);
        await user1.send("Here is your template:");
        await user1.send(att);
        await user2.send("Here is your template:");
        await user2.send(att);
    }
    else if (["th", "theme"].includes(args[3])) {
        await user1.send(`Your theme is: ${args.splice(4).join(" ")}`);
        await user2.send(`Your theme is: ${args.splice(4).join(" ")}`);
    }
    await user1.send(`Your match has been split.\nYou have 40 mins to complete your portion\nUse \`!submit\` to submit`);
    await user2.send(`Your match has been split.\nYou have 40 mins to complete your portion\nUse \`!submit\` to submit`);
    await db_1.insertActive(newmatch);
}
exports.start = start;
async function startqual(message, client) {
    let users = [];
    var args = message.content.slice(prefix.length).trim().split(/ +/g);
    let x = 0;
    let plyerids = [];
    let votearray = [];
    console.log(args);
    if (args.length < 4) {
        return message.reply("Invalid response. Command is `!startqual @user1 @user2 @user3 @user4 <@user5 @user6> template link`\n or `!startqual @user1 @user2 theme description`");
    }
    for (let i = 0; i < args.length; i++) {
        let userid = await utils_1.getUser(args[i]);
        if (userid) {
            let player = {
                userid: userid,
                memedone: false,
                memelink: "",
                time: 0,
                split: false,
                failed: false
            };
            users.push(player);
            plyerids.push(userid);
            votearray.push([]);
            x += i;
        }
    }
    for (const u of users) {
        user_1.createAtUsermatch(await client.users.fetch(u.userid));
    }
    let newmatch = {
        _id: message.channel.id,
        split: false,
        channelid: message.channel.id,
        players: users,
        playerids: plyerids,
        template: "",
        votes: votearray,
        octime: Math.floor(Date.now() / 1000),
        playersdone: [],
        votingperiod: false,
        votetime: 0
    };
    let embed = new discord.MessageEmbed()
        .setTitle(`Qualifiying match`)
        .setColor("#d7be26")
        .setDescription(`All players have 30 mins to complete your memes.\n Contact admins if you have an issue.`)
        .setTimestamp();
    message.channel.send({ embed });
    if (["t", "template"].includes(args[x])) {
        let att = new discord.MessageAttachment(message.attachments.array()[0].url);
        for (let u of users) {
            let user = await client.users.fetch(u.userid);
            await user.send("Here is your template:");
            await user.send(att);
        }
    }
    else if (["th", "theme"].includes(args[x])) {
        for (let u of users) {
            let user = await client.users.fetch(u.userid);
            await user.send(`Your theme is: ${args.splice(x + 1).join(" ")}`);
        }
    }
    await db_1.insertQuals(newmatch);
}
exports.startqual = startqual;
async function startmodqual(message, client) {
    let users = [];
    var args = message.content.slice(prefix.length).trim().split(/ +/g);
    let x = 0;
    let plyerids = [];
    let votearray = [];
    console.log(args);
    if (args.length < 4) {
        return message.reply("invalid response. Command is `!splitqual @user1 @user2 @user3 @user4 <@user5 @user6> template link`\n or `!splitqual @user1 @user2 @user3 @user4 <@user5 @user6> theme description`");
    }
    for (let i = 0; i < args.length; i++) {
        let userid = await utils_1.getUser(args[i]);
        if (userid) {
            let player = {
                userid: userid,
                memedone: false,
                memelink: "",
                time: 0,
                split: false,
                failed: false
            };
            users.push(player);
            plyerids.push(userid);
            votearray.push([]);
            x += i;
        }
    }
    for (const u of users) {
        user_1.createAtUsermatch(await client.users.fetch(u.userid));
    }
    let newmatch = {
        _id: message.channel.id,
        split: true,
        playerids: plyerids,
        channelid: message.channel.id,
        players: users,
        octime: 0,
        votes: votearray,
        template: "",
        playersdone: [],
        votingperiod: false,
        votetime: 0
    };
    let embed = new discord.MessageEmbed()
        .setTitle(`Qualifiying match`)
        .setColor("#d7be26")
        .setDescription(`This match has been split. Please contact mods to start your portion`)
        .setTimestamp();
    message.channel.send({ embed });
    console.log(args[args.indexOf("theme") + 1]);
    if (["t", "template"].includes(args[x])) {
        newmatch.template = message.attachments.array()[0].url;
    }
    else if (args.includes("theme")) {
        newmatch.template = args[args.indexOf("theme") + 1];
    }
    await db_1.insertQuals(newmatch);
}
exports.startmodqual = startmodqual;
async function running(client) {
    let matches = await db_1.getActive();
    for (const match of matches) {
        console.log(Math.floor(Date.now() / 1000) - match.votetime);
        console.log((Math.floor(Date.now() / 1000) - match.votetime) >= 1800);
        let channelid = client.channels.cache.get(match.channelid);
        let user1 = (await client.users.fetch(match.p1.userid));
        let user2 = (await client.users.fetch(match.p2.userid));
        if (match.votingperiod === false) {
            if (((Math.floor(Date.now() / 1000) - match.p2.time > 2400) && match.p2.memedone === false)
                && ((Math.floor(Date.now() / 1000) - match.p1.time > 2400) && match.p1.memedone === false)) {
                user1.send("You have lost because did not submit your meme");
                user2.send("You have lost because did not submit your meme");
                let embed = new discord.MessageEmbed()
                    .setColor("#d7be26")
                    .setTitle(`Match between ${user1.username} and ${user2.username}`)
                    .setDescription(`<@${user1.id}> & <@${user2.id}> have lost\n for not submitting meme on time`)
                    .setTimestamp();
                channelid.send(embed);
                await db_1.deleteActive(match);
                break;
            }
            else if ((Math.floor(Date.now() / 1000) - match.p1.time > 2400)
                && match.p1.memedone === false && match.p1.donesplit) {
                user1.send("You have failed to submit your meme, your opponet is the winner.");
                let embed = new discord.MessageEmbed()
                    .setColor("#d7be26")
                    .setTitle(`Match between ${user1.username} and ${user2.username}`)
                    .setDescription(`<@${user2.id}> has won!`)
                    .setTimestamp();
                channelid.send(embed);
                await db_1.deleteActive(match);
            }
            else if ((Math.floor(Date.now() / 1000) - match.p2.time > 2400)
                && match.p2.memedone === false && match.p2.donesplit) {
                console.log(Date.now() - match.p2.time);
                user2.send("You have failed to submit your meme, your opponet is the winner.");
                let embed = new discord.MessageEmbed()
                    .setTitle(`Match between ${user1.username} and ${user2.username}`)
                    .setDescription(`<@${user1.id}> has won!`)
                    .setColor("#d7be26")
                    .setTimestamp();
                channelid.send(embed);
                await db_1.deleteActive(match);
            }
            else if ((!(match.split) && ((Math.floor(Date.now() / 1000) - match.p2.time < 2400) && match.p2.memedone === true)
                && ((Math.floor(Date.now() / 1000) - match.p2.time < 2400) && match.p1.memedone === true))) {
                if (Math.floor(Math.random() * (5 - 1) + 1) % 2 === 1) {
                    let temp = match.p1;
                    match.p1 = match.p2;
                    match.p2 = temp;
                    await db_1.updateActive(match);
                }
                var embed1 = new discord.MessageEmbed()
                    .setDescription("Meme #1")
                    .setImage(match.p1.memelink)
                    .setColor("#d7be26")
                    .setTimestamp();
                var embed2 = new discord.MessageEmbed()
                    .setDescription("Meme #2")
                    .setImage(match.p2.memelink)
                    .setColor("#d7be26")
                    .setTimestamp();
                let embed3 = new discord.MessageEmbed()
                    .setTitle("Please vote")
                    .setColor("#d7be26")
                    .setDescription(`Vote for Meme 1 reacting with ${utils_1.emojis[0]}\nMeme 2 by reacting with ${utils_1.emojis[1]}`);
                await channelid.send(embed1);
                await channelid.send(embed2);
                await channelid.send(embed3).then(async (msg) => {
                    match.messageID = msg.id;
                    await msg.react(utils_1.emojis[0]);
                    await msg.react(utils_1.emojis[1]);
                });
                match.votingperiod = true;
                match.votetime = (Math.floor(Date.now() / 1000));
                await db_1.updateActive(match);
                await channelid.send(`<@&719936221572235295>`);
                await channelid.send("You have 2 hours to vote!");
            }
        }
        if (match.votingperiod === true && !match.split) {
            if ((Math.floor(Date.now() / 1000) - match.votetime > 7200) && !match.split) {
                await winner_1.end(client, match.channelid);
            }
        }
    }
}
exports.running = running;
async function qualrunning(client) {
    let qualmatches = await db_1.getQuals();
    for (let match of qualmatches) {
        await qualrunn_1.qualrunn(match, match.channelid, client);
    }
}
exports.qualrunning = qualrunning;
async function splitqual(client, message) {
    let user = await (client.users.fetch(message.mentions.users.first().id));
    let qualmatches = await db_1.getQuals();
    for (let match of qualmatches) {
        let channelid = client.channels.cache.get(match.channelid);
        if (match.channelid === message.channel.id) {
            for (let u of match.players) {
                console.log(u);
                if (u.userid === user.id && u.memedone === false && u.split === false) {
                    u.time = Math.floor(Date.now() / 1000);
                    await channelid.send(new discord.MessageEmbed()
                        .setDescription(`<@${user.id}> your qualifier match has been split.\nYou have 30 mins to complete your memes\nUse \`!qualsubmit\` to submit`)
                        .setColor("#d7be26")
                        .setTimestamp());
                    u.split = true;
                    await user.send(`<@${user.id}> your qualifier match has been split.\nYou have 30 mins to complete your memes\nUse \`!qualsubmit\` to submit`);
                    if (match.template.length > 0 || match.template) {
                        await user.send("\n\nHere is your theme: " + match.template);
                    }
                    await db_1.updateQuals(match);
                }
                else if (u.split === true && u.userid === user.id) {
                    await channelid.send(new discord.MessageEmbed()
                        .setDescription(`<@${user.id}> has completed their portion`)
                        .setColor("#d7be26")
                        .setTimestamp());
                    await db_1.updateQuals(match);
                }
            }
        }
    }
}
exports.splitqual = splitqual;
async function splitregular(message, client) {
    let user = await (client.users.fetch(message.mentions.users.first().id));
    let matches = await db_1.getActive();
    for (let match of matches) {
        if (match.split) {
            if (match.channelid === message.channel.id) {
                if (user.id === match.p1.userid) {
                    if (!(match.p1.donesplit)) {
                        await message.channel.send(new discord.MessageEmbed()
                            .setDescription(`<@${user.id}> your match has been split.\nYou have 40 mins to complete your memes\nUse ${`!submit`} to submit`)
                            .setColor("#d7be26")
                            .setTimestamp());
                        match.p1.donesplit = true;
                        match.p1.time = Math.floor(Date.now() / 1000);
                        await (await client.users.fetch(match.p1.userid)).send(`Your match has been split.\nYou have 40 mins to complete your portion\nUse \`!submit\` to submit`);
                        await db_1.updateActive(match);
                        return;
                    }
                }
                if (user.id === match.p2.userid) {
                    if (!(match.p2.donesplit)) {
                        await message.channel.send(new discord.MessageEmbed()
                            .setDescription(`<@${user.id}> your match has been split.\nYou have 40 mins to complete your memes`)
                            .setColor("#d7be26")
                            .setTimestamp());
                        match.p2.donesplit = true;
                        match.p2.time = Math.floor(Date.now() / 1000);
                        await (await client.users.fetch(match.p2.userid)).send(`Your match has been split.\nYou have 40 mins to complete your portion\nUse \`!submit\` to submit`);
                        await db_1.updateActive(match);
                        return;
                    }
                }
            }
        }
    }
}
exports.splitregular = splitregular;
async function startregularsplit(message, client) {
    let users = [];
    var args = message.content.slice(prefix.length).trim().split(/ +/g);
    if (args.length < 3) {
        return message.reply("invalid response. Command is `!start @user1 @user2 template link`\n or `!start @user1 @user2 theme description`");
    }
    for (let i = 0; i < args.length; i++) {
        let userid = await utils_1.getUser(args[i]);
        if (userid) {
            users.push(userid);
        }
    }
    let user1 = (await client.users.fetch(users[0]));
    let user2 = (await client.users.fetch(users[1]));
    user_1.createAtUsermatch(user1);
    user_1.createAtUsermatch(user2);
    let newmatch = {
        _id: message.channel.id,
        channelid: message.channel.id,
        split: true,
        messageID: "",
        p1: {
            userid: user1.id,
            memedone: false,
            donesplit: false,
            time: Math.floor(Date.now() / 1000),
            memelink: "",
            votes: 0,
            voters: [],
        },
        p2: {
            userid: user2.id,
            memedone: false,
            donesplit: false,
            time: Math.floor(Date.now() / 1000),
            memelink: "",
            votes: 0,
            voters: [],
        },
        votetime: Math.floor(Date.now() / 1000),
        votingperiod: false,
    };
    await card_1.vs(message, client, users);
    let embed = new discord.MessageEmbed()
        .setTitle(`Match between ${user1.username} and ${user2.username}`)
        .setColor("#d7be26")
        .setDescription(`<@${user1.id}> and <@${user2.id}> your match has been split.\nContact mods to start your portion\nUse ${`!submit`} to submit`)
        .setTimestamp();
    message.channel.send({ embed });
    if (["t", "template"].includes(args[3])) {
        let att = new discord.MessageAttachment(message.attachments.array()[0].url);
        await user1.send("Here is your template:");
        await user1.send(att);
        await user2.send("Here is your template:");
        await user2.send(att);
    }
    await db_1.insertActive(newmatch);
}
exports.startregularsplit = startregularsplit;
async function reload(message, client) {
    let match = await db_1.getSingularQuals(message.channel.id);
    if (match) {
        let channel = client.channels.cache.get(match.channelid);
        if (!match) {
            console.log("Check 1");
            return;
        }
        console.log("Check 2");
        console.log("Check 3");
        if (Math.floor(Date.now() / 1000) - match.octime > 1800 || match.playersdone.length === match.playerids.length) {
            for (let i = 0; i < match.votes.length; i++) {
                match.votes[i] = [];
            }
            if (match.playersdone.length <= 2) {
                match.votingperiod = true;
                await db_1.updateQuals(match);
                return await winner_1.qualend(client, channel.id);
            }
            for (let player of match.players) {
                if (player.memedone) {
                    let embed = new discord.MessageEmbed()
                        .setTitle(`Meme #${match.players.indexOf(player) + 1}`)
                        .setColor("#d7be26")
                        .setImage(player.memelink)
                        .setTimestamp();
                    await channel.send(embed);
                }
                else if (!player.memedone) {
                    let embed2 = new discord.MessageEmbed()
                        .setDescription("Player failed to submit meme on time")
                        .setColor("#d7be26")
                        .setTimestamp();
                    await channel.send(embed2);
                }
            }
            let em = new discord.MessageEmbed()
                .setDescription("Please vote by clicking the number emotes.\nHit the recycle emote to reset votes")
                .setColor("#d7be26")
                .setTimestamp();
            channel.send(em).then(async (msg) => {
                for (let i = 0; i < match.playerids.length; i++) {
                    await msg.react(utils_1.emojis[i]);
                }
                await msg.react(utils_1.emojis[6]);
            });
            match.votetime = Math.floor(Date.now() / 1000);
            match.votingperiod = true;
            if (match.template.length > 0 || match.template) {
                await channel.send("\n\nThe theme is: " + match.template);
            }
            await channel.send("You have 2 hours to vote. You can vote for 2 memes!");
            await db_1.updateQuals(match);
            await channel.send(`<@&719936221572235295>`);
        }
    }
    else {
        let match = await db_1.getMatch(message.channel.id);
        let channelid = client.channels.cache.get(match.channelid);
        let user1 = (await client.users.fetch(match.p1.userid));
        let user2 = (await client.users.fetch(match.p2.userid));
        if (!(match.split) && ((Math.floor(Date.now() / 1000) - match.p2.time > 2400) && match.p2.memedone === false)
            && ((Math.floor(Date.now() / 1000) - match.p1.time > 2400) && match.p1.memedone === false)) {
            user1.send("You have failed to submit your meme");
            user2.send("You have failed to submit your meme");
            let embed = new discord.MessageEmbed()
                .setColor("#d7be26")
                .setTitle(`Match between ${user1.username} and ${user2.username}`)
                .setDescription(`<@${user1.id}> & <@${user2.id}> have lost\n for not submitting meme on time`)
                .setTimestamp();
            channelid.send(embed);
            await db_1.deleteActive(match);
        }
        else if ((Math.floor(Date.now() / 1000) - match.p1.time > 2400)
            && match.p1.memedone === false && match.p1.donesplit) {
            user1.send("You have failed to submit your meme, your opponet is the winner.");
            let embed = new discord.MessageEmbed()
                .setColor("#d7be26")
                .setTitle(`Match between ${user1.username} and ${user2.username}`)
                .setDescription(`<@${user2.id}> has won!`)
                .setTimestamp();
            channelid.send(embed);
            await db_1.deleteActive(match);
        }
        else if ((Math.floor(Date.now() / 1000) - match.p2.time > 2400)
            && match.p2.memedone === false && match.p2.donesplit) {
            console.log(Date.now() - match.p2.time);
            user2.send("You have failed to submit your meme, your opponet is the winner.");
            let embed = new discord.MessageEmbed()
                .setTitle(`Match between ${user1.username} and ${user2.username}`)
                .setDescription(`<@${user1.id}> has won!`)
                .setColor("#d7be26")
                .setTimestamp();
            channelid.send(embed);
            await db_1.deleteActive(match);
        }
        else if ((!(match.split) && ((Math.floor(Date.now() / 1000) - match.p2.time < 2400) && match.p2.memedone === true)
            && ((Math.floor(Date.now() / 1000) - match.p2.time < 2400) && match.p1.memedone === true))) {
            if (Math.floor(Math.random() * (5 - 1) + 1) % 2 === 1) {
                let temp = match.p1;
                match.p1 = match.p2;
                match.p2 = temp;
                await db_1.updateActive(match);
            }
            var embed1 = new discord.MessageEmbed()
                .setImage(match.p1.memelink)
                .setColor("#d7be26")
                .setTimestamp();
            var embed2 = new discord.MessageEmbed()
                .setImage(match.p2.memelink)
                .setColor("#d7be26")
                .setTimestamp();
            let embed3 = new discord.MessageEmbed()
                .setTitle("Please vote")
                .setColor("#d7be26")
                .setDescription(`Vote for Meme 1 reacting with ${utils_1.emojis[0]}\nMeme 2 by reacting with ${utils_1.emojis[1]}`);
            await channelid.send(embed1);
            await channelid.send(embed2);
            await channelid.send(embed3).then(async (msg) => {
                match.messageID = msg.id;
                await msg.react(utils_1.emojis[0]);
                await msg.react(utils_1.emojis[1]);
            });
            match.votingperiod = true;
            match.votetime = (Math.floor(Date.now() / 1000));
            match.p1.voters = [];
            match.p1.votes = 0;
            match.p2.voters = [];
            match.p2.votes = 0;
            await db_1.updateActive(match);
        }
    }
}
exports.reload = reload;
