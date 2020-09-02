import * as discord from "discord.js"
import { getUser, emojis } from "../misc/utils"
const prefix = process.env.PREFIX!
import { activematch, qualmatch, players } from "../misc/struct"
import { end, qualend } from "./winner"
import { vs } from "./card"
import { updateActive, deleteActive, insertActive, insertQuals, 
    updateQuals, getActive, getQuals, getSingularQuals, 
    getMatch, gettempStruct, deletetempStruct, getQual} from "../misc/db"
import { createAtUsermatch } from "./user"
import { qualrunn } from "./qualrunn"
import { RandomTemplateFunc } from "../misc/randomtemp"
//const Canvas = require('canvas');

export async function start(message: discord.Message, client: discord.Client) {
    //.start @user1 @user2

    //let users: string[] = []
    var args: Array<string> = message.content.slice(prefix.length).trim().split(/ +/g)

    if (args.length < 3) {
        return message.reply("invalid response. Command is `!start @user1 @user2 template link`\n or `!start @user1 @user2 theme description`")
    }

    //console.log(args)

    // for (let i = 0; i < args.length; i++) {
    //     let userid = await getUser(args[i])
    //     if (userid) {
    //         users.push(userid)
    //     }
    // }

    let user1 = message.mentions.users.array()[0]
    let user2 = message.mentions.users.array()[2]

    createAtUsermatch(user1)
    createAtUsermatch(user2)

    let newmatch: activematch = {
        _id: message.channel.id,
        channelid: message.channel.id,
        split: false,
        messageID: "",
        template: [],
        tempfound: false,
        p1: {
            userid: message.mentions.users.array()[0].id,
            partner: message.mentions.users.array()[1].id,
            memedone: false,
            donesplit: true,
            time: Math.floor(Date.now() / 1000),
            memelink: [],
            votes: 0,
            voters: [],
            halfreminder: false,
            fivereminder: false,
        },
        p2: {
            userid: message.mentions.users.array()[2].id,
            partner: message.mentions.users.array()[3].id,
            memedone: false,
            donesplit: true,
            time: Math.floor(Date.now() / 1000),
            memelink: [],
            votes: 0,
            voters: [],
            halfreminder: false,
            fivereminder: false,
        },
        votetime: Math.floor(Date.now() / 1000),
        votingperiod: false,
        // votemessage: null,
    }

    let templook = new discord.MessageEmbed()
    .setTitle(`Looking for a temp`)
    .setColor("#d7be26")
    .setTimestamp()



    message.channel.send(templook)

    await RandomTemplateFunc(message, client, message.channel.id)


    setTimeout(() => { console.log("Waited 2 seconds"); }, 2000);

    let rantemp = await gettempStruct(message.channel.id)

    rantemp.time = rantemp.time - 2.5

    console.log(rantemp)
    // await message.channel.send(new discord.MessageEmbed()
    //         .setTitle(`Random Template Selection failed `)
    //         .setColor("red")
    //         .setDescription(`Mods please restart this match`)
    //         .setTimestamp())

    // let tempm = await (await (<discord.TextChannel>client.channels.cache.get("722616679280148504")).messages.fetch(rantemp.messageid))

    // const filter = (reaction:discord.MessageReaction, user:discord.User) => reaction.emoji.name === '🌀' && user.id !== client.user!.id;

    while(rantemp.found === false){
        //console.log(rantemp)
        //await message.reply("IN LOOP")
        if(Math.floor(Date.now()/1000) - rantemp.time > 120){
            
            await deletetempStruct(rantemp._id)
            await (await (<discord.TextChannel>client.channels.cache.get("722616679280148504")).messages.fetch(rantemp.messageid)).delete()
            return await message.channel.send(new discord.MessageEmbed()
            .setTitle(`Random Template Selection failed `)
            .setColor("red")
            .setDescription(`Mods please restart this match`)
            .setTimestamp())
        }
        rantemp = await gettempStruct(message.channel.id)
    }

    newmatch.template.push(rantemp.url)
    await deletetempStruct(rantemp._id)

    await RandomTemplateFunc(message, client, message.channel.id)

    setTimeout(() => { console.log("Waited 2 seconds"); }, 2000);

    let rantemp2 = await gettempStruct(message.channel.id)

    rantemp2.time = rantemp2.time - 2.5
 

    while(rantemp2.found === false){

        if(Math.floor(Date.now()/1000) - rantemp.time > 120){
            
            await deletetempStruct(rantemp2._id)
            await (await (<discord.TextChannel>client.channels.cache.get("722616679280148504")).messages.fetch(rantemp2.messageid)).delete()
            return await message.channel.send(new discord.MessageEmbed()
            .setTitle(`Random Template Selection failed `)
            .setColor("RED")
            .setDescription(`Mods please restart this match`)
            .setTimestamp())
        }
        rantemp2 = await gettempStruct(message.channel.id)
        //console.log(rantemp)
    }

    
    newmatch.template.push(rantemp2.url)
    await insertActive(newmatch)

    await deletetempStruct(rantemp2._id)

    
    await vs(message.channel.id, client, [message.mentions.users.array()[0].id, message.mentions.users.array()[2].id])
    await vs(message.channel.id, client, [message.mentions.users.array()[1].id, message.mentions.users.array()[3].id])

    let embed = new discord.MessageEmbed()
        .setTitle(`Match between ${user1.username} & ${message.mentions.users.array()[1].username} and ${user2.username} & ${message.mentions.users.array()[3].username}`)
        .setColor("#d7be26")
        .setDescription(`<@${user1.id}> & <@${message.mentions.users.array()[1].id}> and <@${user2.id}> & <@${message.mentions.users.array()[3].id}> both have 2 hours to complete your memes.\n Contact admins if you have an issue.`)
        .setTimestamp()



    message.channel.send({ embed })

    // if (["t", "template"].includes(args[3])) {
    //     await user1.send("Here is your template:")
    //     await user1.send(rantemp.url)

    //     await user2.send("Here is your template:")
    //     await user2.send(rantemp.url)

    //     // await message.channel.send("Here is your template:")
    //     // await message.channel.send(att)
    // }

    await user1.send(new discord.MessageEmbed()
    .setTitle("Your first template")
    .setImage(rantemp.url)
    .setColor("#d7be26")
    .setTimestamp())

    await user1.send(new discord.MessageEmbed()
    .setTitle("Your second template")
    .setImage(rantemp2.url)
    .setColor("#d7be26")
    .setTimestamp())

    await user2.send(new discord.MessageEmbed()
    .setTitle("Your first template")
    .setImage(rantemp.url)
    .setColor("#d7be26")
    .setTimestamp())

    await user2.send(new discord.MessageEmbed()
    .setTitle("Your second template")
    .setImage(rantemp2.url)
    .setColor("#d7be26")
    .setTimestamp())

    await message.mentions.users.array()[1].send(new discord.MessageEmbed()
    .setTitle("Your first template")
    .setImage(rantemp.url)
    .setColor("#d7be26")
    .setTimestamp())

    await message.mentions.users.array()[1].send(new discord.MessageEmbed()
    .setTitle("Your second template")
    .setImage(rantemp2.url)
    .setColor("#d7be26")
    .setTimestamp())    
    
    await message.mentions.users.array()[3].send(new discord.MessageEmbed()
    .setTitle("Your first template")
    .setImage(rantemp.url)
    .setColor("#d7be26")
    .setTimestamp())

    await message.mentions.users.array()[3].send(new discord.MessageEmbed()
    .setTitle("Your second template")
    .setImage(rantemp2.url)
    .setColor("#d7be26")
    .setTimestamp())

    if (["th", "theme"].includes(args[3])) {
        await user1.send(`Your theme is: ${args.splice(4).join(" ")}`)
        await user2.send(`Your theme is: ${args.splice(4).join(" ")}`)

        // await message.channel.send("Here is your template:")
        // await message.channel.send(att)
    }

    // else{
    //     await (<discord.TextChannel>client.channels.cache.get("724827952390340648")).messages.fetch("724827952390340648").then(async msg => {
    //         await message.reply(msg)
    //     })
    // }


    await user1.send(`Your match has been split.\nYou have 2 hours to complete your portion\nUse \`!submit\` to submit`)
    message.mentions.users.array()[1].send(`Your match has been split.\nYou have 2 hours to complete your portion\nUse \`!submit\` to submit`)
    await user2.send(`Your match has been split.\nYou have 2 hours to complete your portion\nUse \`!submit\` to submit`)
    message.mentions.users.array()[1].send(`Your match has been split.\nYou have 2 hours to complete your portion\nUse \`!submit\` to submit`)

    // // return matches;
}

