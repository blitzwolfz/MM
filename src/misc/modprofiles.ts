import * as Discord from "discord.js";
import { modprofile } from "./struct";
import { addModProfile, getModProfile, getAllModProfiles } from "./db";
import { backwardsFilter, forwardsFilter } from "./utils";

export async function createmodprofile(message: Discord.Message){
    let user:modprofile = await getModProfile(message.author.id)
    
    if(user){
        return message.reply("That user profile does exist! Please do `!modstats` to check the user profile")
    }

    else if(!user){
        let NewUser:modprofile = {
            _id: message.author.id,
            modactions: 0,
            matchesstarted: 0,
            matchportionsstarted: 0
        }

        addModProfile(NewUser)

       
        await message.channel.send(new Discord.MessageEmbed()
        .setTitle(`${message.author.username}`)
        .setColor("#d7be26")
        .setThumbnail(`${message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })}`)
        .addFields(
            { name: 'Mod Actions', value: `${0}` },
            { name: 'Total Matches Started', value: `${0}`  },
            { name: 'Match portions started', value: `${0}` }))
    
    }


}

export async function viewmodprofile(message: Discord.Message, client: Discord.Client, args: string[]){
    let user:modprofile = await getModProfile(args[0] ? (message.mentions.users.first()!.id): message.author.id)

    if (!user){
        return message.reply("That user profile does not exist! Please do `!create` to create your own user profile")
    }

    else{
        await message.channel.send(new Discord.MessageEmbed()
        .setTitle(`${(await (await message.guild!.members.fetch(user._id)).nickname) || await (await client.users.fetch(user._id)).username}`)
        .setColor("#d7be26")
        .setThumbnail(`${message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })}`)
        .addFields(
            { name: 'Mod Actions', value: `${user.modactions}` },
            { name: 'Total Matches Started', value: `${user.matchesstarted}`  },
            { name: 'Match portions started', value: `${user.matchportionsstarted}` }))
    }
}


export async function modLB(message: Discord.Message, client: Discord.Client, args: string[]) {
    let page: number = parseInt(args[0]) || 1
    let ratings = await getAllModProfiles()

    message.reply(args[0])

    if(args[0] === "modactions"){
        ratings.sort((a: modprofile, b: modprofile) => (b.modactions) - (a.modactions));
    }

    else if(args[0] === "matchesstarted"){
        ratings.sort((a: modprofile, b: modprofile) => (b.matchesstarted) - (a.matchesstarted));
    }

    else if(args[0] === "matchportionsstarted"){
        ratings.sort((a: modprofile, b: modprofile) => (b.matchportionsstarted) - (a.matchportionsstarted));
    }

    else{
        return message.reply("Please enter a category for lb: modactions, matchesstarted, matchportionsstarted ")
    }
    
    const m = <Discord.Message>(await message.channel.send({ embed: await modLb(page!, client, ratings, args[0]) }));
    await m.react("⬅")
    await m.react("➡");

    const backwards = m.createReactionCollector(backwardsFilter, { time: 100000 });
    const forwards = m.createReactionCollector(forwardsFilter, { time: 100000 });

    backwards.on('collect', async () => {
        m.reactions.cache.forEach(reaction => reaction.users.remove(message.author.id));
        m.edit({ embed: await modLb(--page, client, ratings, args[0])});
    });
    forwards.on('collect', async () => {
        m.reactions.cache.forEach(reaction => reaction.users.remove(message.author.id));
        m.edit({ embed: await modLb(++page, client, ratings, args[0]) });
    });
}

async function modLb(page: number = 1, client: Discord.Client, ratings: modprofile[], args:string){

    //let signup = await getSignups()
    let guild = client.guilds.cache.get("719406444109103117")

    page = page < 1 ? 1 : page;
    const fields = [];
    let index = (0 + page - 1) * 10

    for (let i = index; i < Math.min(index + 10, ratings.length); ++i)
        
        fields.push({
            name: `${i+1}) ${(await (await guild!.members.fetch(ratings[i]._id)).nickname) || await (await client.users.fetch(ratings[i]._id)).username}`,
            //@ts-expect-error
            value: (ratings[i])[args] 
        });

    return {
        title: `Mod Leaderboard for ${args}. You are on page ${page! || 1} of ${Math.floor(ratings.length / 10) + 1}`,
        description: fields.length === 0 ?
            `There are no profiles` :
            `Total profiles: ${ratings.length}`,
        fields,
        color: "#d7be26",
        timestamp: new Date()
    };
}

