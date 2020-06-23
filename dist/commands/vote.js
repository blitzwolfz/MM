"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.polls = void 0;
const db_1 = require("../misc/db");
async function polls(messageReaction, user, client) {
    let channel = client.channels.cache.get(messageReaction.message.channel.id);
    let match = await db_1.getMatch(channel.id);
    if (match) {
        if (match.channelid === channel.id) {
            if (user.id === match.p1.userid || user.id === match.p2.userid) {
                if (messageReaction.emoji.name === "🅱️") {
                    await messageReaction.message.react("🅱️");
                    await messageReaction.users.remove(user.id);
                    return await user.send("Can't vote on your own match");
                }
                if (messageReaction.emoji.name === "🅰️") {
                    await messageReaction.message.react("🅰️");
                    await messageReaction.users.remove(user.id);
                    return await user.send("Can't vote on your own match");
                }
            }
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
exports.polls = polls;
