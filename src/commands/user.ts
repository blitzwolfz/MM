import * as discord from "discord.js"
import { getProfile, addProfile, updateProfile, getAllProfiles } from "../misc/db"
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
            await updateProfile(user._id, "name", name)
        }

        let wr = 0;
        
        if(user.loss === 0 && user.wins === 0) wr = 0;
        
        else if(user.loss === 0) wr = 100;
        
        else if(user.wins === 0) wr = 0;
        else{
            wr = Math.floor(user.wins/(user.wins+user.loss)) * 100
        }

        let UserEmbed = new discord.MessageEmbed()
            .setTitle(`${user.name}`)
            .setThumbnail(user.img)
            .setColor("#d7be26")
            .addFields(
                { name: 'Total points', value: `${user.points}` },
                { name: 'Total wins', value: `${user.wins}` },
                { name: 'Total loss', value: `${user.loss}`  },
                { name: 'Total matches', value: `${user.wins+user.loss}` },
                { name: 'Win Rate', value: `${wr}%` },
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
            memesvoted:0,
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
            { name: 'Total points', value: `${0}` },
            { name: 'Total wins', value: `${0}` },
            { name: 'Total loss', value: `${0}`  },
            { name: 'Total matches', value: `${0} W/L` },
            { name: 'Win Rate', value: `${0}%` },
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
            memesvoted:0,
            points:0,
            wins: 0,
            loss: 0,
            img:User.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })
        }
        console.log("Added a new user profile")
        await addProfile(NewUser)
    }
}

export async function clearstats(message: discord.Message){

    let profiles = await getAllProfiles("memesvoted")

    for(let i = 0; i < profiles.length; i++){
        profiles[i].memesvoted = 0

        await updateProfile(profiles[i]._id, "memesvoted", -profiles[i].memesvoted)

        //await resetModProfile(profiles[i]._id, profiles[i])
    }

    await message.reply("Profiles have been cleared")

}