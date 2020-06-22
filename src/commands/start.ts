import * as discord from "discord.js"
import {getUser} from "../misc/utils"
const prefix = process.env.PREFIX!
import {activematch, qualmatch, players} from "../misc/struct"
import { end } from "./winner"
import { vs } from "./card"
import { updateActive, deleteActive, insertActive, insertQuals, updateQuals, deleteQuals, getActive, getQuals } from "../misc/db"
//const Canvas = require('canvas');

export async function start(message: discord.Message, client: discord.Client){
    //.start @user1 @user2

    let users:string[] = []
    var args: Array<string> = message.content.slice(prefix.length).trim().split(/ +/g)
    
    if (args.length < 3) {
        return message.reply("invalid response. Command is `!start @user1 @user2 template link`\n or `!start @user1 @user2 theme description`")
    }
    
    //console.log(args)

    for (let i = 0; i < args.length; i++){
        let userid = await getUser(args[i])
        if (userid){
            users.push(userid)
        }
    }
    let user1 = (await client.users.fetch(users[0]))
    let user2 = (await client.users.fetch(users[1]))

    let newmatch:activematch = {
        _id:message.channel.id,
        channelid:message.channel.id,
        messageID: "",
        p1:{
            userid: user1.id,
            memedone: false,
            time: Math.floor(Date.now() / 1000),
            memelink: "",
            votes: 0,
            voters: [],
        },
        p2:{
            userid: user2.id,
            memedone: false,
            time: Math.floor(Date.now() / 1000),
            memelink: "",
            votes: 0,
            voters: [],
        },
        votetime: Math.floor(Date.now() / 1000),
        votingperiod: false,
        // votemessage: null,
    }

    await vs(message, client, users)

    let embed = new discord.MessageEmbed()
    .setTitle(`Match between ${user1.username} and ${user2.username}`)
    .setDescription(`<@${user1.id}> and <@${user2.id}> both have 30 mins to complete your memes.\n Contact admins if you have an issue.`)
    .setTimestamp()
    
    
    
    message.channel.send({embed})
    
    if (["t", "template"].includes(args[3])){
        let att = new discord.MessageAttachment(message.attachments.array()[0].url)
        await user1.send("Here is your template:")
        await user1.send(att)
        
        await user2.send("Here is your template:")
        await user2.send(att)

        // await message.channel.send("Here is your template:")
        // await message.channel.send(att)
    }

    else if (["th", "theme"].includes(args[3])){
        await user1.send(`Your theme is: ${args.splice(4).join(" ")}`)       
        await user2.send(`Your theme is: ${args.splice(4).join(" ")}`)

        // await message.channel.send("Here is your template:")
        // await message.channel.send(att)
    }

    //console.log(newmatch)
    // matches.push(newmatch)
    await insertActive(newmatch)
    // return matches;
}

export async function startqual(message: discord.Message, client: discord.Client){
    //.start @user1 @user2

    let users:players[] = []
    var args: Array<string> = message.content.slice(prefix.length).trim().split(/ +/g)
    let x:number = 0;
    console.log(args)
    if (args.length < 3) {
        return message.reply("Invalid response. Command is `!start @user1 @user2 @user3 @user4 <@user5 @user6> template link`\n or `.start @user1 @user2 theme description`")
    }
    
    //console.log(args)

    for (let i = 0; i < args.length; i++){
        let userid = await getUser(args[i])
        if (userid){
            let player:players = {
                userid:userid,
                memedone: false,
                memelink: "",
                time: 0,
                split:true,
                failed:false
            }
            users.push(player)
            x += i
        }
    }

    let newmatch:qualmatch = {
        _id:message.channel.id,
        split: false,
        channelid: message.channel.id,
        players:users,
        template:"",
        octime: Math.floor(Date.now() / 1000),

    }

    //await vs(message, client, users)

    let embed = new discord.MessageEmbed()
    .setTitle(`Qualifiying match`)
    .setDescription(`All players have 30 mins to complete your memes.\n Contact admins if you have an issue.`)
    .setTimestamp()
    
    
    
    message.channel.send({embed})
    
    if (["t", "template"].includes(args[x])){
        let att = new discord.MessageAttachment(message.attachments.array()[0].url)
        for (let u of users){
            let user = await client.users.fetch(u.userid)
            await user.send("Here is your template:")
            await user.send(att)
        }

    }

    else if (["th", "theme"].includes(args[x])){
        for (let u of users){
            let user = await client.users.fetch(u.userid)
            await user.send(`Your theme is: ${args.splice(x+1).join(" ")}`)
        }
    }

    //console.log(newmatch)
    // qualmatches.push(newmatch)
    await insertQuals(newmatch)

    // return qualmatches;
}

