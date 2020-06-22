import * as discord from "discord.js"

export async function template(message: discord.Message, client:discord.Client){
    let channel = <discord.TextChannel>client.channels.cache.get("722291683030466621")

    if (message.attachments.size > 1){
        return message.reply("You can't submit more than one image")
    }
    
    else if(message.attachments.size <= 0){
        return message.reply("Your image was not submitted properly. Contact a mod")
    }

    else{
        await channel.send(
            {
                embed:{
                        description: `${message.author.username} has submitted a new template`,
                        color: "#d7be26",
                        timestamp: new Date()
                    }
                })
                
        await channel.send({ files: [new discord.MessageAttachment(message.attachments.array()[0].url)]})
    }
}