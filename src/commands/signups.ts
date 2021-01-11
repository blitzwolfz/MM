import * as Discord from "discord.js";
import { signups, matchlist } from "../misc/struct";
import { insertSignups, getSignups, updateSignup, getMatchlist } from "../misc/db";
import { backwardsFilter, forwardsFilter } from "../misc/utils";


export async function startsignup(message: Discord.Message, client: Discord.Client){
    if (message.member!.roles.cache.has('724818272922501190') 
    || message.member!.roles.cache.has('724818272922501190') 
    || message.member!.roles.cache.has('724832462286356590')){
        
        let newsignup:signups = {
            _id: 1,
            open: true,
            users: [],            
        }
        
        try{
            if(!await getSignups()){
                await insertSignups(newsignup)
                let em = new Discord.MessageEmbed()
                .setDescription("Match signups have started!"
                +"\nPlease use the command `!signup`"
                +"\nIf you wish to remove your signup use `!unsignup`"
                +"\nOf course if you have problems contact mods!")
                .setColor("#d7be26")
                .setTimestamp()

                let channel = <Discord.TextChannel> await client.channels.fetch("722284266108747880")

                await channel.send(em)
            }

            else{
                return message.reply("A signup is already active!")
            }

        }   catch(err) { 
            message.channel.send("```" + err + "```")
            return message.reply(", there is an error! Ping blitz and show him the error.")
        }
        
    }

    else{
        await (await client.users.fetch(message.author.id)).send("You aren't allowed to use that command!")
    }
}

export async function signup(message: Discord.Message, client: Discord.Client, id:string, dm:boolean = true){
    let signup = await getSignups()

    if(message.channel.type !== "dm" && dm === true){
        return message.reply("You have to signup in bot DM.");
    }

    else if(signup.users.includes(id) && dm === true){
        return message.reply("You already signed up!")
    }

    else if(signup.users.includes(id) && dm === false){
        (await client.users.fetch(id)).send("You already signed up!")
    }

    else if(signup.open === false && dm === true){
        return message.reply("signups are now closed! Contact mod if there is an issue.")
    }

    else{
        signup.users.push(id)

        await updateSignup(signup)

        await (await (await client.guilds!.cache.get("719406444109103117")!).members.fetch(id)).roles.add("731568704499875932")!

    }

    if(dm === true){
        return message.reply("You have been signed up!")
    }

    else{
        return (await client.users.fetch(id))?.send("You have been signed up!");
    }

}

export async function removesignup(message: Discord.Message){
    let signup = await getSignups()

    if(message.channel.type !== "dm"){
        return;
    }

    else if(!signup.users.includes(message.author.id)){
        return message.reply("You are not signed up!")
    }

    else{
        signup.users.splice(signup.users.indexOf(message.author.id), 1)
        console.log(signup.users)

        await updateSignup(signup)

        return message.reply("Your signup has been removed!")
    }
}

export async function closesignup(message: Discord.Message, client: Discord.Client){
    if (message.member!.roles.cache.has('724818272922501190')
        || message.member!.roles.cache.has('724818272922501190')
        || message.member!.roles.cache.has('724832462286356590')) {

        try {
            let signup = await getSignups()

            if(signup.open){
                let fields = [];
                for (let i = 0; i < signup.users.length; i++){
                    fields.push({
                        name: `${await (await client.users.fetch(signup.users[i])).username}`,
                        value: `Userid is: ${signup.users[i]}`,
                    });
                }
    
    
                let channel = <Discord.TextChannel> await client.channels.fetch("722291588922867772")
    
                let channel2 = <Discord.TextChannel> await client.channels.fetch("722284266108747880")
    
                channel.send({
                    embed: {
                        title: `Signup list`,
                        fields,
                        color: "#d7be26",
                        timestamp: new Date()
                    }
                });
    
                let em = new Discord.MessageEmbed()
                .setDescription("Match signups have now closed!"
                +"\nIf you wish to remove your signup "
                +"\nor if you have problems contact mods!")
                .setColor("#d7be26")
                .setTimestamp()
                signup.open = false
    
                await updateSignup(signup)
    
                return channel2.send(em)
            }

            else{
                return message.reply(", signups are closed!")
            }


            
        } catch (err) {
            message.channel.send("```" + err + "```")
            return message.reply(", there is an error! Ping blitz and show him the error.")
        }

    }

    else {
        await (await client.users.fetch(message.author.id)).send("You aren't allowed to use that command!")
    }
}

