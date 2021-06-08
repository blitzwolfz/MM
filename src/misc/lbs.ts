import * as Discord from "discord.js";
import { getAllCockratings, getAllProfiles, getQuallist } from "./db";
import { cockratingInterface, user, quallist } from "./struct";
import { backwardsFilter, forwardsFilter } from "./utils";



export async function cockratingLB(message: Discord.Message, client: Discord.Client, args: string[]) {
    let page: number = parseInt(args[0]) || 1
    let ratings = await getAllCockratings()
    const m = <Discord.Message>(await message.channel.send({ embed: await ratingslistEmbed(page!, client, ratings, message.author.id) }));
    await m.react("⬅")
    await m.react("➡");

    const backwards = m.createReactionCollector(backwardsFilter, { time: 100000 });
    const forwards = m.createReactionCollector(forwardsFilter, { time: 100000 });

    backwards.on('collect', async () => {
        m.reactions.cache.forEach(reaction => reaction.users.remove(message.author.id));
        m.edit({ embed: await ratingslistEmbed(--page, client, ratings, message.author.id)});
    });
    forwards.on('collect', async () => {
        m.reactions.cache.forEach(reaction => reaction.users.remove(message.author.id));
        m.edit({ embed: await ratingslistEmbed(++page, client, ratings, message.author.id) });
    });
}

async function ratingslistEmbed(page: number = 1, client: Discord.Client, ratings: cockratingInterface[], ...rest:any[]){

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
            `Your rank is: ${ratings.findIndex(item => item._id == rest[0]) + 1}`,
        fields,
        color: "#d7be26",
        timestamp: new Date()
    };
}


export async function winningLB(message: Discord.Message, client: Discord.Client, args: string[]) {
    
    let symbol: "wins" | "points" | "loss" | "memesvoted" | "ratio"  = "wins"

    //@ts-ignore
    let page:number = typeof args[1] == "undefined" ? isNaN(parseInt(args[0])) ? 1 : parseInt(args[0]) : args[1];;


    switch (args[0]?.[0]) {
        case "p": symbol = "points"; break;
        case "r": symbol = "ratio"; break;
        case "l": symbol = "loss"; break;
        case "v": symbol = "memesvoted"; break;
        default: symbol = "wins";
    }
    let ratings = await getAllProfiles(symbol)

    const m = <Discord.Message>(await message.channel.send({ embed: await winlistEmbed(page!, client, ratings, message.author.id, (symbol)) }));
    await m.react("⬅")
    await m.react("➡");
    

    const backwards = m.createReactionCollector(backwardsFilter, { time: 100000 });
    const forwards = m.createReactionCollector(forwardsFilter, { time: 100000 });

    backwards.on('collect', async () => {
        m.reactions.cache.forEach(reaction => reaction.users.remove(message.author.id));
        m.edit({ embed: await winlistEmbed(--page, client, ratings, message.author.id, (symbol))});
    });
    forwards.on('collect', async () => {
        m.reactions.cache.forEach(reaction => reaction.users.remove(message.author.id));
        m.edit({ embed: await winlistEmbed(++page, client, ratings, message.author.id, (symbol)) });
    });
}

async function winlistEmbed(page: number = 1, client: Discord.Client, ratings: user[],...rest:any){

    //let signup = await getSignups()
    //let guild = client.guilds.cache.get("719406444109103117")

    page = page < 1 ? 1 : page;

    if(page > ratings.length){
        page = 0
    }
    const fields = [];
    let index = (0 + page - 1) * 10
    for (let i = index; i < index + 10; i++){

        let obj = ratings[i]
        try{
            let strr = "";
            if(rest[1] === "ratio"){
                let mat = Math.floor(obj.wins/(obj.wins+obj.loss) * 100)

                if(obj.wins + obj.loss === 0) mat = 0;

                strr += "Win Ratio: " + `${mat}`
            }

            else {
                //@ts-ignore
                strr += `${rest[1] === "memesvoted" ? "Memes voted on" : `${rest[1][0].toUpperCase()}${rest[1].substring(1)}`}: ${obj[rest[1]]}`
            }

            fields.push({
                name: `${i+1}) ${await (await client.users.fetch(ratings[i]._id)).username}`,
                //`${rest[1] === "memesvoted" ? "memesvoted" : rest[1]}`
                //@ts-ignore
                //value: `${rest[1] === "memesvoted" ? "Memes voted on" : `${rest[1][0].toUpperCase()}${rest[1].substring(1)}`}: ${obj[rest[1]]}`
                value: strr,
            });
        }
        catch{
            continue;
        }

    }


    return {
        title: `Leaderboard sorted by ${rest[1] === "votes" ? "Memes voted for" : rest[1]}. You are on page ${page! || 1} of ${Math.floor(ratings.length / 10) + 1}`,
        description: `Your rank is: ${ratings.findIndex(item => item._id == rest[0]) + 1}`,
        fields,
        color: "#d7be26",
        timestamp: new Date()
    };
}


export async function quallistGroups(message: Discord.Message, client: Discord.Client, args: string[]) {
    let page: number = parseInt(args[0]) || 1
    let ratings = await getQuallist()
    const m = <Discord.Message>(await message.channel.send({ embed: await quallistEmbed(page!, client, ratings) }));
    await m.react("⬅")
    await m.react("➡");

    const backwards = m.createReactionCollector(backwardsFilter, { time: 100000 });
    const forwards = m.createReactionCollector(forwardsFilter, { time: 100000 });

    backwards.on('collect', async () => {
        m.reactions.cache.forEach(reaction => reaction.users.remove(message.author.id));
        m.edit({ embed: await quallistEmbed(--page, client, ratings)});
    });
    forwards.on('collect', async () => {
        m.reactions.cache.forEach(reaction => reaction.users.remove(message.author.id));
        m.edit({ embed: await quallistEmbed(++page, client, ratings) });
    });
}

async function quallistEmbed(page: number = 1, client: Discord.Client, signup: quallist){

    //let signup = await getSignups()
    //let guild = client.guilds.cache.get("719406444109103117")

    page = page < 0 ? 0 : page - 1 ;
    const fields = [];    
    for (let i = 0; i < signup.users[page].length; i++){

        

        try{
            fields.push({
                name: `${i + 1}) ${await (await client.users.fetch(signup.users[page][i])).username}`,
                value: `Userid is: ${signup.users[page][i]}`
            });
        }
        catch{
            continue;
        }

    }

    


    return {
        title: `Qualifier Groups ${page! || 1} of ${Math.floor(signup.users.length)}`,
        description: fields.length === 0 ?
            `There are no groups` :
            `there are ${signup.users.length} groups`,
        fields,
        color: "#d7be26",
        timestamp: new Date()
    };
}
