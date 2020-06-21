"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../misc/db");
async function submit(message, matches, client) {
    if (message.attachments.size > 1) {
        return message.reply("You can't submit more than one image");
    }
    else if (message.attachments.size <= 0) {
        return message.reply("Your image was not submitted properly. Contact a mode");
    }
    else if (message.channel.type !== "dm") {
        return message.reply("You didn't not submit this in the DM with the bot.\nPlease delete and try again.");
    }
    else {
        for (const match of matches) {
            if (match.p1.userid === message.author.id && !match.p1.memedone) {
                match.p1.memedone = true;
                match.p1.memelink = message.attachments.array()[0].url;
                await db_1.updateActive(match);
                await client.channels.get(match.channelid).send({
                    embed: {
                        description: `<@${message.author.id}> has submitted their meme`,
                        timestamp: new Date()
                    }
                });
                return message.reply("Your meme has been attached!");
            }
            if (match.p2.userid === message.author.id && !match.p2.memedone) {
                match.p2.memedone = true;
                match.p2.memelink = message.attachments.array()[0].url;
                await db_1.updateActive(match);
                await client.channels.get(match.channelid).send({
                    embed: {
                        description: `<@${message.author.id}> has submitted their meme`,
                        timestamp: new Date()
                    }
                });
                return message.reply("Your meme has been attached!");
            }
        }
    }
}
exports.submit = submit;
async function qualsubmit(message, matches, client) {
    if (message.attachments.size > 1) {
        return message.reply("You can't submit more than one image");
    }
    else if (message.attachments.size <= 0) {
        return message.reply("Your image was not submitted properly. Contact a mod");
    }
    else if (message.channel.type !== "dm") {
        return message.reply("You didn't not submit this in the DM with the bot.\nPlease delete and try again.");
    }
    else {
        for (const match of matches) {
            for (let player of match.players) {
                if (player.userid === message.author.id) {
                    player.memedone = true;
                    player.memelink = message.attachments.array()[0].url;
                    player.split = false;
                    match.octime += 1;
                    if (match.octime >= match.players.length) {
                        match.octime = Math.floor(Date.now() / 1000) - 1800;
                        match.split = false;
                    }
                    await message.reply("You meme has been attached!");
                    await client.channels.get(match.channelid).send({
                        embed: {
                            description: `<@${message.author.id}> has submitted their meme`,
                            timestamp: new Date()
                        }
                    });
                    await db_1.updateQuals(match);
                }
            }
        }
    }
}
exports.qualsubmit = qualsubmit;