export async function startmodqual(message: discord.Message){
    //.start @user1 @user2

    let users:players[] = []
    var args: Array<string> = message.content.slice(prefix.length).trim().split(/ +/g)
    let x:number = 0;
    console.log(args)
    if (args.length < 3) {
        return message.reply("invalid response. Command is `!start @user1 @user2 @user3 @user4 <@user5 @user6> template link`\n or `.start @user1 @user2 theme description`")
    }
    
    //console.log(args)

    for (let i = 0; i < args.length; i++){
        let userid = await getUser(args[i])
        if (userid){
            let player:players = {
                userid:userid,
                memedone: false,
                memelink: "",
                time:0,
                split:false,
                failed:false
            }
            users.push(player)
            x += i
        }
    }

    let newmatch:qualmatch = {
        _id:message.channel.id,
        split: true,
        channelid: message.channel.id,
        players:users,
        octime: 0,
        template:"",

    }

    //await vs(message, client, users)

    let embed = new discord.MessageEmbed()
    .setTitle(`Qualifiying match`)
    .setDescription(`This match has been split. Please contact mods to start your portion`)
    .setTimestamp()
    
    
    
    message.channel.send({embed})
    
    if (["t", "template"].includes(args[x])){
        newmatch.template = message.attachments.array()[0].url
    }

    // else if (["th", "theme"].includes(args[2+x])){
    //     for (let u of users){
    //         let user = await client.fetchUser(u.userid)
    //         await user.send(`Your theme is: ${args.splice(5+x)}`)
    //     }
    // }

    //console.log(newmatch)
    // qualmatches.push(newmatch)
    
    await insertQuals(newmatch)
    // return qualmatches;
}

export async function running(client: discord.Client):Promise<void>{
    let matches: activematch[] = await getActive()
    for (const match of matches){
        console.log(Math.floor(Date.now() / 1000) - match.votetime)
        console.log((Math.floor(Date.now() / 1000) - match.votetime) >= 1800)
        let channelid = <discord.TextChannel>client.channels.cache.get(match.channelid)
        let user1 = (await client.users.fetch(match.p1.userid))
        let user2 = (await client.users.fetch(match.p2.userid))
        // if((match.p2.memedone === true) && (match.p1.memedone === true)){
        //     console.log("Hello")
        //     let embed1 = new discord.RichEmbed()
        //     .setImage(match.p1.memelink)
        //     .setTimestamp()

        //     let embed2 = new discord.RichEmbed()
        //     .setImage(match.p1.memelink)
        //     .setTimestamp()

        //     channel.send(embed1)
        //     channel.send(embed2)
        // }

        if(match.votingperiod === false){

            if(((Math.floor(Date.now() / 1000) - match.p2.time > 1800) && match.p2.memedone === false) && ((Math.floor(Date.now() / 1000) - match.p1.time > 1800) && match.p1.memedone === false)){
                user1.send("You have failed to submit your meme")
                user2.send("You have failed to submit your meme")

                let embed = new discord.MessageEmbed()
                .setTitle(`Match between ${user1.username} and ${user2.username}`)
                .setDescription(`<@${user1.id}> & <@${user2.id}> have lost\n for not submitting meme on time`)
                .setTimestamp()

                channelid.send(embed)
                // matches.splice(matches.indexOf(match), 1)
                await deleteActive(match)
                break
            }

            else if((Math.floor(Date.now() / 1000) - match.p1.time > 1800) && match.p1.memedone === false){
                user1.send("You have failed to submit your meme, your opponet is the winner.")

                let embed = new discord.MessageEmbed()
                .setTitle(`Match between ${user1.username} and ${user2.username}`)
                .setDescription(`<@${user2.id}> has won!`)
                .setTimestamp()

                channelid.send(embed)
                // matches.splice(matches.indexOf(match), 1)
                await deleteActive(match)
                break
            }

            else if((Math.floor(Date.now() / 1000) - match.p2.time > 1800) && match.p2.memedone === false){
                console.log(Date.now() - match.p2.time)
                user2.send("You have failed to submit your meme, your opponet is the winner.")

                let embed = new discord.MessageEmbed()
                .setTitle(`Match between ${user1.username} and ${user2.username}`)
                .setDescription(`<@${user1.id}> has won!`)
                .setTimestamp()

                channelid.send(embed)
                // matches.splice(matches.indexOf(match), 1)
                await deleteActive(match)
                break
            }

         
            
            else if(((Math.floor(Date.now() / 1000) - match.p2.time < 1800) && match.p2.memedone === true) && ((Math.floor(Date.now() / 1000) - match.p2.time < 1800) && match.p1.memedone === true)){
                //channelid.send(`/poll "Vote for best meme" "Image A" "Image B"`)

                // if (!match.p1.memelink.includes("https://i.imgur.com/")){
                //     var embed1 = new discord.RichEmbed()
                //     .setImage(match.p1.memelink)
                //     .setTimestamp()
                // }

                // else if(match.p1.memelink.includes("https://i.imgur.com/")){
                //     var embed1 = await GetImgur(match.p1.memelink)
                // }

                // if (!match.p2.memelink.includes("https://i.imgur.com/")){
                //     var embed2 = new discord.RichEmbed()
                //     .setImage(match.p2.memelink)
                //     .setTimestamp()
                // }
                
                var embed1 = new discord.MessageEmbed()
                .setImage(match.p1.memelink)
                .setTimestamp()

                var embed2 = new discord.MessageEmbed()
                .setImage(match.p2.memelink)
                .setTimestamp()

                
                let embed3 = new discord.MessageEmbed()
                .setTitle("Please vote")
                .setDescription("Vote for Meme 1 reacting with 🅰️\nMeme 2 by reacting with 🅱️")
    
                await channelid.send(embed1)
                await channelid.send(embed2)
                //await channelid.send(embed3)
    
                await channelid.send(embed3).then(async msg => {
                    match.messageID = msg.id
                    await (msg as discord.Message).react("🅰️")
                    await (msg as discord.Message).react("🅱️")
                })

                //await channelid.send("@eveyone")
                
                // channelid.fetchMessages({ limit: 1 }).then(messages => {
                //     let lastMessage = messages.first();
                //     match.votemessage = lastMessage
                // })

                //console.log(match.votemessage?.content)

                match.votingperiod = true
                match.votetime = (Math.floor(Date.now() / 1000))
                // let messages: discord.Collection < string, discord.Message > = await channelid.fetchMessage(channelid.id)
    
                // let react = messages.last().id
                await updateActive(match)
            }
        }

        if(match.votingperiod === true){
            //7200
            if ((Math.floor(Date.now() / 1000) - match.votetime > 7200)){
                await end(client)
            }
        }
    }
}