export async function startqual(message: discord.Message, client: discord.Client) {
    //.start @user1 @user2

    let users: players[] = []
    var args: Array<string> = message.content.slice(prefix.length).trim().split(/ +/g)
    let x: number = 0;
    let plyerids: Array<string> = []
    let votearray = []
    console.log(args)
    if (args.length < 4) {
        return message.reply("Invalid response. Command is `!startqual @user1 @user2 @user3 @user4 <@user5 @user6> template link`\n or `!startqual @user1 @user2 theme description`")
    }

    //console.log(args)

    for (let i = 0; i < args.length; i++) {
        let userid = await getUser(args[i])
        if (userid) {
            let player: players = {
                userid: userid,
                memedone: false,
                memelink: "",
                time: 0,
                split: false,
                failed: false
            }
            users.push(player)
            plyerids.push(userid)
            votearray.push([])
            x += i
        }
    }
    for (const u of users) {
        createAtUsermatch(await client.users.fetch(u.userid))
    }

    let newmatch: qualmatch = {
        _id: message.channel.id,
        split: false,
        channelid: message.channel.id,
        players: users,
        playerids: plyerids,
        template: "",
        votes: votearray,
        octime: Math.floor(Date.now() / 1000),
        playersdone: [],
        votingperiod: false,
        votetime: 0

    }

    //await vs(message, client, users)

    let embed = new discord.MessageEmbed()
        .setTitle(`Qualifiying match`)
        .setColor("#d7be26")
        .setDescription(`All players have 30 mins to complete your memes.\n Contact admins if you have an issue.`)
        .setTimestamp()



    message.channel.send({ embed })

    if (["t", "template"].includes(args[x])) {
        let att = new discord.MessageAttachment(message.attachments.array()[0].url)
        for (let u of users) {
            let user = await client.users.fetch(u.userid)
            await user.send("Here is your template:")
            await user.send(att)
        }

    }

    else if (["th", "theme"].includes(args[x])) {
        for (let u of users) {
            let user = await client.users.fetch(u.userid)
            await user.send(`Your theme is: ${args.splice(x + 1).join(" ")}`)
        }
    }

    //console.log(newmatch)
    // qualmatches.push(newmatch)
    await insertQuals(newmatch)

    // return qualmatches;
}

