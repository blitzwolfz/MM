import * as Discord from "discord.js";
import { activematch, qualmatch } from "../misc/struct";
import { updateQuals, updateActive, getActive, getQuals } from "../misc/db";


export async function submit(message: Discord.Message, client: Discord.Client) {
    let matches: activematch[] = await getActive()
    if (message.attachments.size > 1){
        return message.reply("You can't submit more than one image")
    }
    
    else if(message.attachments.size <= 0){
        return message.reply("Your image was not submitted properly. Contact a mod")
    }

    else if(message.channel.type !== "dm"){
        return message.reply("You didn't not submit this in the DM with the bot.\nPlease delete and try again.")
    }

    else{
        if(message.attachments.array()[0].url.toString().includes("mp4")) return message.reply("Video submissions aren't allowed")
        for (const match of matches){
            if(match.p1.userid === message.author.id && !match.p1.memedone){
                match.p1.memedone = true
                match.p1.memelink = message.attachments.array()[0].url
                if(match.split){
                    match.p1.donesplit = true
                }
                await (<Discord.TextChannel>client.channels.cache.get(match.channelid)).send({
                    embed:{
                        description: `<@${message.author.id}> has submitted their meme`,
                        color: "#d7be26",
                        timestamp: new Date()
                    }
                });
                message.reply("Your meme has been attached!")

                if(match.p1.donesplit && match.p2.donesplit){
                    match.split = false
                    // match.votingperiod = true
                    // match.votetime = Math.floor(Date.now() / 1000)
                }
                await updateActive(match)
                return;
            }

            if(match.p2.userid === message.author.id && !match.p2.memedone){
                match.p2.memedone = true
                match.p2.memelink = message.attachments.array()[0].url

                if(match.split){
                    match.p2.donesplit = true
                }
                
                await (<Discord.TextChannel>client.channels.cache.get(match.channelid)).send({
                    embed:{
                        description: `<@${message.author.id}> has submitted their meme`,
                        color: "#d7be26",
                        timestamp: new Date()
                    }
                });
                message.reply("Your meme has been attached!")

                if(match.p1.donesplit && match.p2.donesplit){
                    match.split = false
                    // match.votingperiod = true
                    // match.votetime = Math.floor(Date.now() / 1000)
                }
                await updateActive(match)
                return;
            }
        }
    }
}

export async function qualsubmit(message: Discord.Message, client: Discord.Client) {

    let matches: qualmatch[] = await getQuals()

    if (message.attachments.size > 1){
        return message.reply("You can't submit more than one image")
    }
    
    else if(message.attachments.size <= 0){
        return message.reply("Your image was not submitted properly. Contact a mod")
    }

    else if(message.channel.type !== "dm"){
        return message.reply("You didn't not submit this in the DM with the bot.\nPlease delete and try again.")
    }

    else{
        for (const match of matches){
            for(let player of match.players){
                if(player.split === true || match.split === false){
                    if(player.memedone === false){
                        if(player.userid === message.author.id){
                            player.memedone = true;
                            player.memelink = message.attachments.array()[0].url;
                            player.split = false
                            
                            if(!match.playersdone.includes(message.author.id)){
                                match.playersdone.push(message.author.id)
                            }
                            
                            // if(match.playersdone.length == match.players.length){
                            //     match.split = false
                            //     match.votingperiod = true
                            //     match.votetime = Math.floor(Date.now() / 1000)
                            // }
                            await message.reply("You meme has been attached!")
                            await (<Discord.TextChannel>client.channels.cache.get(match.channelid)).send({
                                embed:{
                                    description: `<@${message.author.id}> has submitted their meme`,
                                    color:"#d7be26",
                                    timestamp: new Date()
                                }
                            });
                            player.memedone = true
                            await updateQuals(match)
                            return;
                        }
                    }

                }

            }
        }
    }
}
