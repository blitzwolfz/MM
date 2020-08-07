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
exports.modLB = exports.viewmodprofile = exports.createmodprofile = void 0;
const Discord = __importStar(require("discord.js"));
const db_1 = require("./db");
const utils_1 = require("./utils");
async function createmodprofile(message) {
    let user = await db_1.getModProfile(message.author.id);
    if (user) {
        return message.reply("That user profile does exist! Please do `!modstats` to check the user profile");
    }
    else if (!user) {
        let NewUser = {
            _id: message.author.id,
            modactions: 0,
            matchesstarted: 0,
            matchportionsstarted: 0
        };
        db_1.addModProfile(NewUser);
        await message.channel.send(new Discord.MessageEmbed()
            .setTitle(`${message.author.username}`)
            .setColor("#d7be26")
            .setThumbnail(`${message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })}`)
            .addFields({ name: 'Mod Actions', value: `${0}` }, { name: 'Total Matches Started', value: `${0}` }, { name: 'Match portions started', value: `${0}` }));
    }
}
exports.createmodprofile = createmodprofile;
async function viewmodprofile(message, client, args) {
    let user = await db_1.getModProfile(args[0] ? (message.mentions.users.first().id) : message.author.id);
    if (!user) {
        return message.reply("That user profile does not exist! Please do `!create` to create your own user profile");
    }
    else {
        await message.channel.send(new Discord.MessageEmbed()
            .setTitle(`${(await (await message.guild.members.fetch(user._id)).nickname) || await (await client.users.fetch(user._id)).username}`)
            .setColor("#d7be26")
            .setThumbnail(`${message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })}`)
            .addFields({ name: 'Mod Actions', value: `${user.modactions}` }, { name: 'Total Matches Started', value: `${user.matchesstarted}` }, { name: 'Match portions started', value: `${user.matchportionsstarted}` }));
    }
}
exports.viewmodprofile = viewmodprofile;
async function modLB(message, client, args) {
    let page = parseInt(args[1]) || 1;
    let ratings = await db_1.getAllModProfiles();
    if (args[0] === "modactions" || args[0] === "1") {
        ratings.sort((a, b) => (b.modactions) - (a.modactions));
        args[0] = "modactions";
    }
    else if (args[0] === "matchesstarted" || args[0] === "2") {
        ratings.sort((a, b) => (b.matchesstarted) - (a.matchesstarted));
        args[0] = "matchesstarted";
    }
    else if (args[0] === "matchportionsstarted" || args[0] === "3") {
        ratings.sort((a, b) => (b.matchportionsstarted) - (a.matchportionsstarted));
        args[0] = "matchportionsstarted";
    }
    else {
        return message.reply("Please enter a category for lb: modactions or 1 , matchesstarted or 2, matchportionsstarted or 3 ");
    }
    const m = (await message.channel.send({ embed: await modLb(page, client, ratings, args[0]) }));
    await m.react("⬅");
    await m.react("➡");
    const backwards = m.createReactionCollector(utils_1.backwardsFilter, { time: 100000 });
    const forwards = m.createReactionCollector(utils_1.forwardsFilter, { time: 100000 });
    backwards.on('collect', async () => {
        m.reactions.cache.forEach(reaction => reaction.users.remove(message.author.id));
        m.edit({ embed: await modLb(--page, client, ratings, args[0], message.author.id) });
    });
    forwards.on('collect', async () => {
        m.reactions.cache.forEach(reaction => reaction.users.remove(message.author.id));
        m.edit({ embed: await modLb(++page, client, ratings, args[0], message.author.id) });
    });
}
exports.modLB = modLB;
async function modLb(page = 1, client, ratings, args, ...rest) {
    let guild = client.guilds.cache.get("719406444109103117");
    page = page < 1 ? 1 : page;
    const fields = [];
    let index = (0 + page - 1) * 10;
    for (let i = index; i < Math.min(index + 10, ratings.length); ++i)
        fields.push({
            name: `${i + 1}) ${(await (await guild.members.fetch(ratings[i]._id)).nickname) || await (await client.users.fetch(ratings[i]._id)).username}`,
            value: (ratings[i])[args]
        });
    if (args === "modactions") {
        args = "Mod Actions";
    }
    else if (args === "matchesstarted") {
        args = "Matches Started";
    }
    else if (args === "matchportionsstarted") {
        args = "Match Portions Started";
    }
    return {
        title: `Mod Leaderboard for ${args}. You are on page ${page || 1} of ${Math.floor(ratings.length / 10) + 1}`,
        description: fields.length === 0 ?
            `There are no profiles` :
            `Your rank is: ${ratings.findIndex(item => item._id === rest[0]) + 2}`,
        fields,
        color: "#d7be26",
        timestamp: new Date()
    };
}