export async function startmodqual(message: discord.Message, client: discord.Client) {
    //.start @user1 @user2

    let users: players[] = []
    var args: Array<string> = message.content.slice(prefix.length).trim().split(/ +/g)
    let x: number = 0;
    let plyerids: Array<string> = []
    let votearray = []
    console.log(args)
    if (args.length < 4) {
        return message.reply("invalid response. Command is `!splitqual @user1 @user2 @user3 @user4 <@user5 @user6> template link`\n or `!splitqual @user1 @user2 @user3 @user4 <@user5 @user6> theme description`")
    }

    //console.log(args)


    for (let i = 0; i < args.length; i++) {
        let userid = await getUser(args[i])
        if (userid) {
            let player: players = {
                userid: userid,
                memedone: false,
                memelink: "",
                time: 0,
                split: false,
                failed: false
            }
            users.push(player)
            plyerids.push(userid)
            votearray.push([])
            x += i
        }
    }

    for (const u of users) {
        createAtUsermatch(await client.users.fetch(u.userid))
    }

    let newmatch: qualmatch = {
        _id: message.channel.id,
        split: true,
        playerids: plyerids,
        channelid: message.channel.id,
        players: users,
        octime: 0,
        votes: votearray,
        template: "",
        playersdone: [],
        votingperiod: false,
        votetime: 0

    }

    //await vs(message, client, users)

    let embed = new discord.MessageEmbed()
        .setTitle(`Qualifiying match`)
        .setColor("#d7be26")
        .setDescription(`This match has been split. Please contact mods to start your portion`)
        .setTimestamp()



    message.channel.send({ embed })

    console.log(args[args.indexOf("theme") + 1])



    if (["t", "template"].includes(args[x])) {
        newmatch.template = message.attachments.array()[0].url
    }


    else if (args.includes("theme")) {
        newmatch.template = args.slice(args.indexOf("theme") + 1).join(" ")

        await (<discord.TextChannel>client.channels.cache.get("738047732312309870")).send(`<#${message.channel.id}> theme is ${args.slice(args.indexOf("theme") + 1).join(" ")}`);
        //     let user = await client.fetchUser(u.userid)
        //     await user.send(`Your theme is: ${args.splice(5+x)}`)
        // }
    }

    //console.log(newmatch)
    // qualmatches.push(newmatch)

    await insertQuals(newmatch)

    // await message.edit()
    // return qualmatches;
}

