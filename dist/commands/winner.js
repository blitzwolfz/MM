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
exports.qualend = exports.end = void 0;
const discord = __importStar(require("discord.js"));
const db_1 = require("../misc/db");
const card_1 = require("./card");
const utils_1 = require("../misc/utils");
async function end(client, id) {
    let match = await db_1.getMatch(id);
    console.log(match);
    let channelid = client.channels.cache.get(match.channelid);
    let user1 = (await client.users.fetch(match.p1.userid));
    let user2 = (await client.users.fetch(match.p2.userid));
    console.log(Math.floor(Date.now() / 1000) - match.votetime);
    console.log((Math.floor(Date.now() / 1000) - match.votetime) >= 35);
    if ((Math.floor(Date.now() / 1000) - match.p1.time > 1800) && match.p1.memedone === false) {
        user1.send("You have failed to submit your meme, your opponet is the winner.");
        let embed = new discord.MessageEmbed()
            .setTitle(`Match between ${user1.username} and ${user2.username}`)
            .setColor("#d7be26")
            .setDescription(`<@${user2.id}> has won!`)
            .setFooter(utils_1.dateBuilder());
        db_1.updateProfile(user2.id, "wins", 1);
        db_1.updateProfile(user1.id, "loss", 1);
        await channelid.send(embed);
        await channelid.send([await card_1.winner(client, user2.id)]);
    }
    else if ((Math.floor(Date.now() / 1000) - match.p2.time > 1800) && match.p2.memedone === false) {
        console.log(Date.now() - match.p2.time);
        user2.send("You have failed to submit your meme, your opponet is the winner.");
        let embed = new discord.MessageEmbed()
            .setTitle(`Match between ${user1.username} and ${user2.username}`)
            .setColor("#d7be26")
            .setDescription(`<@${user1.id}> has won!`)
            .setFooter(utils_1.dateBuilder());
        db_1.updateProfile(user1.id, "wins", 1);
        db_1.updateProfile(user2.id, "loss", 1);
        await channelid.send(embed);
        await channelid.send([await card_1.winner(client, user1.id)]);
    }
    else if (((Math.floor(Date.now() / 1000) - match.p2.time > 1800) && match.p2.memedone === false) && ((Math.floor(Date.now() / 1000) - match.p1.time > 1800) && match.p1.memedone === false)) {
        user1.send("You have failed to submit your meme");
        user2.send("You have failed to submit your meme");
        let embed = new discord.MessageEmbed()
            .setTitle(`Match between ${user1.username} and ${user2.username}`)
            .setColor("#d7be26")
            .setDescription(`<@${user1.id}> & ${user2.id}have lost\n for not submitting meme on time`)
            .setFooter(utils_1.dateBuilder());
        await channelid.send(embed);
    }
    else if (match.p1.votes > match.p2.votes) {
        let embed = new discord.MessageEmbed()
            .setTitle(`Match between ${user1.username} and ${user2.username}`)
            .setColor("#d7be26")
            .setDescription(`<@${user1.id}> has won with image A!\n The final votes where ${match.p1.votes} to ${match.p2.votes}`)
            .setFooter(utils_1.dateBuilder());
        db_1.updateProfile(user1.id, "wins", 1);
        db_1.updateProfile(user2.id, "loss", 1);
        await channelid.send(embed);
        await channelid.send([await card_1.winner(client, user1.id)]);
        await client.channels.cache.get("734565012378746950").send((new discord.MessageEmbed()
            .setColor("#d7be26")
            .setImage(match.p1.memelink)
            .setDescription(`${(await (await channelid.guild.members.fetch(user1.id)).nickname) || await (await client.users.fetch(user1.id)).username} won with ${match.p1.votes} votes!`)
            .setFooter(utils_1.dateBuilder())));
    }
    else if (match.p1.votes < match.p2.votes) {
        let embed = new discord.MessageEmbed()
            .setTitle(`Match between ${user1.username} and ${user2.username}`)
            .setColor("#d7be26")
            .setDescription(`<@${user2.id}> has won with image B!\n The final votes where ${match.p1.votes} to ${match.p2.votes}`)
            .setFooter(utils_1.dateBuilder());
        db_1.updateProfile(user1.id, "loss", 1);
        db_1.updateProfile(user2.id, "wins", 1);
        await channelid.send(embed);
        await channelid.send([await card_1.winner(client, user2.id)]);
        await client.channels.cache.get("734565012378746950").send((new discord.MessageEmbed()
            .setColor("#d7be26")
            .setDescription(`${(await (await channelid.guild.members.fetch(user2.id)).nickname) || await (await client.users.fetch(user2.id)).username} won with ${match.p2.votes} votes!`)
            .setImage(match.p2.memelink)
            .setFooter(utils_1.dateBuilder())));
    }
    else if (match.p1.votes === match.p2.votes) {
        let embed = new discord.MessageEmbed()
            .setColor("#d7be26")
            .setTitle(`Match between ${user1.username} and ${user2.username}`)
            .setDescription(`Both users have gotten ${match.p1.votes} vote(s). Both users came to a draw.\nPlease find a new time for your rematch.`)
            .setFooter(utils_1.dateBuilder());
        await channelid.send(embed);
    }
    await db_1.deleteActive(match);
    return;
}
exports.end = end;
async function qualend(client, id) {
    const match = await db_1.getSingularQuals(id);
    let channel = client.channels.cache.get(id);
    let guild = client.guilds.cache.get("719406444109103117");
    if (match.votingperiod) {
        if (match.playersdone.length <= 2 && match.playersdone.length >= 1) {
            let fields = [];
            for (let i = 0; i < match.votes.length; i++)
                if (match.players[i].memedone) {
                    fields.push({
                        name: `${(await (await guild.members.fetch(match.players[i].userid)).nickname) || await (await client.users.fetch(match.players[i].userid)).username}`,
                        value: `Has automatically won!`
                    });
                }
                else if (match.players[i].memedone === false) {
                    fields.push({
                        name: `${(await (await guild.members.fetch(match.players[i].userid)).nickname) || await (await client.users.fetch(match.players[i].userid)).username}`,
                        value: `Failed to submit meme!`
                    });
                }
            await db_1.deleteQuals(match);
            return channel.send({
                embed: {
                    title: `Qualifier has ended`,
                    fields,
                    color: "#d7be26",
                    timestamp: new Date()
                }
            });
        }
        if (match.playersdone.length === 0) {
            await db_1.deleteQuals(match);
            return channel.send({
                embed: {
                    title: `Qualifier has ended. No one submitted a meme.`,
                    color: "#d7be26",
                    timestamp: new Date()
                }
            });
        }
        else if (match.playersdone.length > 2) {
            const fields = [];
            let totalvotes = 0;
            for (let votes of match.votes) {
                totalvotes += votes.length;
            }
            for (let i = 0; i < match.votes.length; i++) {
                fields.push({
                    name: `${await (await client.users.fetch(match.players[i].userid)).username} | Meme #${match.players.indexOf(match.players[i]) + 1}`,
                    value: `${match.players[i].memedone ? `Finished with ${match.votes[i].length} | Earned: ${Math.floor(match.votes[i].length / totalvotes * 100)} points` : `Failed to submit meme`}`,
                });
            }
            var list = [];
            for (var j = 0; j < match.votes.length; j++)
                list.push({ 'votes': match.votes[j], 'field': fields[j] });
            list.sort(function (a, b) {
                return ((b.votes.length) - (a.votes.length));
            });
            for (var k = 0; k < list.length; k++) {
                match.votes[k] = list[k].votes;
                fields[k] = list[k].field;
            }
            await db_1.deleteQuals(match);
            await (await client.channels.cache.get("722291182461386804"))
                .send({
                embed: {
                    title: `Votes for ${channel.name} are in!`,
                    description: `${totalvotes} votes for this qualifier`,
                    fields,
                    color: "#d7be26",
                    timestamp: new Date()
                }
            });
            return channel.send({
                embed: {
                    title: `Votes for ${channel.name} are in!`,
                    description: `${totalvotes} votes for this qualifier`,
                    fields,
                    color: "#d7be26",
                    timestamp: new Date()
                }
            });
        }
    }
    else if (!match.votingperiod) {
        await db_1.deleteQuals(match);
        return channel.send({
            embed: {
                title: `Votes for this qualifier are in!`,
                color: "#d7be26",
                description: "Match has ended early before voting period.\nPlease contact mod for information",
                timestamp: new Date()
            }
        });
    }
}
exports.qualend = qualend;
