import * as discord from "discord.js"
import { emojis } from "../misc/utils"
import { qualend } from "./winner"
import { deleteReminder, getReminder, insertReminder, updateQuals} from "../misc/db"
import { qualmatch, reminder } from "../misc/struct"


export async function qualrunn(match: qualmatch, channelid: string, client: discord.Client) {
    // let match = await getSingularQuals(channelid)

    let channel = <discord.TextChannel>client.channels.cache.get(channelid)
    
    
    
    
    if(!match) {
        
        return;
    }
    

    if(match.votingperiod === false){
        
        
        if(!match.split){
            
            if(Math.floor(Date.now() / 1000) - match.octime > 1800 || match.playersdone.length === match.playerids.length){

                if(match.playersdone.length <= 2){
                    match.votingperiod = true
                    await updateQuals(match)
                    return await qualend(client, channel.id)
                }

                match = qualplayershuffle(match)

                //await updateQuals(match)

                if(match.istheme === false){
                    await channel.send(new discord.MessageEmbed()
                    .setTitle("Template")
                    .setImage(match.template[0])
                    .setColor("#07da63")
                    .setTimestamp())

                    await channel.send(new discord.MessageEmbed()
                    .setTitle("Template")
                    .setImage(match.template[1])
                    .setColor("#07da63")
                    .setTimestamp())
                }
                
                for(let player of match.players){
                    if(player.memedone){
                        let embed = new discord.MessageEmbed()
                            .setTitle(`Meme #${match.players.indexOf(player) + 1}`)
                            .setColor("#d7be26")
                            .setImage(player.memelink)
                            .setTimestamp()
                        
                        await channel.send(embed)
                    }
    
                    else if(!player.memedone){
                            
                            await (<discord.TextChannel>client.channels.cache.get("722616679280148504"))
                            .send(new discord.MessageEmbed()
                            .setDescription(`<@${player.userid}> has failed to submit a meme`)
                            .setColor("#d7be26")
                            .setTimestamp())
                    }
                }
    
                let em = new discord.MessageEmbed()
                    .setDescription("Please vote by clicking the number emotes.\nHit the recycle emote to reset votes")
                    .setColor("#d7be26")
                    .setTimestamp()
    
                channel.send(em).then(async msg => {
                    for (let i = 0; i < match.playerids.length; i++) {
                        await msg.react(emojis[i])
                    }
                    await msg.react(emojis[6])
                })
    
                match.votetime = Math.floor(Date.now() / 1000)
                match.votingperiod = true

                if (match.template.length > 0 && match.istheme || match.template && match.istheme) {
                    await channel.send("\n\nThe theme is: " + match.template)
                    //await user.send({ files: [new discord.MessageAttachment(match.template)] })
                }
                await channel.send(`<@&719936221572235295>`)

                await channel.send("You have 2 hours to vote. You can vote for 2 memes!")
    
                await updateQuals(match)
                let r = await getReminder(channel.id)
                await deleteReminder(r)

                let _string = ""

                for (let u of match.playerids) {
                    _string += `<@${u}> `
                }
                let time2 = 36
                let timeArr:Array<number> = []
                
                if((time2-2)*3600 > 0){
                    timeArr.push((time2-2)*3600)
                }
        
                if((time2-12)*3600 > 0){
                    timeArr.push((time2-12)*3600)
                }

                let rr:reminder = {
                    _id:r._id,
                    channel: r.channel,
                    mention: _string,
                    type: r.type,
                    timestamp: r.timestamp + 129600,
                    time:timeArr,
                    basetime:r.basetime
                }

                await insertReminder(rr)

            }
        }
    
    
    
        else if(match.split){
            
            for(let player of match.players){
                if(player.split){
                    if(Math.floor(Date.now() / 1000) - player.time > 1800 && player.failed === false){



                        player.failed = true;
                        player.memedone = false;
    
                        let embed2 = new discord.MessageEmbed()
                            .setDescription("You failed to submit your meme on time")
                            .setColor("#d7be26")
                            .setTimestamp()
                        
                        try{
                            await (await client.users.fetch(player.userid)).send(embed2)
                        } catch { console.log(Error) }
                        
                        match.playersdone.push(player.userid)
                        await updateQuals(match)

                        await (<discord.TextChannel>client.channels.cache.get("722616679280148504"))
                        .send(new discord.MessageEmbed()
                        .setDescription(`<@${player.userid}> has failed to submit a meme`)
                        .setColor("#d7be26")
                        .setTimestamp())

                        try {
        
                            try {
                                await deleteReminder(await getReminder(player.userid))
                            } catch {
                                console.log(`Couldn't delete reminder for ${player.userid}`)
                            }
        
                        } catch {
                            console.log("Couldn't delete reminders")
                        }
                    }
                }
            }

    
            if(match.playersdone.length === match.playerids.length){

                //Doing this because a split match uses playersdone to turn into a regular match. 
                //When this block of code excutes, the match will already be transforming into a regular match

                
                match.split = false
                match.octime = ((Math.floor(Date.now())) /1000) - 1800

                let temparr = []

                for (let player of match.players){
                    if (!player.failed){
                        temparr.push(player.userid)
                    }
                }
                match.playersdone = temparr             

                await updateQuals(match)
            }
        }
    }


    else if (match.votingperiod) {
        //7200
        if ((Math.floor(Date.now() / 1000) - match.votetime > 7200) || match.playersdone.length <= 2) {
            await qualend(client, channel.id)
        }
    }

    return;
}


