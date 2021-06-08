import * as Discord from "discord.js"
import { getDoc, getProfile, gettemplatedb, getthemes, insertDoc, updateDoc, updateProfile, updatetemplatedb, updateThemedb } from "../misc/db"
import { backwardsFilter, forwardsFilter, getUser } from "../misc/utils"

export async function template(message: Discord.Message, client: Discord.Client, args:string[]) {
    let channel = <Discord.TextChannel>client.channels.cache.get("722291683030466621")

    if (message.attachments.size > 10 ) {//&& !args.includes("-mod")
        return message.reply("You can't submit more than ten images due to Discord limit.")
    }

    if (message.attachments.size > 1 && !args.includes("-mod")) {
        return message.reply("You can't submit more than ten images")
    }

    else if (message.attachments.size <= 0) {
        return message.reply("Your image was not submitted properly. Contact a mod")
    }

    else {

        if(!args.includes("-mod")){
            for (let i = 0; i < message.attachments.array().length; i++) {
                //await channel.send(`${message.attachments.array()[i].url}`)
    
                await channel.send(
                    new Discord.MessageEmbed()
                        .setTitle(`${message.author.username} has submitted a new template(s)`)
                        .setDescription(`<@${message.author.id}>`)
                        .setImage(message.attachments.array()[i].url)
                ).then(async message => {
                    await message.react('🏁')
                    await message.react('🗡️')
                }
                )
            }
    
            // updateProfile(message.author.id, "points", (message.attachments.array().length * 2))
            await message.reply(`Thank you for submitting templates. You will gain a maximum of ${message.attachments.array().length * 2} points if they are approved. You currently have ${(await getProfile(message.author.id)).points} points`)
        }

        else if(args.includes("-mod")){
            let id = await getUser(await message.author.id)
            let e = await gettemplatedb()

            for (let i = 0; i < message.attachments.array().length; i++){
                e.list.push(message.attachments.array()[i].url)
                if(id){
                    await updateProfile(id, "points", 2)
                } 

                let attach = new Discord.MessageAttachment(message.attachments.array()[i].url);
            
                (<Discord.TextChannel>await client.channels.fetch("724827952390340648")).send("New template:", attach)
            }

            await updatetemplatedb(e.list)

            return message.reply(`You gained ${message.attachments.array().length*2} points for submitting ${message.attachments.array().length} templates.`)
        }

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
        await message.channel.send(args.join(" "))
        let list: string[] = obj.list
        list.push(args.join(" "))

        list.sort()

        await updateThemedb({
            _id: "themelist",
            list: list
        })

        await message.reply("added theme.")
    }
}

export async function removeTheme(message: Discord.Message, client: Discord.Client, args: string[]) {
    if (!args) {
        return message.reply("Please give a number.")
    }

    else {
        let obj = await getthemes()

        let list: string[] = obj.list
        let word = list[parseInt(args[0])-1]
        list.splice(parseInt(args[0])-1, 1)
        
        list.sort()
        await updateThemedb({
            _id: "themelist",
            list: list
        })

        await message.reply(`removed theme of ${word}.`)
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
            if(ratings[i])
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

async function templatecheckembed(page: number = 1, client: Discord.Client, templist: string[], themes:boolean = false) {

    //let signup = await getSignups()
    //let guild = client.guilds.cache.get("719406444109103117")

    page = page < 0 ? 0 : page - 1;
    

    if(page > templist.length){
        page = 0
    }

    if(themes === false){
        return {
            title: `Template number ${page + 1}`,
            description:`Total amount is ${templist.length}`,
            image: {
                url: `${templist[page]}`,
            },
            color: "#d7be26",
            timestamp: new Date()
        };
    }

    if(themes === true){
        return {
            title: `Theme number ${page + 1}`,
            description:`${templist[page]}`,
            color: "#d7be26",
            timestamp: new Date()
        };
    }

}

export async function ttemplatecheck(message: Discord.Message, client: Discord.Client, args: string[]) {
    //@ts-ignore
    let page:number = typeof args[1] == "undefined" ? isNaN(parseInt(args[0])) ? 1 : parseInt(args[0]) : args[1];;
    let ratings = await gettemplatedb()
    let removelinks: string[] = []
    //let c = <Discord.TextChannel>message.channel
    const m = <Discord.Message>(await message.channel.send({ embed: await templatecheckembed(page!, client, ratings.list) }));
    await m.react("⬅")
    await m.react("➡");
    await m.react('🗡️')

    const backwards = m.createReactionCollector(backwardsFilter, { time: 300000 });
    const forwards = m.createReactionCollector(forwardsFilter, { time: 300000 });
    const remove = m.createReactionCollector(((reaction: { emoji: { name: string; }; }, user: Discord.User) => reaction.emoji.name === '🗡️' && !user.bot), { time: 300000 });

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
        await templatelinksremoved(removelinks)
        await message.reply(`Finished. Removed ${removelinks.length} templates`)
    })
}

