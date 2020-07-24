"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cockratingLB = void 0;
const db_1 = require("./db");
const utils_1 = require("./utils");
async function cockratingLB(message, client, args) {
    let page = parseInt(args[0]) || 1;
    let ratings = await db_1.getAllCockratings();
    ratings.sort((a, b) => (b.num) - (a.num));
    const m = (await message.channel.send({ embed: await ratingslistEmbed(page, client, ratings) }));
    await m.react("⬅");
    await m.react("➡");
    const backwards = m.createReactionCollector(utils_1.backwardsFilter, { time: 100000 });
    const forwards = m.createReactionCollector(utils_1.forwardsFilter, { time: 100000 });
    backwards.on('collect', async () => {
        m.reactions.cache.forEach(reaction => reaction.users.remove(message.author.id));
        m.edit({ embed: await ratingslistEmbed(--page, client, ratings) });
    });
    forwards.on('collect', async () => {
        m.reactions.cache.forEach(reaction => reaction.users.remove(message.author.id));
        m.edit({ embed: await ratingslistEmbed(++page, client, ratings) });
    });
}
exports.cockratingLB = cockratingLB;
async function ratingslistEmbed(page = 1, client, ratings) {
    let guild = client.guilds.cache.get("719406444109103117");
    page = page < 1 ? 1 : page;
    const fields = [];
    let index = (0 + page - 1) * 10;
    for (let i = index; i < Math.min(index + 10, ratings.length); ++i)
        fields.push({
            name: `${i + 1}) ${(await (await guild.members.fetch(ratings[i]._id)).nickname) || await (await client.users.fetch(ratings[i]._id)).username}`,
            value: `Cock rating is: ${100 === ratings[i].num ? `100% good cock` : `${ratings[i].num}/${100}`}`
        });
    return {
        title: `Cock Rating Leaderboard. You are on page ${page || 1} of ${Math.floor(ratings.length / 10) + 1}`,
        description: fields.length === 0 ?
            `There are no cockratings` :
            `Total Cock Ratings: ${ratings.length}`,
        fields,
        color: "#d7be26",
        timestamp: new Date()
    };
}