function qualplayershuffle(source: qualmatch) {
    
    let sourceArray = source.players
    let source2 = source.playerids

    


    for (var i = 0; i < sourceArray.length - 1; i++) {
        var j = i + Math.floor(Math.random() * (sourceArray.length - i));

        var temp = sourceArray[j];
        var temp2 = source2[j]


        sourceArray[j] = sourceArray[i];
        sourceArray[i] = temp;

        source2[j] = source2[i]
        source2[i] = temp2
    }

    


    return source
}


















































// let qualmatches: qualmatch[] = await getQuals()

//     for (let match of qualmatches) {

//         let channelid = <discord.TextChannel>client.channels.cache.get(match.channelid)

//         if (match.votingperiod === false) {

//             for (let u of match.players) {

//                 if (match.playersdone.length === match.players.length) {
//                     match.split = false
//                     match.votingperiod = true
//                     match.votetime = Math.floor(Date.now() / 1000)
//                     await updateQuals(match)
//                 }

//                 
//                 


//                 if (Math.floor(Date.now() / 1000) - match.octime > 1800  || match.playersdone.length === match.players.length && match.split === false) {

//                     // if (match.playersdone.length <= 2) {
//                     //     return await qualend(client, channelid.id)
//                     // }

//                     for (let x of match.players) {
//                         if (x.memedone || x.failed === false) {
//                             let embed = new discord.MessageEmbed()
//                                 .setColor("#d7be26")
//                                 .setImage(x.memelink)
//                                 .setTimestamp()
//                             if (!match.playersdone.includes(x.userid)) {
//                                 match.playersdone.push(x.userid)
//                             }

//                             await channelid.send(embed)
//                         }

//                         else if(x.memedone === false || x.failed === true){
//                             let embed2 = new discord.MessageEmbed()
//                                 .setDescription("Player failed to submit meme on time")
//                                 .setColor("#d7be26")
//                                 .setTimestamp()
//                             await channelid.send(embed2)
//                         }
//                     }

//                     //await deleteQuals(match)
//                     let em = new discord.MessageEmbed()
//                         .setDescription("Please vote by clicking the number emotes.\nHit the recycle emote to reset votes")
//                         .setColor("#d7be26")
//                         .setTimestamp()

//                     channelid.send(em).then(async msg => {
//                         for (let i = 0; i < match.playerids.length; i++) {
//                             await msg.react(emojis[i])
//                         }
//                         await msg.react(emojis[6])
//                     })
//                     match.votingperiod = true
//                     await updateQuals(match)
//                     return;
//                 }

//                 if (match.split) {
//                     if (Math.floor(Date.now() / 1000) - u.time > 1800 && u.split === true && u.failed === false) {
//                         let embed3 = new discord.MessageEmbed()
//                             .setDescription("You failed to submit meme on time")
//                             .setColor("#d7be26")
//                             .setTimestamp()
//                         u.failed = true
//                         match.playersdone.push(u.userid)
//                         await updateQuals(match)
//                         await (await client.users.fetch(u.userid)).send(embed3)
//                     }

//                     if (match.playersdone.length === match.players.length) {
//                         match.split = false
//                         match.votingperiod = true
//                         match.votetime = Math.floor(Date.now() / 1000)
//                         await updateQuals(match)
//                     }

//                 }
//             }
//         }

//         if (match.votingperiod) {
//             //7200
//             if ((Math.floor(Date.now() / 1000) - match.votetime > 7200) || match.playersdone.length <= 2) {
//                 await qualend(client, channelid.id)
//             }
//         }
//     }