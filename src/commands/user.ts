import * as discord from "discord.js"
import { getProfile, addProfile } from "../misc/db"
import { user } from "../misc/struct";


export async function stats(message: discord.Message, client: discord.Client){
    let args: Array<string> = message.content.slice(process.env.PREFIX!.length).trim().split(/ +/g);
    let user:user = await getProfile(args[1] ? (message.mentions.users.first()!.id): message.author.id)//message.mentions?.users?.first()?.id || args[0] || 
    console.log(client.user?.avatarURL({ format: 'png'}))
    console.log(user)
    if (!user){
        return message.reply("That user profile does not exist! Please do `!create` to create your own user profile")
    }

    else if(user){
        let UserEmbed = new discord.MessageEmbed()
            .setTitle(`${message.author.username}`)
            .setThumbnail(`${user.img}`)
            .setColor("#d7be26")
            .addFields(
                { name: 'Total wins', value: `${user.wins}` },
                { name: 'Total loss', value: `${user.loss}`  },
                { name: 'Win/Loss Ratio', value: `${(user.WL)*100}` },
            )
        
        await message.channel.send(UserEmbed)
    }
}

export async function createrUser(message: discord.Message){
    let user:user = await getProfile(message.author.id)
    
    if(user){
        return message.reply("That user profile does exist! Please do `!stats` to check the user profile")
    }

    else if(!user){
        let NewUser:user = {
            _id: message.author.id,
            wins: 0,
            loss: 0,
            WL: 0,
            img:message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })
        }

        addProfile(NewUser)

       
        await message.channel.send(new discord.MessageEmbed()
        .setTitle(`${message.author.username}`)
        .setColor("#d7be26")
        .setThumbnail(`${message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })}`)
        .addFields(
            { name: 'Total wins', value: `${0}` },
            { name: 'Total loss', value: `${0}`  },
            { name: 'Win/Loss Ratio', value: `${0}` },
        ))
    }
}