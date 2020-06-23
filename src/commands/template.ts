import * as discord from "discord.js"

export async function template(message: discord.Message, client:discord.Client){
    let channel = <discord.TextChannel>client.channels.cache.get("722291683030466621")

    if (message.attachments.size > 10){
        return message.reply("You can't submit more than ten images")
    }
    
    else if(message.attachments.size <= 0){
        return message.reply("Your image was not submitted properly. Contact a mod")
    }

    else{
        await channel.send(
            {
                embed: {
                    description: `${message.author.username} has submitted a new template(s)`,
                    color: "#d7be26",
                    timestamp: new Date()
                }
            })
        for (let i = 0; i < message.attachments.array().length; i++) {
            await channel.send(`Template link is: ${message.attachments.array()[i].url}`)
        }
    }

}

export async function approvetemplate(message:discord.Message, client:discord.Client){
    let channel = <discord.TextChannel>client.channels.cache.get("724827952390340648")
    
    if (message.attachments.size > 10){
        return message.reply("You can't submit more than ten images")
    }
    
    else if(message.attachments.size <= 0){
        return message.reply("Your image was not submitted properly. Contact blitz")
    }

    else{
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