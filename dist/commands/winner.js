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
exports.qualend = exports.end = exports.endmatch = void 0;
const discord = __importStar(require("discord.js"));
const db_1 = require("../misc/db");
async function endmatch(message, client) {
    let matches = await db_1.getActive();
    for (const match of matches) {
        let user1 = (await client.users.fetch(match.p1.userid));
        let user2 = (await client.users.fetch(match.p2.userid));
        let channelid = client.channels.cache.get(match.channelid);
        if (message.channel.id === channelid.id) {
            if (match.votingperiod) {
                if (match.p1.votes > match.p2.votes) {
                    let embed = new discord.MessageEmbed()
                        .setTitle(`Match between ${user1.username} and ${user2.username}`)
                        .setDescription(`<@${user1.id}> has won!\n The final votes where ${match.p1.votes} to ${match.p2.votes}\n${user1.username} won with image A`)
                        .setTimestamp();
                    channelid.send(embed);
                }
                else if (match.p1.votes < match.p2.votes) {
                    let embed = new discord.MessageEmbed()
                        .setTitle(`Match between ${user1.username} and ${user2.username}`)
                        .setDescription(`<@${user2.id}> has won!\n The final votes where ${match.p1.votes} to ${match.p2.votes}\n${user2.username} won with image B`)
                        .setTimestamp();
                    channelid.send(embed);
                }
                else if (match.p1.votes === match.p2.votes) {
                    let embed = new discord.MessageEmbed()
                        .setTitle(`Match between ${user1.username} and ${user2.username}`)
                        .setDescription(`Both users have come to a draw.\nPlease find a new time for your rematch.`)
                        .setTimestamp();
                    channelid.send(embed);
                }
                await db_1.deleteActive(match);
                break;
            }
            else {
                let embed = new discord.MessageEmbed()
                    .setTitle(`Match between ${user1.username} and ${user2.username}`)
                    .setDescription(`Match has ended early before voting period.\nPlease contact mod for information`)
                    .setTimestamp();
                channelid.send(embed);
                await db_1.deleteActive(match);
                break;
            }
        }
    }
}
exports.endmatch = endmatch;
async function end(client) {
    let matches = await db_1.getActive();
    for (const match of matches) {
        let channelid = client.channels.cache.get(match.channelid);
        let user1 = (await client.users.fetch(match.p1.userid));
        let user2 = (await client.users.fetch(match.p2.userid));
        console.log(Math.floor(Date.now() / 1000) - match.votetime);
        console.log((Math.floor(Date.now() / 1000) - match.votetime) >= 35);
        if ((Math.floor(Date.now() / 1000) - match.p1.time > 1800) && match.p1.memedone === false) {
            user1.send("You have failed to submit your meme, your opponet is the winner.");
            let embed = new discord.MessageEmbed()
                .setTitle(`Match between ${user1.username} and ${user2.username}`)
                .setDescription(`<@${user2.id}> has won!`)
                .setTimestamp();
            await channelid.send(embed);
        }
        else if ((Math.floor(Date.now() / 1000) - match.p2.time > 1800) && match.p2.memedone === false) {
            console.log(Date.now() - match.p2.time);
            user2.send("You have failed to submit your meme, your opponet is the winner.");
            let embed = new discord.MessageEmbed()
                .setTitle(`Match between ${user1.username} and ${user2.username}`)
                .setDescription(`<@${user1.id}> has won!`)
                .setTimestamp();
            await channelid.send(embed);
        }
        else if (((Math.floor(Date.now() / 1000) - match.p2.time > 1800) && match.p2.memedone === false) && ((Math.floor(Date.now() / 1000) - match.p1.time > 1800) && match.p1.memedone === false)) {
            user1.send("You have failed to submit your meme");
            user2.send("You have failed to submit your meme");
            let embed = new discord.MessageEmbed()
                .setTitle(`Match between ${user1.username} and ${user2.username}`)
                .setDescription(`<@${user1.id}> & ${user2.id}have lost\n for not submitting meme on time`)
                .setTimestamp();
            await channelid.send(embed);
        }
        else if (match.p1.votes > match.p2.votes) {
            let embed = new discord.MessageEmbed()
                .setTitle(`Match between ${user1.username} and ${user2.username}`)
                .setDescription(`<@${user1.id}> has won!\n The final votes where ${match.p1.votes} to ${match.p2.votes}\n${user1.username} won with image A`)
                .setTimestamp();
            await channelid.send(embed);
        }
        else if (match.p1.votes < match.p2.votes) {
            let embed = new discord.MessageEmbed()
                .setTitle(`Match between ${user1.username} and ${user2.username}`)
                .setDescription(`<@${user2.id}> has won!\n The final votes where ${match.p1.votes} to ${match.p2.votes}\n${user2.username} won with image B`)
                .setTimestamp();
            await channelid.send(embed);
        }
        else if (match.p1.votes === match.p2.votes) {
            let embed = new discord.MessageEmbed()
                .setTitle(`Match between ${user1.username} and ${user2.username}`)
                .setDescription(`Both users have come to a draw.\nPlease find a new time for your rematch.`)
                .setTimestamp();
            await channelid.send(embed);
        }
        await db_1.deleteActive(match);
    }
}
exports.end = end;
async function qualend(client, message) {
    let matches = await db_1.getQuals();
    for (let match of matches) {
        let channelid = client.channels.cache.get(match.channelid);
        if (message.channel.id === match.channelid) {
            for (let u of match.players) {
                if (u.memedone) {
                    let embed = new discord.MessageEmbed()
                        .setImage(u.memelink)
                        .setTimestamp();
                    await channelid.send(embed);
                }
                else {
                    let embed = new discord.MessageEmbed()
                        .setDescription("Player failed to submit meme on time")
                        .setTimestamp();
                    await channelid.send(embed);
                }
            }
            await db_1.deleteQuals(match);
        }
    }
}
exports.qualend = qualend;
