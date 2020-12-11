"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quallistGroups = exports.winningLB = exports.cockratingLB = void 0;
const db_1 = require("./db");
const utils_1 = require("./utils");
async function cockratingLB(message, client, args) {
    let page = parseInt(args[0]) || 1;
    let ratings = await db_1.getAllCockratings();
    const m = (await message.channel.send({ embed: await ratingslistEmbed(page, client, ratings, message.author.id) }));
    await m.react("⬅");
    await m.react("➡");
    const backwards = m.createReactionCollector(utils_1.backwardsFilter, { time: 100000 });
    const forwards = m.createReactionCollector(utils_1.forwardsFilter, { time: 100000 });
    backwards.on('collect', async () => {
        m.reactions.cache.forEach(reaction => reaction.users.remove(message.author.id));
        m.edit({ embed: await ratingslistEmbed(--page, client, ratings, message.author.id) });
    });
    forwards.on('collect', async () => {
        m.reactions.cache.forEach(reaction => reaction.users.remove(message.author.id));
        m.edit({ embed: await ratingslistEmbed(++page, client, ratings, message.author.id) });
    });
}
exports.cockratingLB = cockratingLB;
async function ratingslistEmbed(page = 1, client, ratings, ...rest) {
    page = page < 1 ? 1 : page;
    const fields = [];
    let index = (0 + page - 1) * 10;
    for (let i = index; i < index + 10; i++) {
        try {
            fields.push({
                name: `${i + 1}) ${await (await client.users.fetch(ratings[i]._id)).username}`,
                value: `Cock rating is: ${100 === ratings[i].num ? `100% good cock` : `${ratings[i].num}/${100}`}`
            });
        }
        catch {
            continue;
        }
    }
    return {
        title: `Cock Rating Leaderboard. You are on page ${page || 1} of ${Math.floor(ratings.length / 10) + 1}`,
        description: fields.length === 0 ?
            `There are no cockratings` :
            `Your rank is: ${ratings.findIndex(item => item._id == rest[0]) + 1}`,
        fields,
        color: "#d7be26",
        timestamp: new Date()
    };
}
async function winningLB(message, client, args) {
    var _a;
    let symbol = "wins";
    let page = typeof args[1] == "undefined" ? isNaN(parseInt(args[0])) ? 1 : parseInt(args[0]) : args[1];
    ;
    switch ((_a = args[0]) === null || _a === void 0 ? void 0 : _a[0]) {
        case "p":
            symbol = "points";
            break;
        case "l":
            symbol = "loss";
            break;
        case "v":
            symbol = "memesvoted";
            break;
        default: symbol = "wins";
    }
    let ratings = await db_1.getAllProfiles(symbol);
    const m = (await message.channel.send({ embed: await winlistEmbed(page, client, ratings, message.author.id, (symbol)) }));
    await m.react("⬅");
    await m.react("➡");
    const backwards = m.createReactionCollector(utils_1.backwardsFilter, { time: 100000 });
    const forwards = m.createReactionCollector(utils_1.forwardsFilter, { time: 100000 });
    backwards.on('collect', async () => {
        m.reactions.cache.forEach(reaction => reaction.users.remove(message.author.id));
        m.edit({ embed: await winlistEmbed(--page, client, ratings, message.author.id, (symbol)) });
    });
    forwards.on('collect', async () => {
        m.reactions.cache.forEach(reaction => reaction.users.remove(message.author.id));
        m.edit({ embed: await winlistEmbed(++page, client, ratings, message.author.id, (symbol)) });
    });
}
exports.winningLB = winningLB;
async function winlistEmbed(page = 1, client, ratings, ...rest) {
    page = page < 1 ? 1 : page;
    if (page > ratings.length) {
        page = 0;
    }
    const fields = [];
    let index = (0 + page - 1) * 10;
    for (let i = index; i < index + 10; i++) {
        let obj = ratings[i];
        try {
            fields.push({
                name: `${i + 1}) ${await (await client.users.fetch(ratings[i]._id)).username}`,
                value: `${rest[1] === "memesvoted" ? "Memes voted on" : `${rest[1][0].toUpperCase()}${rest[1].substring(1)}`}: ${obj[rest[1]]}`
            });
        }
        catch {
            continue;
        }
    }
    return {
        title: `Leaderboard sorted by ${rest[1] === "votes" ? "Memes voted for" : rest[1]}. You are on page ${page || 1} of ${Math.floor(ratings.length / 10) + 1}`,
        description: `Your rank is: ${ratings.findIndex(item => item._id == rest[0]) + 1}`,
        fields,
        color: "#d7be26",
        timestamp: new Date()
    };
}
async function quallistGroups(message, client, args) {
    let page = parseInt(args[0]) || 1;
    let ratings = await db_1.getQuallist();
    const m = (await message.channel.send({ embed: await quallistEmbed(page, client, ratings) }));
    await m.react("⬅");
    await m.react("➡");
    const backwards = m.createReactionCollector(utils_1.backwardsFilter, { time: 100000 });
    const forwards = m.createReactionCollector(utils_1.forwardsFilter, { time: 100000 });
    backwards.on('collect', async () => {
        m.reactions.cache.forEach(reaction => reaction.users.remove(message.author.id));
        m.edit({ embed: await quallistEmbed(--page, client, ratings) });
    });
    forwards.on('collect', async () => {
        m.reactions.cache.forEach(reaction => reaction.users.remove(message.author.id));
        m.edit({ embed: await quallistEmbed(++page, client, ratings) });
    });
}
exports.quallistGroups = quallistGroups;
async function quallistEmbed(page = 1, client, signup) {
    page = page < 0 ? 0 : page - 1;
    const fields = [];
    let index = page * 10;
    console.log(page);
    console.log(index);
    for (let i = 0; i < signup.users[page].length; i++) {
        console.log(signup.users[page][i]);
        try {
            fields.push({
                name: `${i + 1}) ${await (await client.users.fetch(signup.users[page][i])).username}`,
                value: `Userid is: ${signup.users[page][i]}`
            });
        }
        catch {
            continue;
        }
    }
    console.log(fields);
    return {
        title: `Qualifier Groups ${page || 1} of ${Math.floor(signup.users.length / 10) + 1}`,
        description: fields.length === 0 ?
            `There are no groups` :
            `there are ${signup.users.length} groups`,
        fields,
        color: "#d7be26",
        timestamp: new Date()
    };
}