export async function running(client: discord.Client): Promise<void> {
    let matches: activematch[] = await getActive()
    for (const match of matches) {
        //console.log(Math.floor(Date.now() / 1000) - match.votetime)
        console.log(Math.floor(Date.now() / 1000) - match.p1.time, "time")
        console.log(Math.floor(Date.now() / 1000) - match.p1.time <= 1260 && Math.floor(Date.now() / 1000) - match.p1.time >= 1200)
        let channelid = <discord.TextChannel>client.channels.cache.get(match.channelid)
        let user1 = (await client.users.fetch(match.p1.userid))
        let user2 = (await client.users.fetch(match.p2.userid))
      
        if (match.votingperiod === false) {

            console.log('okk')
            if (((Math.floor(Date.now() / 1000) - match.p1.time <= 3660 && Math.floor(Date.now() / 1000) - match.p1.time >= 3600) 
            && match.p1.memedone === false && match.p1.donesplit && match.p1.halfreminder === false)) {

                console.log("OK")
                match.p1.halfreminder = true

                let embed = new discord.MessageEmbed()
                    .setColor("#d7be26")
                    .setTitle(`Match between ${user1.username} and ${user2.username}`)
                    .setDescription(`You have 1 hour left.\nUse \`!submit\` to submit`)
                    .setTimestamp()

                try{
                    user1.send(embed)
                } catch(err) { 
                    await (<discord.TextChannel>client.channels.cache.get("722616679280148504"))
                    .send("```" + err + "```")
                    await (<discord.TextChannel>client.channels.cache.get("722616679280148504"))
                    .send(`Can't send embed to <@${user1.id}>`)
                }
                // matches.splice(matches.indexOf(match), 1)
            }

            else if ((Math.floor(Date.now() / 1000) - match.p2.time <= 3660 && Math.floor(Date.now() / 1000) - match.p2.time >= 3600) 
            && match.p2.memedone === false && match.p2.donesplit && match.p2.halfreminder === false) {
                console.log("OK")
                match.p2.halfreminder = true
                let embed = new discord.MessageEmbed()
                    .setColor("#d7be26")
                    .setTitle(`Match between ${user1.username} and ${user2.username}`)
                    .setDescription(`You have 1 hour left.\nUse \`!submit\` to submit`)
                    .setTimestamp()
                

                try{
                    user2.send(embed)
                } catch(err) { 
                    await (<discord.TextChannel>client.channels.cache.get("722616679280148504"))
                    .send("```" + err + "```")
                    await (<discord.TextChannel>client.channels.cache.get("722616679280148504"))
                    .send(`Can't send embed to <@${user2.id}>`)
                }
                // matches.splice(matches.indexOf(match), 1)

                
            }

            // else if (((Math.floor(Date.now() / 1000) - match.p1.time <= 2160 && Math.floor(Date.now() / 1000) - match.p1.time >= 2100) 
            // && match.p1.memedone === false && match.p1.donesplit && match.p1.fivereminder === false)) {
            //     match.p1.fivereminder = true
            //     console.log("OK")
            //     let embed = new discord.MessageEmbed()
            //         .setColor("#d7be26")
            //         .setTitle(`Match between ${user1.username} and ${user2.username}`)
            //         .setDescription(`You have 5 mins left.\nUse \`!submit\` to submit`)
            //         .setTimestamp()
                
            //     try{
            //         user1.send(embed)
            //     } catch(err) { 
            //         await (<discord.TextChannel>client.channels.cache.get("722616679280148504"))
            //         .send("```" + err + "```")
            //         await (<discord.TextChannel>client.channels.cache.get("722616679280148504"))
            //         .send(`Can't send embed to <@${user1.id}>`)
            //     }
            //     // matches.splice(matches.indexOf(match), 1)
            // }

            // else if (((Math.floor(Date.now() / 1000) - match.p2.time <= 2160 && Math.floor(Date.now() / 1000) - match.p2.time >= 2100) && match.p2.memedone === false 
            // && match.p2.donesplit && match.p2.fivereminder === false)){
                
            //     match.p2.fivereminder = true
            //     console.log("OK")
            //     let embed = new discord.MessageEmbed()
            //         .setColor("#d7be26")
            //         .setTitle(`Match between ${user1.username} and ${user2.username}`)
            //         .setDescription(`You have 5 mins left.\nUse \`!submit\` to submit`)
            //         .setTimestamp()

            //     try{
            //         user2.send(embed)
            //     } catch(err) { 
            //         await (<discord.TextChannel>client.channels.cache.get("722616679280148504"))
            //         .send("```" + err + "```")
            //         await (<discord.TextChannel>client.channels.cache.get("722616679280148504"))
            //         .send(`Can't send embed to <@${user2.id}>`)
            //     }
            //     // matches.splice(matches.indexOf(match), 1)
            // }

            else if (!(match.split) && ((Math.floor(Date.now() / 1000) - match.p2.time > 7200) && match.p2.memedone === false)
                && ((Math.floor(Date.now() / 1000) - match.p1.time > 7200) && match.p1.memedone === false)) {
                user1.send("You have lost because did not submit your meme")
                user2.send("You have lost because did not submit your meme")

                let embed = new discord.MessageEmbed()
                    .setColor("#d7be26")
                    .setTitle(`Match between ${user1.username} and ${user2.username}`)
                    .setDescription(`<@${user1.id}> & <@${user2.id}> have lost\n for not submitting meme on time`)
                    .setTimestamp()

                channelid.send(embed)
                // matches.splice(matches.indexOf(match), 1)
                await deleteActive(match)
            }

            else if ((Math.floor(Date.now() / 1000) - match.p1.time > 7200)
                && match.p1.memedone === false && match.p1.donesplit) {
                user1.send("You have failed to submit your meme, your opponet is the winner.")

                let embed = new discord.MessageEmbed()
                    .setColor("#d7be26")
                    .setTitle(`Match between ${user1.username} and ${user2.username}`)
                    .setDescription(`<@${user2.id}> has won!`)
                    .setTimestamp()

                channelid.send(embed)
                // matches.splice(matches.indexOf(match), 1)
                await deleteActive(match)
            }

            else if ((Math.floor(Date.now() / 1000) - match.p2.time > 7200)
                && match.p2.memedone === false && match.p2.donesplit) {
                console.log(Date.now() - match.p2.time)
                user2.send("You have failed to submit your meme, your opponet is the winner.")

                let embed = new discord.MessageEmbed()
                    .setTitle(`Match between ${user1.username} and ${user2.username}`)
                    .setDescription(`<@${user1.id}> has won!`)
                    .setColor("#d7be26")
                    .setTimestamp()

                channelid.send(embed)
                // matches.splice(matches.indexOf(match), 1)
                await deleteActive(match)
            }


            else if ((!(match.split) && ((Math.floor(Date.now() / 1000) - match.p2.time <= 7200) && match.p2.memedone === true)
                && ((Math.floor(Date.now() / 1000) - match.p1.time <= 7200) && match.p1.memedone === true))) {


                if (Math.floor(Math.random() * (5 - 1) + 1) % 2 === 1) {
                    let temp = match.p1

                    match.p1 = match.p2

                    match.p2 = temp

                    //await updateActive(match)
                }


                channelid.send(
                    new discord.MessageEmbed()
                    .setTitle("Template#1")
                .setImage(match.template[0])
                .setColor("#07da63")
                .setTimestamp()
                )

                channelid.send(
                    new discord.MessageEmbed()
                    .setTitle("Template#2")
                .setImage(match.template[1])
                .setColor("#07da63")
                .setTimestamp()
                )


                let embed1 = new discord.MessageEmbed()
                    .setDescription("Group 1 Meme #1")
                    .setImage(match.p1.memelink[0])
                    .setColor("#d7be26")
                    .setTimestamp()
                
                console.log("Player 1 embed done")
                

                let embed2 = new discord.MessageEmbed()
                    .setDescription("Group 1 Meme #2")
                    .setImage(match.p1.memelink[1])
                    .setColor("#d7be26")
                    .setTimestamp()

                let embed3 = new discord.MessageEmbed()
                    .setDescription("Group 2 Meme #1")
                    .setImage(match.p2.memelink[0])
                    .setColor("#d7be26")
                    .setTimestamp()
                
                console.log("Player 1 embed done")
                

                let embed4 = new discord.MessageEmbed()
                    .setDescription("Group 2 Meme #2")
                    .setImage(match.p2.memelink[1])
                    .setColor("#d7be26")
                    .setTimestamp()
                
                
                let embed5 = new discord.MessageEmbed()
                    .setTitle("Vote for the best meme!")
                    .setColor("#d7be26")
                    .setDescription(`Vote for Group 1 reacting with ${emojis[0]}\nVote for Group 2 by reacting with ${emojis[1]}`)
                
               

                await channelid.send(embed1)
                await channelid.send(embed2)
                
                await channelid.send(embed3)
                await channelid.send(embed4)

                await channelid.send(embed5).then(async msg => {
                    match.messageID = msg.id
                    await (msg as discord.Message).react(emojis[0])
                    await (msg as discord.Message).react(emojis[1])
                })

                //await channelid.send("@eveyone")

                match.votingperiod = true
                match.votetime = (Math.floor(Date.now() / 1000))
                
                await channelid.send(`<@&719936221572235295>`)

                await channelid.send("You have 3 hours to vote!")
            }

            await updateActive(match)
        }

        if (match.votingperiod === true && !match.split) {
            //7200
            if ((Math.floor(Date.now() / 1000) - match.votetime > 10800) && !match.split) {
                await end(client, match.channelid)
            }
        }
    }
}

