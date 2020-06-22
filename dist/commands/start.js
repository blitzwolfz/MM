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
exports.splitqual = exports.qualrunning = exports.running = exports.startmodqual = exports.startqual = exports.start = void 0;
const discord = __importStar(require("discord.js"));
const utils_1 = require("../misc/utils");
const prefix = process.env.PREFIX;
const winner_1 = require("./winner");
const card_1 = require("./card");
const db_1 = require("../misc/db");
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
    let user1 = (await client.fetchUser(users[0]));
    let user2 = (await client.fetchUser(users[1]));
    let newmatch = {
        _id: message.channel.id,
        channelid: message.channel.id,
        p1: {
            userid: user1.id,
            memedone: false,
            time: Math.floor(Date.now() / 1000),
            memelink: "",
            votes: 0,
            voters: [],
        },
        p2: {
            userid: user2.id,
            memedone: false,
            time: Math.floor(Date.now() / 1000),
            memelink: "",
            votes: 0,
            voters: [],
        },
        votetime: Math.floor(Date.now() / 1000),
        votingperiod: false,
    };
    await card_1.vs(message, client, users);
    let embed = new discord.RichEmbed()
        .setTitle(`Match between ${user1.username} and ${user2.username}`)
        .setDescription(`<@${user1.id}> and <@${user2.id}> both have 30 mins to complete your memes.\n Contact admins if you have an issue.`)
        .setTimestamp();
    message.channel.send({ embed });
    if (["t", "template"].includes(args[3])) {
        let att = new discord.Attachment(message.attachments.array()[0].url);
        await user1.send("Here is your template:");
        await user1.send(att);
        await user2.send("Here is your template:");
        await user2.send(att);
    }
    else if (["th", "theme"].includes(args[3])) {
        await user1.send(`Your theme is: ${args.splice(4).join(" ")}`);
        await user2.send(`Your theme is: ${args.splice(4).join(" ")}`);
    }
    await db_1.insertActive(newmatch);
}
exports.start = start;
async function startqual(message, client) {
    let users = [];
    var args = message.content.slice(prefix.length).trim().split(/ +/g);
    let x = 0;
    console.log(args);
    if (args.length < 3) {
        return message.reply("Invalid response. Command is `!start @user1 @user2 @user3 @user4 <@user5 @user6> template link`\n or `.start @user1 @user2 theme description`");
    }
    for (let i = 0; i < args.length; i++) {
        let userid = await utils_1.getUser(args[i]);
        if (userid) {
            let player = {
                userid: userid,
                memedone: false,
                memelink: "",
                time: 0,
                split: true,
                failed: false
            };
            users.push(player);
            x += i;
        }
    }
    let newmatch = {
        _id: message.channel.id,
        split: false,
        channelid: message.channel.id,
        players: users,
        template: "",
        octime: Math.floor(Date.now() / 1000),
    };
    let embed = new discord.RichEmbed()
        .setTitle(`Qualifiying match`)
        .setDescription(`All players have 30 mins to complete your memes.\n Contact admins if you have an issue.`)
        .setTimestamp();
    message.channel.send({ embed });
    if (["t", "template"].includes(args[x])) {
        let att = new discord.Attachment(message.attachments.array()[0].url);
        for (let u of users) {
            let user = await client.fetchUser(u.userid);
            await user.send("Here is your template:");
            await user.send(att);
        }
    }
    else if (["th", "theme"].includes(args[x])) {
        for (let u of users) {
            let user = await client.fetchUser(u.userid);
            await user.send(`Your theme is: ${args.splice(x + 1).join(" ")}`);
        }
    }
    await db_1.insertQuals(newmatch);
}
exports.startqual = startqual;
async function startmodqual(message) {
    let users = [];
    var args = message.content.slice(prefix.length).trim().split(/ +/g);
    let x = 0;
    console.log(args);
    if (args.length < 3) {
        return message.reply("invalid response. Command is `!start @user1 @user2 @user3 @user4 <@user5 @user6> template link`\n or `.start @user1 @user2 theme description`");
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
            x += i;
        }
    }
    let newmatch = {
        _id: message.channel.id,
        split: true,
        channelid: message.channel.id,
        players: users,
        octime: 0,
        template: "",
    };
    let embed = new discord.RichEmbed()
        .setTitle(`Qualifiying match`)
        .setDescription(`This match has been split. Please contact mods to start your portion`)
        .setTimestamp();
    message.channel.send({ embed });
    if (["t", "template"].includes(args[x])) {
        newmatch.template = message.attachments.array()[0].url;
    }
    await db_1.insertQuals(newmatch);
}
exports.startmodqual = startmodqual;
async function running(client) {
    let matches = await db_1.getActive();
    for (const match of matches) {
        console.log(Math.floor(Date.now() / 1000) - match.votetime);
        console.log((Math.floor(Date.now() / 1000) - match.votetime) >= 1800);
        let channelid = client.channels.get(match.channelid);
        let user1 = (await client.fetchUser(match.p1.userid));
        let user2 = (await client.fetchUser(match.p2.userid));
        if (match.votingperiod === false) {
            if (((Math.floor(Date.now() / 1000) - match.p2.time > 1800) && match.p2.memedone === false) && ((Math.floor(Date.now() / 1000) - match.p1.time > 1800) && match.p1.memedone === false)) {
                user1.send("You have failed to submit your meme");
                user2.send("You have failed to submit your meme");
                let embed = new discord.RichEmbed()
                    .setTitle(`Match between ${user1.username} and ${user2.username}`)
                    .setDescription(`<@${user1.id}> & <@${user2.id}> have lost\n for not submitting meme on time`)
                    .setTimestamp();
                channelid.send(embed);
                await db_1.deleteActive(match);
                break;
            }
            else if ((Math.floor(Date.now() / 1000) - match.p1.time > 1800) && match.p1.memedone === false) {
                user1.send("You have failed to submit your meme, your opponet is the winner.");
                let embed = new discord.RichEmbed()
                    .setTitle(`Match between ${user1.username} and ${user2.username}`)
                    .setDescription(`<@${user2.id}> has won!`)
                    .setTimestamp();
                channelid.send(embed);
                await db_1.deleteActive(match);
                break;
            }
            else if ((Math.floor(Date.now() / 1000) - match.p2.time > 1800) && match.p2.memedone === false) {
                console.log(Date.now() - match.p2.time);
                user2.send("You have failed to submit your meme, your opponet is the winner.");
                let embed = new discord.RichEmbed()
                    .setTitle(`Match between ${user1.username} and ${user2.username}`)
                    .setDescription(`<@${user1.id}> has won!`)
                    .setTimestamp();
                channelid.send(embed);
                await db_1.deleteActive(match);
                break;
            }
            else if (((Math.floor(Date.now() / 1000) - match.p2.time < 1800) && match.p2.memedone === true) && ((Math.floor(Date.now() / 1000) - match.p2.time < 1800) && match.p1.memedone === true)) {
                var embed1 = new discord.RichEmbed()
                    .setImage(match.p1.memelink)
                    .setTimestamp();
                var embed2 = new discord.RichEmbed()
                    .setImage(match.p2.memelink)
                    .setTimestamp();
                let embed3 = new discord.RichEmbed()
                    .setTitle("Please vote")
                    .setDescription("Vote for Meme 1 reacting with 🅰️\nMeme 2 by reacting with 🅱️");
                await channelid.send(embed1);
                await channelid.send(embed2);
                await channelid.send(embed3).then(async (msg) => {
                    await msg.react("🅰️");
                    await msg.react("🅱️");
                });
                match.votingperiod = true;
                match.votetime = (Math.floor(Date.now() / 1000));
                await db_1.updateActive(match);
            }
        }
        if (match.votingperiod === true) {
            if ((Math.floor(Date.now() / 1000) - match.votetime > 7200)) {
                await winner_1.end(client);
            }
        }
    }
}
exports.running = running;
async function qualrunning(client) {
    let qualmatches = await db_1.getQuals();
    for (let match of qualmatches) {
        let channelid = client.channels.get(match.channelid);
        for (let u of match.players) {
            console.log(u);
            console.log(match.players.length);
            if (Math.floor(Date.now() / 1000) - match.octime > 1800 && match.split === false) {
                if (!u.failed || u.memedone) {
                    let embed = new discord.RichEmbed()
                        .setImage(u.memelink)
                        .setTimestamp();
                    await channelid.send(embed);
                }
                else {
                    let embed = new discord.RichEmbed()
                        .setDescription("Player failed to submit meme on time")
                        .setTimestamp();
                    await channelid.send(embed);
                }
            }
            if (match.split) {
                if (Math.floor(Date.now() / 1000) - u.time > 1800 && u.failed === false && u.split === true) {
                    let embed = new discord.RichEmbed()
                        .setDescription("You failed to submit meme on time")
                        .setTimestamp();
                    u.failed = true;
                    match.octime += 1;
                    await db_1.updateQuals(match);
                    await (await client.fetchUser(u.userid)).send(embed);
                }
            }
            if (match.split) {
                if (match.octime === match.players.length) {
                    match.split = false;
                    match.octime = Math.floor(Date.now() / 1000) - 1800;
                }
            }
        }
        if (Math.floor(Date.now() / 1000) - match.octime > 1800 && match.split === false) {
            await db_1.deleteQuals(match);
        }
    }
}
exports.qualrunning = qualrunning;
async function splitqual(client, message) {
    let user = await (client.fetchUser(message.mentions.users.first().id));
    let qualmatches = await db_1.getQuals();
    for (let match of qualmatches) {
        let channelid = client.channels.get(match.channelid);
        if (match.channelid === message.channel.id) {
            for (let u of match.players) {
                console.log(u);
                if (u.userid === user.id && u.memedone === false && u.split === false) {
                    u.time = Math.floor(Date.now() / 1000);
                    await channelid.send(new discord.RichEmbed()
                        .setDescription(`${user.username} your match has been split.\nYou have 30 mins\nto complete your memes`)
                        .setTimestamp());
                    u.split = true;
                    if (match.template.length > 0) {
                        await user.send("Here is your template:");
                        await user.send(new discord.Attachment(match.template));
                    }
                    await db_1.updateQuals(match);
                }
                else if (u.split === true && u.userid === user.id) {
                    await channelid.send(new discord.RichEmbed()
                        .setDescription(`${user.username} has completed their portion`)
                        .setTimestamp());
                    await db_1.updateQuals(match);
                }
            }
        }
    }
}
exports.splitqual = splitqual;
