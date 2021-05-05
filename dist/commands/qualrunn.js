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
exports.qualrunn = void 0;
const discord = __importStar(require("discord.js"));
const utils_1 = require("../misc/utils");
const winner_1 = require("./winner");
const db_1 = require("../misc/db");
async function qualrunn(match, channelid, client) {
    let channel = client.channels.cache.get(channelid);
    console.log((Math.floor(Date.now() / 1000) - match.votetime > 7200));
    console.log((Math.floor(Date.now() / 1000) - match.votetime));
    if (!match) {
        return;
    }
    if (match.votingperiod === false) {
        if (!match.split) {
            if (Math.floor(Date.now() / 1000) - match.octime > 1800 || match.playersdone.length === match.playerids.length) {
                if (match.playersdone.length <= 2) {
                    match.votingperiod = true;
                    await db_1.updateQuals(match);
                    return await winner_1.qualend(client, channel.id);
                }
                match = qualplayershuffle(match);
                if (match.istheme === false) {
                    await channel.send(new discord.MessageEmbed()
                        .setTitle("Template")
                        .setImage(match.template[0])
                        .setColor("#07da63")
                        .setTimestamp());
                    await channel.send(new discord.MessageEmbed()
                        .setTitle("Template")
                        .setImage(match.template[1])
                        .setColor("#07da63")
                        .setTimestamp());
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
                        await client.channels.cache.get("722616679280148504")
                            .send(new discord.MessageEmbed()
                            .setDescription(`<@${player.userid}> has failed to submit a meme`)
                            .setColor("#d7be26")
                            .setTimestamp());
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
                if (match.template.length > 0 && match.istheme || match.template && match.istheme) {
                    await channel.send("\n\nThe theme is: " + match.template);
                }
                await channel.send(`<@&719936221572235295>`);
                await channel.send("You have 2 hours to vote. You can vote for 2 memes!");
                await db_1.updateQuals(match);
                await db_1.deleteReminder(await db_1.getReminder(channel.id));
            }
        }
        else if (match.split) {
            for (let player of match.players) {
                if (player.split) {
                    if (Math.floor(Date.now() / 1000) - player.time > 1800 && player.failed === false) {
                        player.failed = true;
                        player.memedone = false;
                        let embed2 = new discord.MessageEmbed()
                            .setDescription("You failed to submit your meme on time")
                            .setColor("#d7be26")
                            .setTimestamp();
                        try {
                            await (await client.users.fetch(player.userid)).send(embed2);
                        }
                        catch {
                            console.log(Error);
                        }
                        match.playersdone.push(player.userid);
                        await db_1.updateQuals(match);
                        await client.channels.cache.get("722616679280148504")
                            .send(new discord.MessageEmbed()
                            .setDescription(`<@${player.userid}> has failed to submit a meme`)
                            .setColor("#d7be26")
                            .setTimestamp());
                    }
                }
            }
            if (match.playersdone.length === match.playerids.length) {
                match.split = false;
                match.octime = ((Math.floor(Date.now())) / 1000) - 1800;
                let temparr = [];
                for (let player of match.players) {
                    if (!player.failed) {
                        temparr.push(player.userid);
                    }
                }
                match.playersdone = temparr;
                await db_1.updateQuals(match);
            }
        }
    }
    else if (match.votingperiod) {
        if ((Math.floor(Date.now() / 1000) - match.votetime > 7200) || match.playersdone.length <= 2) {
            await winner_1.qualend(client, channel.id);
        }
    }
    return;
}
exports.qualrunn = qualrunn;
function qualplayershuffle(source) {
    let sourceArray = source.players;
    let source2 = source.playerids;
    console.log(sourceArray);
    for (var i = 0; i < sourceArray.length - 1; i++) {
        var j = i + Math.floor(Math.random() * (sourceArray.length - i));
        var temp = sourceArray[j];
        var temp2 = source2[j];
        sourceArray[j] = sourceArray[i];
        sourceArray[i] = temp;
        source2[j] = source2[i];
        source2[i] = temp2;
    }
    console.log(sourceArray);
    return source;
}
