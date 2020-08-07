import * as Discord from "discord.js";
import { getAllCockratings } from "./db";
import { cockratingInterface } from "./struct";
import { backwardsFilter, forwardsFilter } from "./utils";



export async function cockratingLB(message: Discord.Message, client: Discord.Client, args: string[]) {
    let page: number = parseInt(args[0]) || 1
    let ratings = await getAllCockratings()
    const m = <Discord.Message>(await message.channel.send({ embed: await ratingslistEmbed(page!, client, ratings) }));
    await m.react("⬅")
    await m.react("➡");

    const backwards = m.createReactionCollector(backwardsFilter, { time: 100000 });
    const forwards = m.createReactionCollector(forwardsFilter, { time: 100000 });

    backwards.on('collect', async () => {
        m.reactions.cache.forEach(reaction => reaction.users.remove(message.author.id));
        m.edit({ embed: await ratingslistEmbed(--page, client, ratings)});
    });
    forwards.on('collect', async () => {
        m.reactions.cache.forEach(reaction => reaction.users.remove(message.author.id));
        m.edit({ embed: await ratingslistEmbed(++page, client, ratings) });
    });
}

async function ratingslistEmbed(page: number = 1, client: Discord.Client, ratings: cockratingInterface[]){

    //let signup = await getSignups()
    //let guild = client.guilds.cache.get("719406444109103117")

    page = page < 1 ? 1 : page;
    const fields = [];
    let index = (0 + page - 1) * 10
    for (let i = index; i < index + 10; i++){

        try{
            fields.push({
                name: `${i+1}) ${await (await client.users.fetch(ratings[i]._id)).username}`,
                value: `Cock rating is: ${100 === ratings[i].num ? `100% good cock` : `${ratings[i].num}/${100}`}`
            });
        }
        catch{
            continue;
        }

    }


    return {
        title: `Cock Rating Leaderboard. You are on page ${page! || 1} of ${Math.floor(ratings.length / 10) + 1}`,
        description: fields.length === 0 ?
            `There are no cockratings` :
            `Total Cock Ratings: ${ratings.length}`,
        fields,
        color: "#d7be26",
        timestamp: new Date()
    };
}