export async function qualrunning(client: discord.Client) {
    let qualmatches: qualmatch[] = await getQuals()

    for (let match of qualmatches) {
        await qualrunn(match, match.channelid, client)
    }
}

export async function splitqual(client: discord.Client, message: discord.Message) {
    let user = await (client.users.fetch(message.mentions!.users!.first()!.id));
    let qualmatches: qualmatch[] = await getQuals()

    for (let match of qualmatches) {
        let channelid = <discord.TextChannel>client.channels.cache.get(match.channelid)

        if (match.channelid === message.channel.id) {
            for (let u of match.players) {
                console.log(u)
                if (u.userid === user.id && u.memedone === false && u.split === false) {
                    u.time = Math.floor(Date.now() / 1000)
                    await channelid.send(new discord.MessageEmbed()
                        .setDescription(`<@${user.id}> your qualifier match has been split.\nYou have 30 mins to complete your memes\nUse \`!qualsubmit\` to submit`)
                        .setColor("#d7be26")
                        .setTimestamp())
                    u.split = true

                    await user.send(`<@${user.id}> your qualifier match has been split.\nYou have 30 mins to complete your memes\nUse \`!qualsubmit\` to submit`)


                    if (match.template.length > 0 || match.template) {
                        await user.send("\n\nHere is your theme: " + match.template)
                        //await user.send({ files: [new discord.MessageAttachment(match.template)] })
                    }

                    await updateQuals(match)
                }

                else if (u.split === true && u.userid === user.id) {
                    await channelid.send(new discord.MessageEmbed()
                        .setDescription(`<@${user.id}> has completed their portion`)
                        .setColor("#d7be26")
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

export async function splitregular(message: discord.Message, client: discord.Client, ...userid:string[]) {
    let user = await client.users.fetch(userid[0] || message.mentions!.users!.first()!.id);
    let matches: activematch[] = await getActive()

    for (let match of matches) {
        //let channel = <discord.TextChannel>client.channels.cache.get(match.channelid)
        if (match.split) {
            if (match.channelid === message.channel.id) {
                if (user.id === match.p1.userid) {
                    if (!(match.p1.donesplit)) {



                        await message.channel.send(new discord.MessageEmbed()
                            .setDescription(`<@${user.id}> & <@${match.p1.partner}> your match has been split.\nYou have 2 hours to complete your memes\nUse ${`!submit`} to submit`)
                            .setColor("#d7be26")
                            .setTimestamp())

                        match.p1.donesplit = true
                        match.p1.time = Math.floor(Date.now() / 1000)
                        await (await client.users.fetch(match.p1.userid)).send(`Your match has been split.\nYou have 2 hours to complete your portion\nUse ${`!submit`} to submit`)
                        if(match.template){
                            await (await client.users.fetch(match.p1.userid)).send(
                                new discord.MessageEmbed()
                                .setTitle("Your first template")
                                .setImage(match.template[0])
                                .setColor("#d7be26")
                                .setTimestamp()
                            )

                            await (await client.users.fetch(match.p1.userid)).send(
                                new discord.MessageEmbed()
                                .setTitle("Your second template")
                                .setImage(match.template[1])
                                .setColor("#d7be26")
                                .setTimestamp()
                            )

                            await (await client.users.fetch(match.p1.partner)).send(
                                new discord.MessageEmbed()
                                .setTitle("Your template")
                                .setImage(match.template[0])
                                .setColor("#d7be26")
                                .setTimestamp()
                            )

                            await (await client.users.fetch(match.p1.partner)).send(
                                new discord.MessageEmbed()
                                .setTitle("Your template")
                                .setImage(match.template[1])
                                .setColor("#d7be26")
                                .setTimestamp()
                            )
                        }

                        await updateActive(match)
                        return;
                    }
                }

                if (user.id === match.p2.userid) {
                    if (!(match.p2.donesplit)) {

                        await message.channel.send(new discord.MessageEmbed()
                            .setDescription(`<@${user.id}> & <@${match.p2.partner}> your match has been split.\nYou have 2 hours to complete your memes\nUse ${`!submit`} to submit`)
                            .setColor("#d7be26")
                            .setTimestamp())

                        match.p2.donesplit = true
                        match.p2.time = Math.floor(Date.now() / 1000)
                        await (await client.users.fetch(match.p2.userid)).send(`Your match has been split.\nYou have 2 hours to complete your portion\nUse ${`!submit`} to submit`)
                        if(match.template){
                            await (await client.users.fetch(match.p2.userid)).send(
                                new discord.MessageEmbed()
                                .setTitle("Your template")
                                .setImage(match.template[0])
                                .setColor("#d7be26")
                                .setTimestamp()
                            )

                            await (await client.users.fetch(match.p2.userid)).send(
                                new discord.MessageEmbed()
                                .setTitle("Your template")
                                .setImage(match.template[1])
                                .setColor("#d7be26")
                                .setTimestamp()
                            )

                            await (await client.users.fetch(match.p2.partner)).send(
                                new discord.MessageEmbed()
                                .setTitle("Your template")
                                .setImage(match.template[0])
                                .setColor("#d7be26")
                                .setTimestamp()
                            )

                            await (await client.users.fetch(match.p2.partner)).send(
                                new discord.MessageEmbed()
                                .setTitle("Your template")
                                .setImage(match.template[1])
                                .setColor("#d7be26")
                                .setTimestamp()
                            )
                        }
                        await updateActive(match)
                        return;
                    }
                }
            }
        }
    }
}

export async function startregularsplit(message: discord.Message, client: discord.Client) {
    //.start @user1 @user2

    //let users: string[] = []
    var args: Array<string> = message.content.slice(prefix.length).trim().split(/ +/g)

    if (args.length < 3) {
        return message.reply("invalid response. Command is `!start @user1 @user2 template link`\n or `!start @user1 @user2 theme description`")
    }

    //console.log(args)

    // for (let i = 0; i < args.length; i++) {
    //     let userid = await getUser(args[i])
    //     if (userid) {
    //         users.push(userid)
    //     }
    // }

    let user1 = message.mentions.users.array()[0]
    let user2 = message.mentions.users.array()[2]

    createAtUsermatch(user1)
    createAtUsermatch(user2)

    let newmatch: activematch = {
        _id: message.channel.id,
        channelid: message.channel.id,
        split: true,
        messageID: "",
        template: [],
        tempfound: false,
        p1: {
            userid: user1.id,
            partner: message.mentions.users.array()[1].id,
            memedone: false,
            donesplit: false,
            time: Math.floor(Date.now() / 1000),
            memelink: [],
            votes: 0,
            voters: [],
            halfreminder: false,
            fivereminder: false,
        },
        p2: {
            userid: user2.id,
            partner: message.mentions.users.array()[3].id,
            memedone: false,
            donesplit: false,
            time: Math.floor(Date.now() / 1000),
            memelink: [],
            votes: 0,
            voters: [],
            halfreminder: false,
            fivereminder: false,
        },
        votetime: Math.floor(Date.now() / 1000),
        votingperiod: false,
        // votemessage: null,
    }

    let templook = new discord.MessageEmbed()
    .setTitle(`Looking for a temp`)
    .setColor("#d7be26")
    .setTimestamp()



    message.channel.send(templook)

    await RandomTemplateFunc(message, client, message.channel.id)

    setTimeout(() => { console.log("Waited 2 seconds"); }, 2000);

    let rantemp = await gettempStruct(message.channel.id)

    rantemp.time = rantemp.time - 2.5
 
    while(rantemp.found === false){
        //console.log(rantemp)
        //await message.reply("IN LOOP")
        if(Math.floor(Date.now()/1000) - rantemp.time > 120){
            
            await deletetempStruct(rantemp._id)
            await (await (<discord.TextChannel>client.channels.cache.get("722616679280148504")).messages.fetch(rantemp.messageid)).delete()
            return await message.channel.send(new discord.MessageEmbed()
            .setTitle(`Random Template Selection failed `)
            .setColor("red")
            .setDescription(`Mods please restart this match`)
            .setTimestamp())
        }
        rantemp = await gettempStruct(message.channel.id)
    }
    newmatch.template.push(rantemp.url)
    await deletetempStruct(rantemp._id)

    await RandomTemplateFunc(message, client, message.channel.id)

    setTimeout(() => { console.log("Waited 2 seconds"); }, 2000);

    let rantemp2 = await gettempStruct(message.channel.id)

    rantemp2.time = rantemp2.time - 2.5
 

    while(rantemp2.found === false){

        if(Math.floor(Date.now()/1000) - rantemp.time > 120){
            
            await deletetempStruct(rantemp2._id)
            await (await (<discord.TextChannel>client.channels.cache.get("722616679280148504")).messages.fetch(rantemp2.messageid)).delete()
            return await message.channel.send(new discord.MessageEmbed()
            .setTitle(`Random Template Selection failed `)
            .setColor("RED")
            .setDescription(`Mods please restart this match`)
            .setTimestamp())
        }
        rantemp2 = await gettempStruct(message.channel.id)
        //console.log(rantemp)
    }

    newmatch.template.push(rantemp2.url)
    await deletetempStruct(rantemp2._id)
    await insertActive(newmatch)

    await vs(message.channel.id, client, [message.mentions.users.array()[0].id, message.mentions.users.array()[2].id])
    await vs(message.channel.id, client, [message.mentions.users.array()[1].id, message.mentions.users.array()[3].id])

    let embed = new discord.MessageEmbed()
        .setTitle(`Match between ${user1.username} & ${message.mentions.users.array()[1].username} and ${user2.username} & ${message.mentions.users.array()[3].username}`)
        .setColor("#d7be26")
        .setDescription(`${user1.username} & ${message.mentions.users.array()[1].username} and ${user2.username} & ${message.mentions.users.array()[3].username} your match has been split.\nContact mods to start your portion\nUse ${`!submit`} to submit`)
        .setTimestamp()

    message.channel.send({ embed }).then(async message => {
        await message.react('🅰️')
        await message.react('🅱️')
    })

}

export async function reload(message: discord.Message, client: discord.Client) {
    let match = await getSingularQuals(message.channel.id)

    if (match) {
        let channel = <discord.TextChannel>client.channels.cache.get(match.channelid)

        // console.log(qual)
        if (!match) {
            console.log("Check 1")
            return;
        }

        console.log("Check 2")
        console.log("Check 3")
        if (Math.floor(Date.now() / 1000) - match.octime > 1800 || match.playersdone.length === match.playerids.length) {

            for (let i = 0; i < match.votes.length; i++) {
                match.votes[i] = []
            }

            if (match.playersdone.length <= 2) {
                match.votingperiod = true
                await updateQuals(match)
                return await qualend(client, channel.id)
            }


            for (let player of match.players) {
                if (player.memedone) {
                    let embed = new discord.MessageEmbed()
                        .setTitle(`Meme #${match.players.indexOf(player) + 1}`)
                        .setColor("#d7be26")
                        .setImage(player.memelink)
                        .setTimestamp()

                    await channel.send(embed)
                }

                else if (!player.memedone) {
                    let embed2 = new discord.MessageEmbed()
                        .setDescription("Player failed to submit meme on time")
                        .setColor("#d7be26")
                        .setTimestamp()

                    await channel.send(embed2)
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

            if (match.template.length > 0 || match.template) {
                await channel.send("\n\nThe theme is: " + match.template)
                //await user.send({ files: [new discord.MessageAttachment(match.template)] })
            }

            await channel.send("You have 2 hours to vote. You can vote for 2 memes!")


            await updateQuals(match)

            await channel.send(`<@&719936221572235295>`)
        }
    }

    else {
        let match = await getMatch(message.channel.id)

        let channelid = <discord.TextChannel>client.channels.cache.get(match.channelid)
        let user1 = (await client.users.fetch(match.p1.userid))
        let user2 = (await client.users.fetch(match.p2.userid))


        if (!(match.split) && ((Math.floor(Date.now() / 1000) - match.p2.time > 2400) && match.p2.memedone === false)
            && ((Math.floor(Date.now() / 1000) - match.p1.time > 2400) && match.p1.memedone === false)) {
            user1.send("You have failed to submit your meme")
            user2.send("You have failed to submit your meme")

            let embed = new discord.MessageEmbed()
                .setColor("#d7be26")
                .setTitle(`Match between ${user1.username} and ${user2.username}`)
                .setDescription(`<@${user1.id}> & <@${user2.id}> have lost\n for not submitting meme on time`)
                .setTimestamp()

            channelid.send(embed)
            // matches.splice(matches.indexOf(match), 1)
            await deleteActive(match)
        }

        else if ((Math.floor(Date.now() / 1000) - match.p1.time > 2400)
            && match.p1.memedone === false && match.p1.donesplit) {
            user1.send("You have failed to submit your meme, your opponet is the winner.")

            let embed = new discord.MessageEmbed()
                .setColor("#d7be26")
                .setTitle(`Match between ${user1.username} and ${user2.username}`)
                .setDescription(`<@${user2.id}> has won!`)
                .setTimestamp()

            channelid.send(embed)
            // matches.splice(matches.indexOf(match), 1)
            await deleteActive(match)
        }

        else if ((Math.floor(Date.now() / 1000) - match.p2.time > 2400)
            && match.p2.memedone === false && match.p2.donesplit) {
            console.log(Date.now() - match.p2.time)
            user2.send("You have failed to submit your meme, your opponet is the winner.")

            let embed = new discord.MessageEmbed()
                .setTitle(`Match between ${user1.username} and ${user2.username}`)
                .setDescription(`<@${user1.id}> has won!`)
                .setColor("#d7be26")
                .setTimestamp()

            channelid.send(embed)
            // matches.splice(matches.indexOf(match), 1)
            await deleteActive(match)
        }





        else if ((!(match.split) && ((Math.floor(Date.now() / 1000) - match.p2.time < 2400) && match.p2.memedone === true)
            && ((Math.floor(Date.now() / 1000) - match.p2.time < 2400) && match.p1.memedone === true))) {


            let embed1 = new discord.MessageEmbed()
                .setDescription("Group 1 Meme #1")
                .setImage(match.p1.memelink[0])
                .setColor("#d7be26")
                .setTimestamp()

            console.log("Player 1 embed done")


            let embed2 = new discord.MessageEmbed()
                .setDescription("Group 1 Meme #2")
                .setImage(match.p1.memelink[1])
                .setColor("#d7be26")
                .setTimestamp()

            let embed3 = new discord.MessageEmbed()
                .setDescription("Group 2 Meme #1")
                .setImage(match.p2.memelink[0])
                .setColor("#d7be26")
                .setTimestamp()

            console.log("Player 1 embed done")


            let embed4 = new discord.MessageEmbed()
                .setDescription("Group 2 Meme #2")
                .setImage(match.p2.memelink[1])
                .setColor("#d7be26")
                .setTimestamp()


            let embed5 = new discord.MessageEmbed()
                .setTitle("Vote for the best meme!")
                .setColor("#d7be26")
                .setDescription(`Vote for Meme 1 reacting with ${emojis[0]}\nVote for Meme 2 by reacting with ${emojis[1]}`)



            await channelid.send(embed1)
            await channelid.send(embed2)

            await channelid.send(embed3)
            await channelid.send(embed4)

            await channelid.send(embed5).then(async msg => {
                match.messageID = msg.id
                await (msg as discord.Message).react(emojis[0])
                await (msg as discord.Message).react(emojis[1])
            })

            //await channelid.send("@eveyone")

            match.votingperiod = true
            match.votetime = (Math.floor(Date.now() / 1000))
            match.p1.voters = []
            match.p1.votes = 0

            match.p2.voters = []
            match.p2.votes = 0
            await updateActive(match)
        }
    }
}

export async function matchstats(message: discord.Message, client: discord.Client){
    let channel = message.mentions.channels.first()
    
    try{
        if(!channel){
            return message.reply("No active matche exists in this channel")
        }
    
        else{
            let match = await getMatch(channel.id)
    
            let em = new discord.MessageEmbed()
            .setTitle(`${channel.name}`)
            .setColor("BLUE")
            .addFields(
                { name: `Partner:`, value: `${(await client.users.cache.get(match.p1.partner)!).username}`, inline:true},
                { name: `${(await client.users.cache.get(match.p1.userid)!).username} Meme Done:`, value: `${match.p1.memedone ? `Yes` : `No` }`, inline:true},
                { name: 'Match Portion Done:', value: `${match.p1.donesplit ? `${match.split ? `Yes` : `Not a split match` }` : `No` }`, inline:true},
                { name: 'Meme Link:', value: `${match.p1.memedone ?   `${match.p1.memelink}` : `No meme submitted yet` }`, inline:true},
                { name: 'Time left', value: `${match.p1.donesplit ? `${match.p1.memedone ? "Submitted meme" : `${120 - Math.floor(((Date.now() / 1000) - match.p1.time)/60)} mins left`}` : `${match.split ? `Hasn't started portion` : `Time up` }` }`, inline:true},
                { name: '\u200B', value: '\u200B' },

                { name: `Partner:`, value: `${(await client.users.cache.get(match.p2.partner)!).username}`, inline:true},
                { name: `${(await client.users.cache.get(match.p2.userid)!).username} Meme Done:`, value: `${match.p2.memedone ? `Yes` : `No` }`, inline:true},
                { name: 'Match Portion Done:', value: `${match.p2.donesplit ? `${match.split ? `Yes` : `Not a split match` }` : `No` }`, inline:true},
                { name: 'Meme Link:', value: `${match.p2.memedone ?   `${match.p2.memelink}` : `No meme submitted yet`}`, inline:true},
                { name: 'Time left', value: `${match.p2.donesplit ? `${match.p2.memedone ? "Submitted meme" : `${120 - Math.floor(((Date.now() / 1000) - match.p2.time)/60)} mins left`}` : `${match.split ? `Hasn't started portion` : `Time up` }` }`, inline:true},
                { name: '\u200B', value: '\u200B' },

                {name: `Voting period:`, value: `${match.votingperiod ? `Yes` : `No`}`, inline:true},
                {name: `Voting time:`, value: `${match.votingperiod ? `${(10800/60) - Math.floor((Math.floor(Date.now() / 1000) - match.votetime)/60)} mins left` : "Voting hasn't started"}`, inline:true}

                

            )

            await message.channel.send(em)
        }
    } catch (err) {
        message.channel.send("```" + err + "```")
        return message.reply("there is an error! Ping blitz and show him the error.")
    }

}

export async function forfeit(message: discord.Message){
    if (await getMatch(message.channel.id)) {
        let match = await getMatch(message.channel.id)

        if(match.p1.userid === message.mentions.users.array()[0].id){
            match.p1.memedone = false
            match.p1.donesplit = true
            match.p1.time = (match.p1.time - 7200)
        }

        else if(match.p2.userid === message.mentions.users.array()[0].id){
            match.p2.memedone = false
            match.p2.donesplit = true
            match.p2.time = (match.p2.time - 7200)
        }

        await updateActive(match)

        return message.reply("Player has been forfeited.")
      }
  
      else if (await getQual(message.channel.id)) {

        let match = await getQual(message.channel.id)

        let i = 0;

        for (i < match.players.length; i++;){
            if (match.players[i].userid === message.mentions.users.array()[0].id){
                break;
            }
        }

        match.players[i].failed = true
        match.players[i].memedone = false
        match.players[i].split = true
        match.players[i].time = (match.players[i].time - 1800)
        match.playersdone.push(match.players[i].userid)

        if(match.players.length - match.playersdone.length === 2){
            for (let e = 0; e < match.players.length; e++){
                if(!match.playersdone.includes(match.players[e].userid)){
                    match.players[e].memedone = true
                    match.players[e].split = true
                    match.playersdone.push(match.players[e].userid)
                }
            }
        }



        await updateQuals(match)
        return message.reply("Player has been forfeited.")
      }
  
      else {
        message.reply("there are no matches")
      }
}


































// let channelid = <discord.TextChannel>client.channels.cache.get(match.channelid)

// if (match.votingperiod === false) {

//     for (let u of match.players) {

//         if (match.playersdone.length === match.players.length) {
//             match.split = false
//             match.votingperiod = true
//             match.votetime = Math.floor(Date.now() / 1000)
//             await updateQuals(match)
//         }

//         console.log(u)
//         console.log(match.players.length)


//         if (Math.floor(Date.now() / 1000) - match.octime > 1800  || match.playersdone.length === match.players.length && match.split === false) {

//             // if (match.playersdone.length <= 2) {
//             //     return await qualend(client, channelid.id)
//             // }

//             for (let x of match.players) {
//                 if (x.memedone || x.failed === false) {
//                     let embed = new discord.MessageEmbed()
//                         .setColor("#d7be26")
//                         .setImage(x.memelink)
//                         .setTimestamp()
//                     if (!match.playersdone.includes(x.userid)) {
//                         match.playersdone.push(x.userid)
//                     }

//                     await channelid.send(embed)
//                 }

//                 else if(x.memedone === false || x.failed === true){
//                     let embed2 = new discord.MessageEmbed()
//                         .setDescription("Player failed to submit meme on time")
//                         .setColor("#d7be26")
//                         .setTimestamp()
//                     await channelid.send(embed2)
//                 }
//             }

//             //await deleteQuals(match)
//             let em = new discord.MessageEmbed()
//                 .setDescription("Please vote by clicking the number emotes.\nHit the recycle emote to reset votes")
//                 .setColor("#d7be26")
//                 .setTimestamp()

//             channelid.send(em).then(async msg => {
//                 for (let i = 0; i < match.playerids.length; i++) {
//                     await msg.react(emojis[i])
//                 }
//                 await msg.react(emojis[6])
//             })
//             match.votingperiod = true
//             await updateQuals(match)
//             return;
//         }

//         if (match.split) {
//             if (Math.floor(Date.now() / 1000) - u.time > 1800 && u.split === true && u.failed === false) {
//                 let embed3 = new discord.MessageEmbed()
//                     .setDescription("You failed to submit meme on time")
//                     .setColor("#d7be26")
//                     .setTimestamp()
//                 u.failed = true
//                 match.playersdone.push(u.userid)
//                 await updateQuals(match)
//                 await (await client.users.fetch(u.userid)).send(embed3)
//             }

//             if (match.playersdone.length === match.players.length) {
//                 match.split = false
//                 match.votingperiod = true
//                 match.votetime = Math.floor(Date.now() / 1000)
//                 await updateQuals(match)
//             }

//         }
//     }
// }

// if (match.votingperiod) {
//     //7200
//     if ((Math.floor(Date.now() / 1000) - match.votetime > 7200) || match.playersdone.length <= 2) {
//         await qualend(client, channelid.id)
//     }
// }