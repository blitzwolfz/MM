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
exports.cancelmatch = exports.qualend = exports.end = void 0;
const discord = __importStar(require("discord.js"));
const db_1 = require("../misc/db");
const card_1 = require("./card");
const utils_1 = require("../misc/utils");
const challonge_1 = require("./challonge");
require("dotenv").config();
async function end(client, id) {
    let match = await db_1.getMatch(id);
    await db_1.deleteActive(match);
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
        if (!match.exhibition) {
            db_1.updateProfile(user2.id, "wins", 1);
            db_1.updateProfile(user1.id, "loss", 1);
        }
        await channelid.send(embed);
        if (process.env.winner && match.exhibition === false) {
            await channelid.send([await card_1.grandwinner(client, user2.id)]);
        }
        else {
            await channelid.send([await card_1.winner(client, user2.id)]);
        }
    }
    else if ((Math.floor(Date.now() / 1000) - match.p2.time > 1800) && match.p2.memedone === false) {
        console.log(Date.now() - match.p2.time);
        user2.send("You have failed to submit your meme, your opponet is the winner.");
        let embed = new discord.MessageEmbed()
            .setTitle(`Match between ${user1.username} and ${user2.username}`)
            .setColor("#d7be26")
            .setDescription(`<@${user1.id}> has won!`)
            .setFooter(utils_1.dateBuilder());
        if (!match.exhibition) {
            db_1.updateProfile(user1.id, "wins", 1);
            db_1.updateProfile(user2.id, "loss", 1);
        }
        await channelid.send(embed);
        if (process.env.winner && match.exhibition === false) {
            await channelid.send([await card_1.grandwinner(client, user1.id)]);
        }
        else {
            await channelid.send([await card_1.winner(client, user1.id)]);
        }
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
            .setDescription(`<@${user1.id}> has won with image A!\n The final votes were ${match.p1.votes} to ${match.p2.votes}`)
            .setFooter(utils_1.dateBuilder());
        if (!match.exhibition) {
            db_1.updateProfile(user1.id, "wins", 1);
            db_1.updateProfile(user1.id, "points", (25 + (match.p1.votes * 5)));
            db_1.updateProfile(user2.id, "loss", 1);
            db_1.updateProfile(user2.id, "points", match.p2.votes * 5);
        }
        await channelid.send(embed);
        if (process.env.winner && match.exhibition === false) {
            await channelid.send([await card_1.grandwinner(client, user1.id)]);
        }
        else {
            await channelid.send([await card_1.winner(client, user1.id)]);
        }
        if (!match.exhibition) {
            await user1.send(`Your match is over, here is the final result. You gained 25 points for winning your match, and ${(match.p1.votes * 5)} points from your votes.`, { embed: embed });
            await user2.send(`Your match is over, here is the final result. You gained ${(match.p2.votes * 5)} points from your votes.`, { embed: embed });
        }
        if (match.exhibition === false) {
            await client.channels.cache.get("734565012378746950").send((new discord.MessageEmbed()
                .setColor("#d7be26")
                .setImage(match.p1.memelink)
                .setDescription(`${(await (await channelid.guild.members.fetch(user1.id)).nickname) || await (await client.users.fetch(user1.id)).username} won with ${match.p1.votes} votes!`)
                .setFooter(utils_1.dateBuilder())));
        }
        else if (match.exhibition === true) {
            await client.channels.cache.get("780774797273071626").send((new discord.MessageEmbed()
                .setColor("#d7be26")
                .setImage(match.p1.memelink)
                .setDescription(`<@${user1.id}> beat <@${user2.id}>.\nThe final score was ${match.p1.votes} to ${match.p2.votes} votes!`)
                .setFooter(utils_1.dateBuilder())));
        }
    }
    else if (match.p1.votes < match.p2.votes) {
        let embed = new discord.MessageEmbed()
            .setTitle(`Match between ${user1.username} and ${user2.username}`)
            .setColor("#d7be26")
            .setDescription(`<@${user2.id}> has won with image B!\n The final votes were ${match.p1.votes} to ${match.p2.votes}`)
            .setFooter(utils_1.dateBuilder());
        if (!match.exhibition) {
            db_1.updateProfile(user1.id, "loss", 1);
            db_1.updateProfile(user1.id, "points", match.p1.votes * 5);
            db_1.updateProfile(user2.id, "wins", 1);
            db_1.updateProfile(user2.id, "points", (25 + (match.p2.votes * 5)));
        }
        await channelid.send(embed);
        if (process.env.winner && match.exhibition === false) {
            await channelid.send([await card_1.grandwinner(client, user2.id)]);
        }
        else {
            await channelid.send([await card_1.winner(client, user2.id)]);
        }
        if (match.exhibition === false) {
            await client.channels.cache.get("734565012378746950").send((new discord.MessageEmbed()
                .setColor("#d7be26")
                .setImage(match.p2.memelink)
                .setDescription(`${(await (await channelid.guild.members.fetch(user2.id)).nickname) || await (await client.users.fetch(user2.id)).username} won with ${match.p2.votes} votes!`)
                .setFooter(utils_1.dateBuilder())));
        }
        else if (match.exhibition === true) {
            await client.channels.cache.get("780774797273071626").send((new discord.MessageEmbed()
                .setColor("#d7be26")
                .setImage(match.p2.memelink)
                .setDescription(`<@${user2.id}> beat <@${user1.id}>.\nThe final score was ${match.p2.votes} to ${match.p1.votes} votes!`)
                .setFooter(utils_1.dateBuilder())));
        }
        if (!match.exhibition) {
            await user1.send(`Your match is over, here is the final result. You gained ${(match.p1.votes * 5)} points from your votes.`, { embed: embed });
            await user2.send(`Your match is over, here is the final result. You gained 25 points for winning your match, and gained ${(match.p2.votes * 5)} points from your votes.`, { embed: embed });
        }
    }
    else if (match.p1.votes === match.p2.votes) {
        await user1.send(`Your match is over,both of you ended in a tie of ${match.p1.votes}`);
        await user2.send(`Your match is over, both of you ended in a tie of ${match.p1.votes}`);
        await channelid.send(new discord.MessageEmbed()
            .setColor("#d7be26")
            .setTitle(`Match between ${user1.username} and ${user2.username}`)
            .setDescription(`Both users have gotten ${match.p1.votes} vote(s). Both users came to a draw.`)
            .setFooter(utils_1.dateBuilder()));
        if (match.exhibition === false) {
            let m = await channelid
                .send(`<@${user1.id}> <@${user2.id}> Please complete this re-match ASAP. Contact a ref to begin.`);
            await db_1.insertReminder({
                _id: channelid.id,
                mention: `<@${user1.id}> <@${user2.id}>`,
                channel: channelid.id,
                type: "match",
                time: 86400,
                timestamp: Math.round(m.createdTimestamp / 1000)
            });
        }
    }
    let t = channelid.topic.toString().split(",");
    if (!match.exhibition) {
        for (let s = 0; s < match.p1.voters.length; s++) {
            await await db_1.updateProfile(match.p1.voters[s], "points", 2);
            await await db_1.updateProfile(match.p1.voters[s], "memesvoted", 1);
        }
        for (let t = 0; t < match.p2.voters.length; t++) {
            await await db_1.updateProfile(match.p2.voters[t], "points", 2);
            await await db_1.updateProfile(match.p2.voters[t], "memesvoted", 1);
        }
        let m = await channelid.messages.cache.first().mentions.users.first().id;
        let winnerid = (m === match.p1.userid ? `${t[1]}` : `${t[2]}`);
        if (channelid.topic) {
            if (match.p1.votes > match.p2.votes) {
                await challonge_1.matchwinner([`${t[0]}`, `${match.p1.votes}`, `${match.p2.votes}`, `${winnerid}`]);
            }
            if (match.p2.votes > match.p1.votes) {
                await challonge_1.matchwinner([`${t[0]}`, `${match.p2.votes}`, `${match.p1.votes}`, `${winnerid}`]);
            }
        }
    }
    try {
        await db_1.deleteReminder(await db_1.getReminder(match._id));
        await db_1.deleteReminder(await db_1.getReminder(match.p1.userid));
        await db_1.deleteReminder(await db_1.getReminder(match.p2.userid));
    }
    catch {
        console.log("fuck");
    }
    return;
}
exports.end = end;
async function qualend(client, id) {
    const match = await db_1.getSingularQuals(id);
    let s = "";
    for (let i = 0; i < match.players.length; i++) {
        s += `<@${match.players[i].userid}> `;
    }
    let channel = client.channels.cache.get(id);
    if (match.votingperiod) {
        if (match.playersdone.length <= 2 && match.playersdone.length >= 1) {
            let fields = [];
            for (let i = 0; i < match.votes.length; i++)
                if (match.players[i].memedone && match.playersdone.length === 2) {
                    fields.push({
                        name: `${await (await client.users.fetch(match.players[i].userid)).username}`,
                        value: `Finished with 50 | Earned: 50% of the votes\nUserID: ${match.players[i].userid}`
                    });
                }
                else if (match.players[i].memedone && match.playersdone.length === 1) {
                    fields.push({
                        name: `${await (await client.users.fetch(match.players[i].userid)).username}`,
                        value: `Finished with 100 | Earned: 100% of the votes\nUserID: ${match.players[i].userid}`
                    });
                }
                else if (match.players[i].memedone === false) {
                    fields.push({
                        name: `<@${await (await client.users.fetch(match.players[i].userid)).username}>-Failed`,
                        value: `Finished with ${0} | Earned: ${0}% of the votes\nUserID: ${match.players[i].userid}`
                    });
                }
            await db_1.deleteQuals(match);
            let c = client.channels.cache.get(channel.id);
            let m = (await c.messages.fetch({ limit: 100 })).last();
            let time = Math.floor(((Math.floor(m.createdTimestamp / 1000) + 259200) - Math.floor(Date.now() / 1000)) / 3600);
            if (time <= 72) {
                await channel.send(`${s} you have ${time}h left to complete Portion 2`);
            }
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
            let c = client.channels.cache.get(channel.id);
            let m = (await c.messages.fetch({ limit: 100 })).last();
            let time = Math.floor(((Math.floor(m.createdTimestamp / 1000) + 259200) - Math.floor(Date.now() / 1000)) / 3600);
            if (time <= 72) {
                await channel.send(`${s} you have ${time}h left to complete Portion 2`);
            }
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
                let name = `${await (await client.users.fetch(match.players[i].userid)).username} | Meme #${match.players.indexOf(match.players[i]) + 1}${match.players[i].memedone ? `` : `-Failed`}`;
                fields.push({
                    name: name,
                    value: `${match.players[i].memedone ? `Finished with ${match.votes[i].length} | Earned: ${Math.floor(match.votes[i].length / totalvotes * 100)}% of the votes\nUserID: ${match.players[i].userid}` : `Finished with ${0} | Earned: ${0}% of the votes\nUserID: ${match.players[i].userid}`}`,
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
            for (let i = 0; i < match.votes.length; i++) {
                for (let x = 0; x < match.votes[i].length; x++) {
                    await db_1.updateProfile(match.votes[i][x], "points", 2);
                    await db_1.updateProfile(match.votes[i][x], "memesvoted", 1);
                }
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
            try {
                await db_1.deleteReminder(await db_1.getReminder(match._id));
            }
            catch {
                console.log("fuck");
            }
            channel.send({
                embed: {
                    title: `Votes for ${channel.name} are in!`,
                    description: `${totalvotes} votes for this qualifier`,
                    fields,
                    color: "#d7be26",
                    timestamp: new Date()
                }
            }).then(async (message) => {
                var _a;
                console.log("This is msg id:", message);
                let t = (_a = channel.topic) === null || _a === void 0 ? void 0 : _a.split(" ");
                if (!t) {
                    await channel.setTopic(message.id);
                }
                else if (t.join("").toLowerCase() === "round1")
                    await channel.setTopic(message.id);
                else if (t.length === 1) {
                    let emm = await utils_1.resultadd(channel, client, [channel.topic.split(" ")[0], message.id]);
                    await channel.send({ embed: emm });
                    await (await client.channels.cache.get("722291182461386804"))
                        .send({ embed: emm });
                }
            });
            let c = client.channels.cache.get(channel.id);
            let m = (await c.messages.fetch({ limit: 100 })).last();
            let time = Math.floor(((Math.floor(m.createdTimestamp / 1000) + 259200) - Math.floor(Date.now() / 1000)) / 3600);
            if (time <= 72) {
                await channel.send(`${s} you have ${time}h left to complete Portion 2`);
            }
        }
    }
    else if (!match.votingperiod) {
        await db_1.deleteQuals(match);
        try {
            await db_1.deleteReminder(await db_1.getReminder(match._id));
        }
        catch {
            console.log("fuck");
        }
        return channel.send({
            embed: {
                title: `Votes for this qualifier are in!`,
                color: "#d7be26",
                description: "Match has ended early before voting period.\nPlease contact mod for information",
                timestamp: new Date()
            }
        });
    }
    await db_1.deleteReminder(await db_1.getReminder(channel.id));
    let qlist = await db_1.getMatchlist();
    let timestamp = parseInt(qlist.qualurl);
    if (Math.floor(Date.now() / 1000) - Math.floor(timestamp / 1000) > 0) {
        await channel.send(`Next portion has begun, and you have ${Math.floor((Math.floor(Date.now() / 1000) - Math.floor(timestamp / 1000)) / 3600)}h to complete it. Contact a ref to begin your portion!`);
    }
}
exports.qualend = qualend;
async function cancelmatch(message) {
    if (await db_1.getMatch(message.channel.id)) {
        await db_1.deleteActive(await db_1.getMatch(message.channel.id));
        try {
            await db_1.deleteReminder(await db_1.getReminder(message.channel.id));
        }
        catch (error) {
            console.log("");
        }
        return await message.reply("this match has been cancelled");
    }
    else if (await db_1.getQual(message.channel.id)) {
        await db_1.deleteQuals(await db_1.getQual(message.channel.id));
        try {
            await db_1.deleteReminder(await db_1.getReminder(message.channel.id));
        }
        catch (error) {
            console.log("");
        }
        return await message.reply("this qualifier has been cancelled");
    }
    else {
        return await message.reply("there are no matches");
    }
}
exports.cancelmatch = cancelmatch;
