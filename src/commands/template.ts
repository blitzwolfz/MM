import * as Discord from "discord.js"
import { gettemplatedb, getthemes, updatedoc, updateProfile } from "../misc/db"
import { backwardsFilter, forwardsFilter } from "../misc/utils"

export async function template(message: Discord.Message, client: Discord.Client) {
    let channel = <Discord.TextChannel>client.channels.cache.get("722291683030466621")

    if (message.attachments.size > 10) {
        return message.reply("You can't submit more than ten images")
    }

    else if (message.attachments.size <= 0) {
        return message.reply("Your image was not submitted properly. Contact a mod")
    }

    else {
        // await channel.send(
        //     {
        //         embed: {
        //             description: `${message.author.username} has submitted a new template(s)`,
        //             color: "#d7be26",
        //             timestamp: new Date()
        //         }
        //     })
        for (let i = 0; i < message.attachments.array().length; i++) {
            //await channel.send(`${message.attachments.array()[i].url}`)

            await channel.send(
                new Discord.MessageEmbed()
                    .setTitle(`${message.author.username} has submitted a new template(s)`)
                    .setImage(message.attachments.array()[i].url)
            ).then(async message => {
                await message.react('🏁')
                await message.react('🗡️')
            }
            )
        }

        updateProfile(message.author.id, "points", (message.attachments.array().length * 2))
        await message.reply(`Thank you for submitting templates. You gained ${message.attachments.array().length * 2} points`)

    }

}

export async function approvetemplate(message: Discord.Message, client: Discord.Client) {
    let channel = <Discord.TextChannel>client.channels.cache.get("724827952390340648")

    if (message.attachments.size > 10) {
        return message.reply("You can't submit more than ten images")
    }

    else if (message.attachments.size <= 0) {
        return message.reply("Your image was not submitted properly. Contact blitz")
    }

    else {
        await channel.send(
            {
                embed: {
                    description: `${message.author.username} has approved a new template(s)`,
                    color: "#d7be26",
                    timestamp: new Date()
                }
            })
        for (let i = 0; i < message.attachments.array().length; i++) {
            await channel.send(`Approved link is: ${message.attachments.array()[i].url}`)
        }
    }

}

export async function addTheme(message: Discord.Message, client: Discord.Client, args: string[]) {

    if (!args) {
        return message.reply("Please give a theme.")
    }

    else {
        let obj = await getthemes()
        console.log(obj)
        await message.channel.send(args.join(" "))

        let list: string[] = obj.list
        console.log(list)
        //await message.channel.send(list)

        list.push(args.join(" "))
        console.log(list)

        await updatedoc({
            _id: "themelist",
            list: list
        })

        await message.reply("added theme.")
    }
}

export async function removeTheme(message: Discord.Message, client: Discord.Client, args: string[]) {
    if (!args) {
        return message.reply("Please give a theme.")
    }

    else {
        let obj = await getthemes()

        let list: string[] = obj.list
        //let word = 
        let index = list.findIndex(ele => ele === args.join(" "))
        list.splice(index, 1)
        console.log(list)

        await updatedoc({
            _id: "themelist",
            list: list
        })

        await message.reply("removed theme.")
    }
}

export async function themelistLb(message: Discord.Message, client: Discord.Client, args: string[]) {
    let page: number = parseInt(args[0]) || 1
    let obj = (await (await getthemes()).list)
    const m = <Discord.Message>(await message.channel.send({ embed: await themelistEmbed(page!, client, obj, message.author.id) }));
    await m.react("⬅")
    await m.react("➡");

    const backwards = m.createReactionCollector(backwardsFilter, { time: 100000 });
    const forwards = m.createReactionCollector(forwardsFilter, { time: 100000 });

    backwards.on('collect', async () => {
        m.reactions.cache.forEach(reaction => reaction.users.remove(message.author.id));
        m.edit({ embed: await themelistEmbed(--page, client, obj) });
    });
    forwards.on('collect', async () => {
        m.reactions.cache.forEach(reaction => reaction.users.remove(message.author.id));
        m.edit({ embed: await themelistEmbed(++page, client, obj) });
    });
}

async function themelistEmbed(page: number = 1, client: Discord.Client, ratings: string[], ...rest: any[]) {

    //let signup = await getSignups()
    //let guild = client.guilds.cache.get("719406444109103117")

    page = page < 1 ? 1 : page;
    const fields = [];
    let index = (0 + page - 1) * 10
    for (let i = index; i < index + 10; i++) {

        try {
            fields.push({
                name: `Theme #${i + 1}`,
                value: `${ratings[i]}`
            });
        }
        catch {
            continue;
        }

    }


    return {
        title: `Theme List`,
        description: `Total amount of themes: ${ratings.length + 1}. You are on page ${page! || 1} of ${Math.floor(ratings.length / 10) + 1}`,
        fields,
        color: "#d7be26",
        timestamp: new Date()
    };
}

async function templatecheckembed(page: number = 1, client: Discord.Client, templist: string[]) {

    //let signup = await getSignups()
    //let guild = client.guilds.cache.get("719406444109103117")

    page = page < 0 ? 0 : page - 1;
    

    if(page > templist.length){
        page = 0
    }

    return {
        title: `Template number ${page + 1}`,
        image: {
            url: `${templist[page]}`,
        },
        color: "#d7be26",
        timestamp: new Date()
    };
}

export async function templatecheck(message: Discord.Message, client: Discord.Client, args: string[]) {
    //@ts-ignore
    let page:number = typeof args[1] == "undefined" ? isNaN(parseInt(args[0])) ? 1 : parseInt(args[0]) : args[1];;
    let ratings = await gettemplatedb()
    let removelinks: string[] = []
    let c = <Discord.TextChannel>message.channel
    const m = <Discord.Message>(await message.channel.send({ embed: await templatecheckembed(page!, client, ratings.list) }));
    await m.react("⬅")
    await m.react("➡");
    await m.react('🗡️')

    const backwards = m.createReactionCollector(backwardsFilter, { time: 500000 });
    const forwards = m.createReactionCollector(forwardsFilter, { time: 500000 });
    const remove = m.createReactionCollector(((reaction: { emoji: { name: string; }; }, user: Discord.User) => reaction.emoji.name === '🗡️' && !user.bot), { time: 15000 });

    backwards.on('collect', async () => {
        m.reactions.cache.forEach(reaction => reaction.users.remove(message.author.id));
        m.edit({ embed: await templatecheckembed(--page, client, ratings.list) });
    });
    forwards.on('collect', async () => {
        m.reactions.cache.forEach(reaction => reaction.users.remove(message.author.id));
        m.edit({ embed: await templatecheckembed(++page, client, ratings.list) });
    });

    remove.on('collect', async () => {
        m.reactions.cache.forEach(reaction => reaction.users.remove(message.author.id))
        removelinks.push(m.embeds[0].image?.url!)
        //m.reactions.message.channel.send(removelinks)
    });

    remove.on("end", async () => {
        var fs = require('fs');

        var file = fs.createWriteStream('array.txt');
        file.on('error', function(err:any) { console.log(err)});

        removelinks.forEach(function(v:any) { file.write(v + '\n'); });


        file.end();

        
        const attachment = new Discord.MessageAttachment(file);

        await c.send(attachment)
        forwards.on("end", async () => {})
        backwards.on("end", async () => {})
        await m.reactions.message.delete()

    })
}