import * as Discord from "discord.js";
import { signups } from "../misc/struct";
import { insertSignups, getSignups, updateSignup } from "../misc/db";


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

                channel.send(em)
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

export async function signup(message: Discord.Message){
    let signup = await getSignups()

    if(message.channel.type !== "dm"){
        return;
    }

    else if(signup.users.includes(message.author.id)){
        return message.reply("You already signed up!")
    }

    else if(signup.open === false){
        return message.reply("Signups are now closed!")
    }

    else{
        signup.users.push(message.author.id)

        await updateSignup(signup)

        return message.reply("You have been signed up!")
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