export async function qualrunning(client: discord.Client){
    let qualmatches:qualmatch[] = await getQuals()
    for(let match of qualmatches){
        let channelid = <discord.TextChannel>client.channels.cache.get(match.channelid)

            for (let u of match.players){
                console.log(u)
                console.log(match.players.length)
                if(Math.floor(Date.now() / 1000) - match.octime > 1800 && match.split === false){
                    if(!u.failed || u.memedone){
                        let embed = new discord.MessageEmbed()
                        .setImage(u.memelink)
                        .setTimestamp()
                        
                        await channelid.send(embed)
                    }
    
                    else{
                        let embed = new discord.MessageEmbed()
                        .setDescription("Player failed to submit meme on time")
                        .setTimestamp()  
                        await channelid.send(embed)
                    }
                }

                if(match.split){
                    if(Math.floor(Date.now() / 1000) - u.time > 1800 && u.failed === false && u.split === true){
                        let embed = new discord.MessageEmbed()
                        .setDescription("You failed to submit meme on time")
                        .setTimestamp()
                        u.failed = true
                        match.octime += 1
                        await updateQuals(match)
                        await (await client.users.fetch(u.userid)).send(embed)
                    }
                }

                if(match.split){
                    if(match.octime === match.players.length){
                            match.split = false
                            match.octime = Math.floor(Date.now() / 1000) - 1800
                        }
                }
            }
            
            if(Math.floor(Date.now() / 1000) - match.octime > 1800 && match.split === false){
                await deleteQuals(match)
            }    
    }
}

export async function splitqual(client:discord.Client, message: discord.Message){
    let user = await (client.users.fetch(message.mentions!.users!.first()!.id));
    let qualmatches:qualmatch[] = await getQuals()

    for(let match of qualmatches){
        let channelid = <discord.TextChannel>client.channels.cache.get(match.channelid)

        if(match.channelid === message.channel.id){
            for (let u of match.players){
                console.log(u)
                if(u.userid === user.id && u.memedone === false && u.split === false){
                    u.time = Math.floor(Date.now() / 1000)
                    await channelid.send(new discord.MessageEmbed()
                    .setDescription(`${user.username} your match has been split.\nYou have 30 mins\nto complete your memes`)
                    .setTimestamp())
                    u.split = true

                    if(match.template.length > 0){
                        await user.send("Here is your template:")
                        await user.send({ files: [new discord.MessageAttachment(match.template)]})
                    }

                    await updateQuals(match)
                }
                else if(u.split === true && u.userid === user.id){
                    await channelid.send(new discord.MessageEmbed()
                    .setDescription(`${user.username} has completed their portion`)
                    .setTimestamp())
                    await updateQuals(match)
                }
            }

            // if(match.octime >= match.players.length){
            //     match.octime = Math.floor(Date.now() / 1000) - 1800
            //     match.split = false
            //     await updateQuals(match)
            // }
        }
    }
}


// async function GetImgur(link: string){
//     var img = await Canvas.loadImage(link)

//     const attachment = new discord.Attachment(img.toBuffer(), 'welcome-image.png');

//     let embed = new discord.RichEmbed()
//     .setImage(attachment)
//     .setTimestamp()

//     return embed    

// }