export async function reopensignup(message: Discord.Message, client: Discord.Client){
    if (message.member!.roles.cache.has('724818272922501190')
        || message.member!.roles.cache.has('724818272922501190')
        || message.member!.roles.cache.has('724832462286356590')) {

        try {
            let signup = await getSignups()

            if(!signup.open){
                signup.open = true
                await updateSignup(signup)
    
                let channel2 = <Discord.TextChannel> await client.channels.fetch("722284266108747880")
    
                let em = new Discord.MessageEmbed()
                .setDescription("Match signups have reopened!!"
                +"\nIf you wish to signup use `!signup`"
                +"\nIf you wish to remove your signup use `!removesignup`"
                +"\nOf course if you have problems contact mods!")
                .setColor("#d7be26")
                .setTimestamp()
    
                return channel2.send(em)
            }

            else{
                return message.reply(", signups are already open!")
            }
            
        } catch (err) {
            message.channel.send("```" + err + "```")
            return message.reply(", there is an error! Ping blitz and show him the error.")
        }

    }

    else {
        await (await client.users.fetch(message.author.id)).send("You aren't allowed to use that command!")
    }
}

export async function viewsignup(message: Discord.Message, client: Discord.Client) {
    if (message.member!.roles.cache.has('724818272922501190')
        || message.member!.roles.cache.has('724818272922501190')
        || message.member!.roles.cache.has('724832462286356590')) {

        try {

            let signup = await getSignups()

            if (signup.users) {
                let fields = [];
                for (let i = 0; i < signup.users.length; i++) {
                    fields.push({
                        name: `${await (await client.users.fetch(signup.users[i])).username}`,
                        value: `Userid is: ${signup.users[i]}`,
                    });
                }

                return message.channel.send({
                    embed: {
                        title: `Current Signup list`,
                        fields,
                        color: "#d7be26",
                        timestamp: new Date()
                    }
                });
            }

            else {
                return message.reply(", none signed up.")
            }

        } catch (err) {
            message.channel.send("```" + err + "```")
            return message.reply(", there is an error! Ping blitz and show him the error.")
        }

    }

    else {
        await (await client.users.fetch(message.author.id)).send("You aren't allowed to use that command!")
    }
}




export async function activeOffers(message: Discord.Message, client: Discord.Client, args: string[]) {
    let page: number = parseInt(args[0]) || 1
    let signups = await getSignups()
    const m = <Discord.Message>(await message.channel.send({ embed: await listEmbed(page!, client, signups) }));
    await m.react("⬅")
    await m.react("➡");

    const backwards = m.createReactionCollector(backwardsFilter, { time: 100000 });
    const forwards = m.createReactionCollector(forwardsFilter, { time: 100000 });

    backwards.on('collect', async () => {
        m.reactions.cache.forEach(reaction => reaction.users.remove(message.author.id));
        m.edit({ embed: await listEmbed(--page, client, signups)});
    });
    forwards.on('collect', async () => {
        m.reactions.cache.forEach(reaction => reaction.users.remove(message.author.id));
        m.edit({ embed: await listEmbed(++page, client, signups) });
    });
}

export async function matchlistEmbed(message: Discord.Message, client: Discord.Client) {
    let page: number = 1
    let signups = await getMatchlist()
    const m = <Discord.Message>(await message.channel.send({ embed: await listEmbed(page!, client, signups) }));
    await m.react("⬅")
    await m.react("➡");

    const backwards = m.createReactionCollector(backwardsFilter, { time: 100000 });
    const forwards = m.createReactionCollector(forwardsFilter, { time: 100000 });

    backwards.on('collect', async () => {
        m.reactions.cache.forEach(reaction => reaction.users.remove(message.author.id));
        m.edit({ embed: await listEmbed(--page, client, signups)});
    });
    forwards.on('collect', async () => {
        m.reactions.cache.forEach(reaction => reaction.users.remove(message.author.id));
        m.edit({ embed: await listEmbed(++page, client, signups) });
    });
}

async function listEmbed(page: number = 1, client: Discord.Client, signup: signups | matchlist){

    //let signup = await getSignups()
    let guild = client.guilds.cache.get("719406444109103117")

    page = page < 1 ? 1 : page;
    const fields = [];
    let index = (0 + page - 1) * 10
    for (let i = index; i < Math.min(index + 10, signup.users.length); ++i)
        fields.push({
            name: `${i+1}) ${(await (await guild!.members.fetch(signup.users[i])).nickname) || await (await client.users.fetch(signup.users[i])).username}`,
            value: `Userid is: ${signup.users[i]}`
        });

    return {
        title: `Signup List. You are on page ${page! || 1} of ${Math.floor(signup.users.length / 10) + 1}`,
        description: fields.length === 0 ?
            `There are no signups` :
            `All the signups!. Total Users: ${signup.users.length}`,
        fields,
        color: "#d7be26",
        timestamp: new Date()
    };
}

