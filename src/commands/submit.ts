import * as Discord from "discord.js";
import { activematch, qualmatch } from "../misc/struct";
import { updateQuals, updateActive, getActive, getQuals, deleteReminder, getReminder, updateReminder } from "../misc/db";


export async function submit(message: Discord.Message, client: Discord.Client) {
    
    if(message.content.includes("imgur")){
        return message.reply("You can't submit imgur links")
    }

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

        let matches: activematch[] = await getActive()

        for (const match of matches){
            if((match.p1.userid === message.author.id) && !match.p1.memedone && !match.p1.memelink.length){
                match.p1.memelink = (message.attachments.array()[0].url)
                match.p1.memedone = true

                if(match.split){
                    match.p1.donesplit = true
                }

                if(match.exhibition === false){
                    await (<Discord.TextChannel>client.channels.cache.get("722616679280148504")).send({
                        embed:{
                            description: `<@${message.author.id}> has submitted their meme\nChannel: <#${match.channelid}>`,
                            color: "#d7be26",
                            timestamp: new Date()
                        }
                    });
    
                    await (<Discord.TextChannel>client.channels.cache.get("793242781892083742")).send({
                                    
                        embed:{
                            description: `<@${message.author.id}>  ${message.author.tag} has submitted their meme\nChannel: <#${match.channelid}>`,
                            color:"#d7be26",
                            image: {
                                url: message.attachments.array()[0].url,
                            },
                            timestamp: new Date()
                        }
                    });

                }

                
                message.reply("Your meme has been attached!")

                if(match.p1.donesplit && match.p2.donesplit && match.split){
                    console.log("not a split match")
                    match.split = false
                    match.p1.time = Math.floor(Date.now() / 1000) - 3200
                    match.p2.time = Math.floor(Date.now() / 1000) - 3200

                    await deleteReminder(await getReminder(match.channelid))

                    // match.votingperiod = true
                    // match.votetime = Math.floor(Date.now() / 1000)
                }
                await updateActive(match)

                

                try {
                    await deleteReminder(await getReminder(match.p1.userid))
                    let r = await getReminder(match.channelid)

                    r.mention = `<@${match.p2.userid}>`

                    await updateReminder(r)
                } catch (error) {
                    console.log("")
                }

                return;
            }

            if((match.p2.userid === message.author.id) && !match.p2.memedone && !match.p2.memelink.length){

                match.p2.memelink = (message.attachments.array()[0].url)
                match.p2.memedone = true

                if(match.split){
                    match.p2.donesplit = true
                }
                
                if(match.exhibition === false){
                    await (<Discord.TextChannel>client.channels.cache.get("722616679280148504")).send({
                        embed:{
                            description: `<@${message.author.id}> has submitted their meme\nChannel: <#${match.channelid}>`,
                            color: "#d7be26",
                            timestamp: new Date()
                        }
                    });
    
                    await (<Discord.TextChannel>client.channels.cache.get("793242781892083742")).send({
                                    
                        embed:{
                            description: `<@${message.author.id}>/${message.author.tag}\nhas submitted their meme\nChannel: <#${match.channelid}>`,
                            color:"#d7be26",
                            image: {
                                url: message.attachments.array()[0].url,
                            },
                            timestamp: new Date()
                        }
                    });

                    await deleteReminder(await getReminder(match.p2.userid))
                    
                }
                message.reply("Your meme has been attached!")

                if(match.p1.donesplit && match.p2.donesplit && match.split){
                    console.log("not a split match")
                    match.split = false
                    match.p1.time = Math.floor(Date.now() / 1000) - 3200
                    match.p2.time = Math.floor(Date.now() / 1000) - 3200

                    await deleteReminder(await getReminder(match.channelid))
                    // match.votingperiod = true
                    // match.votetime = Math.floor(Date.now() / 1000)
                }


                
                await updateActive(match)

                try {
                    await deleteReminder(await getReminder(match.p2.userid))
                    let r = await getReminder(match.channelid)

                    r.mention = `<@${match.p1.userid}>`

                    await updateReminder(r)
                } catch (error) {
                    console.log("")
                }


                return;
            }
        }
    }
}

export async function qualsubmit(message: Discord.Message, client: Discord.Client) {

    

    if(message.content.includes("imgur")){
        return message.reply("You can't submit imgur links")
    }

    if (message.attachments.size > 1){
        return message.reply("You can't submit more than one image")
    }
    
    else if(message.attachments.size <= 0){
        return message.reply("Your image was not submitted properly. Contact a mod")
    }

    else if(message.channel.type !== "dm"){
        return message.reply("You didn't not submit this in the DM with the bot.\nPlease delete and try again.")
    }
    
    else if(message.attachments.array()[0].url.toString().includes("mp4")) return message.reply("Video submissions aren't allowed")

    else{
        let matches: qualmatch[] = await getQuals()

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
                            await (<Discord.TextChannel>client.channels.cache.get("722616679280148504")).send({
                                embed:{
                                    description: `<@${message.author.id}> has submitted their meme\nChannel: <#${match.channelid}>`,
                                    color:"#d7be26",
                                    timestamp: new Date()
                                }
                            });

                            await (<Discord.TextChannel>client.channels.cache.get("793242781892083742")).send({
                                
                                embed:{
                                    description: `<@${message.author.id}>  ${message.author.tag} has submitted their meme\nChannel: <#${match.channelid}>`,
                                    color:"#d7be26",
                                    image: {
                                        url: message.attachments.array()[0].url,
                                    },
                                    timestamp: new Date()
                                }
                            });

                            player.memedone = true

                            try {
                                let r = await getReminder(match.channelid)

                                r.mention = r.mention.replace(`<@${message.author.id}>`, "")
            
                                await updateReminder(r)
                            } catch (error) {
                                console.log("")
                            }



                            await updateQuals(match)
                            return;
                        }
                    }

                }

            }
        }
    }
}
