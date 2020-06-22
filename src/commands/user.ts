import * as discord from "discord.js"
import { getUserProfile } from "../misc/db"
import { user } from "../misc/struct";


export async function stats(message: discord.Message, client: discord.Client){
    let args: Array<string> = message.content.slice(process.env.PREFIX!.length).trim().split(/ +/g);
    let user:user = await getUserProfile(message.mentions?.users?.first()?.id || args[0] || message.author.id)

    if (!user){
        return message.reply("That user profile does not exist! Please do `!create` to create your own user profile")
    }

    else{
        let UserEmbed = {
                description: `<@${message.author.id}> has submitted their meme`,
                timestamp: new Date()
        }
    }
}