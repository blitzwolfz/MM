import * as discord from "discord.js"
import { getProfile, addProfile, updateProfile } from "../misc/db"
import { user } from "../misc/struct";


export async function stats(message: discord.Message, client: discord.Client){
    let args: Array<string> = message.content.slice(process.env.PREFIX!.length).trim().split(/ +/g);
    let user:user = await getProfile(args[1] ? (message.mentions.users.first()!.id): message.author.id)//message.mentions?.users?.first()?.id || args[0] || 
    let imgurl = args[1] ? (client.users.cache.get(message.mentions.users.first()!.id)!.displayAvatarURL()): message.author.displayAvatarURL()
    let name = args[1] ? (client.users.cache.get(message.mentions.users.first()!.id)!.username): message.author.username
    if (!user){
        return message.reply("That user profile does not exist! Please do `!create` to create your own user profile")
    }

    else if(user){

        if (imgurl !== user.img || name !== user.name){
            user.img = imgurl
            user.name = name
            await updateProfile(user._id, "img", imgurl)
            await updateProfile(user._id, "img", name)
        }

        let UserEmbed = new discord.MessageEmbed()
            .setTitle(`${user.name}`)
            .setThumbnail(user.img)
            .setColor("#d7be26")
            .addFields(
                { name: 'Total points', value: `${user.points}` },
                { name: 'Total wins', value: `${user.wins}` },
                { name: 'Total loss', value: `${user.loss}`  },
                { name: 'Win/Loss Ratio', value: `${(Math.floor(user.wins/user.loss))} W/L` },
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
            name:message.author.username,
            points:0,
            wins: 0,
            loss: 0,
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

export async function createAtUsermatch(User: discord.User){
    let newuser:user = await getProfile(User.id)
    
    if(newuser){
        return;
    }

    else if(!newuser){
        let NewUser:user = {
            _id: User.id,
            name:User.username,
            points:0,
            wins: 0,
            loss: 0,
            img:User.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })
        }
        console.log("Added a new user profile")
        await addProfile(NewUser)
    }
}