export async function templatecheck(message: Discord.Message, client: Discord.Client, args: string[]) {
    let list = await (await gettemplatedb()).list
    let emotes = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"]
    const filter = (reaction: { emoji: { name: string; }; }, user: Discord.User) => {
        return emotes.includes(reaction.emoji.name) && !user.bot;
    };

    let struct:{
        msg:Discord.Message,
        tempstring:string,
        remove:boolean,
        position:number
    }[] = []

    let removelinks:string[] = []

    let doc:{
        _id:string,
        pos:number
    } = await getDoc("tempstruct", message.author.id)

    if(!doc){
        await insertDoc("tempstruct", {
            _id:message.author.id,
            pos:0
        })

        doc = {
            _id:message.author.id,
            pos:0
        }
    }

    if(doc.pos > list.length) doc.pos = 0;

    for(let i = doc.pos; i < doc.pos+10; i++){
        await message.channel.send(list[i]).then(async m => {
            struct.push({
                msg:m,
                tempstring:list[i], 
                remove:false,
                position:i,
            })
        })
    }

    const m = <Discord.Message>(
        await message.channel.send(
            new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setDescription("Click on the emotes 1 to 10 to select a template to remove.\nClick next arrow to go to the next 10 templates.")
        )
    );

    for(let l = 0; l < emotes.length; l++){
        m.react(emotes[l])
    }
    await m.react("➡");
    

    //const remove = m.createReactionCollector(((reaction: { emoji: { name: string; }; }, user: Discord.User) => reaction.emoji.name === '🗡️' && !user.bot), { time: 300000 });
    const forwards = m.createReactionCollector(forwardsFilter, { time: 300000 });
    const remove = m.createReactionCollector(filter, { time: 300000 });
    
    forwards.on('collect', async () => {
        m.reactions.cache.forEach(reaction => reaction.users.remove(message.author.id));

        // for(let i = struct[struct.length-1].position; i < list.slice(i).length; i++){
        //     struct
        // }
        for(let s of struct){
            s.msg.edit(list[s.position+10])
            s.tempstring = list[s.position+10]
            s.position += 10
        }

        doc.pos += 10

        await updateDoc("tempstruct", doc._id, doc)

    });

    remove.on('collect', async () => {
        
        m.reactions.cache.forEach(async reaction => {
            reaction.users.remove(message.author.id)
            
            if(reaction.count! >= 2 ){
                let pos = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"].indexOf(reaction.emoji.name)
                
    
                if(pos >= 0){
                    removelinks.push(struct[pos].tempstring)
                    
                }
            }
        })
        //removelinks.push(m.embeds[0].image?.url!)
        //m.reactions.message.channel.send(removelinks)
    });

    remove.on("end", async () => {
        await templatelinksremoved(removelinks)
        await message.reply(`Finished. Removed ${removelinks.length} templates`)
    })

}

async function templatelinksremoved(list:string[], themes:boolean = false) {
    let tempdb:Array<string> = []

    tempdb = await (await gettemplatedb()).list
    

    for(let x = 0; x < list.length; x++){
        let e = tempdb.findIndex(i => i === list[x])
        tempdb.splice(e, 1)
    }


    await updatetemplatedb(tempdb)
}