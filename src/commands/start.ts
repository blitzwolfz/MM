import * as discord from "discord.js"
import { getUser, emojis, dateBuilder } from "../misc/utils"
const prefix = process.env.PREFIX!
import { activematch, qualmatch, players } from "../misc/struct"
import { end, qualend } from "./winner"
//import { vs } from "./card"
import {
    updateActive, deleteActive, insertActive, insertQuals,
    updateQuals, getActive, getQuals, getSingularQuals,
    getMatch, gettempStruct, deletetempStruct, getQual, insertReminder, deleteReminder, getReminder, getExhibition, updateExhibition, getDuelProfile, updateDuelProfile
} from "../misc/db"
import { createAtUsermatch } from "./user"
import { qualrunn } from "./qualrunn"
import { RandomTemplateFunc } from "../misc/randomtemp"
import { winner } from "./card"
//const Canvas = require('canvas');

export async function start(message: discord.Message, client: discord.Client) {
    //.start @user1 @user2

    //let users: string[] = []
    console.time("OG:")
    var args: Array<string> = message.content.slice(prefix.length).trim().split(/ +/g)

    if (args.length < 3) {
        return message.reply("invalid response. Command is `!start @user1 @user2 template link`\n or `!start @user1 @user2 theme description`")
    }

    //console.log(args)
    let users = []
    for (let i = 0; i < args.length; i++) {
        let userid = await getUser(args[i])
        if (userid) {
            users.push(userid)
        }
    }

    let user1 = await client.users.fetch(users[0])
    let user2 = await client.users.fetch(users[1])

    createAtUsermatch(user1)
    createAtUsermatch(user2)

    let newmatch: activematch = {
        _id: message.channel.id,
        channelid: message.channel.id,
        split: false,
        exhibition: false,
        messageID: "",
        template: [],
        theme: "",
        tempfound: false,
        p1: {
            userid: message.mentions.users.array()[0].id,
            memedone: false,
            donesplit: true,
            time: Math.floor(Date.now() / 1000),
            memelink: "",
            votes: 0,
            voters: [],
            halfreminder: false,
            fivereminder: false,
        },
        p2: {
            userid: message.mentions.users.array()[1].id,
            memedone: false,
            donesplit: true,
            time: Math.floor(Date.now() / 1000),
            memelink: "",
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
        .setTitle(`Looking for a ${["th", "theme"].includes(args[3]) ? "Theme" : "Template"}`)
        .setColor("#d7be26")
        .setTimestamp()



    message.channel.send(templook)

    if (["th", "theme"].includes(args[3])) {
        await RandomTemplateFunc(message, client, message.channel.id, true)

        let rantemp = await gettempStruct(message.channel.id)

        rantemp.time = rantemp.time - 2.5

        while (rantemp.found === false) {

            if (Math.floor(Date.now() / 1000) - rantemp.time > 120) {

                await deletetempStruct(rantemp._id)
                await (await (<discord.TextChannel>client.channels.cache.get("722616679280148504")).messages.fetch(rantemp.messageid)).delete()
                return await message.channel.send(new discord.MessageEmbed()
                    .setTitle(`Random Theme Selection failed `)
                    .setColor("red")
                    .setDescription(`Mods please restart this match`)
                    .setTimestamp())
            }
            rantemp = await gettempStruct(message.channel.id)
        }

        newmatch.theme = rantemp.url
        await deletetempStruct(rantemp._id)

        await insertActive(newmatch)

        //await vs(message.channel.id, client, [message.mentions.users.array()[0].id, message.mentions.users.array()[1].id])

        let embed = new discord.MessageEmbed()
            .setTitle(`Match between ${user1.username ? user1.username : (await message.guild!.members.fetch(user1.id)).nickname} and ${user2.username ? user2.username : (await message.guild!.members.fetch(user2.id)).nickname}`)
            .setColor("#d7be26")
            .setDescription(`<@${user1.id}> and <@${user2.id}> both have 1 hours to complete your meme.\n Contact admins if you have an issue.`)
            .setTimestamp()



        message.channel.send({ embed })

        await user1.send(new discord.MessageEmbed()
            .setTitle("Your theme")
            .setDescription(rantemp.url)
            .setColor("#d7be26")
            .setTimestamp())

        await user2.send(new discord.MessageEmbed()
            .setTitle("Your theme")
            .setDescription(rantemp.url)
            .setColor("#d7be26")
            .setTimestamp())

    }

    else {
        await RandomTemplateFunc(message, client, message.channel.id, false)


        let rantemp = await gettempStruct(message.channel.id)

        rantemp.time = rantemp.time - 2.5

        console.log(rantemp)

        while (rantemp.found === false) {

            if (Math.floor(Date.now() / 1000) - rantemp.time > 120) {

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

        await insertActive(newmatch)

        //await vs(message.channel.id, client, [message.mentions.users.array()[0].id, message.mentions.users.array()[1].id])

        let embed = new discord.MessageEmbed()
            .setTitle(`Match between ${user1.username ? user1.username : (await message.guild!.members.fetch(user1.id)).nickname} and ${user2.username ? user2.username : (await message.guild!.members.fetch(user2.id)).nickname}`)
            .setColor("#d7be26")
            .setDescription(`<@${user1.id}> and <@${user2.id}> both have 1 hours to complete your meme.\n Contact admins if you have an issue.`)
            .setTimestamp()



        message.channel.send({ embed })

        await user1.send(new discord.MessageEmbed()
            .setTitle("Your template")
            .setImage(rantemp.url)
            .setColor("#d7be26")
            .setTimestamp())

        await user2.send(new discord.MessageEmbed()
            .setTitle("Your template")
            .setImage(rantemp.url)
            .setColor("#d7be26")
            .setTimestamp())
    }




    // if (["th", "theme"].includes(args[3])) {
    // }

    // else{
    //     await (<discord.TextChannel>client.channels.cache.get("724827952390340648")).messages.fetch("724827952390340648").then(async msg => {
    //         await message.reply(msg)
    //     })
    // }


    await user1.send(`You have 1 hour to complete your meme\nUse \`!submit\` to submit meme`)
    await user2.send(`You have 1 hour to complete your meme\nUse \`!submit\` to submit meme`)
    console.timeEnd("OG:")
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
        template: [],
        istheme: false,
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

    console.log(x)

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
        template: [],
        istheme: false,
        playersdone: [],
        votingperiod: false,
        votetime: 0

    }

    //await vs(message, client, users)

    if (args.includes("template")) {
        await RandomTemplateFunc(message, client, message.channel.id, false)


        let rantemp = await gettempStruct(message.channel.id)

        rantemp.time = rantemp.time - 2.5

        console.log(rantemp)

        while (rantemp.found === false) {

            if (Math.floor(Date.now() / 1000) - rantemp.time > 120) {

                await deletetempStruct(rantemp._id)
                await (await (<discord.TextChannel>client.channels.cache.get("722616679280148504")).messages.fetch(rantemp.messageid)).delete()
                return await message.channel.send(new discord.MessageEmbed()
                    .setTitle(`Random Template Selection failed `)
                    .setColor("RED")
                    .setDescription(`Mods please restart this match`)
                    .setTimestamp())
            }
            rantemp = await gettempStruct(message.channel.id)
        }

        newmatch.template.push(rantemp.url)
        await deletetempStruct(rantemp._id)
    }


    else if (args.includes("theme")) {
        newmatch.template.push(args.slice(args.indexOf("theme") + 1).join(" "))

        await (<discord.TextChannel>client.channels.cache.get("738047732312309870")).send(`<#${message.channel.id}> theme is ${args.slice(args.indexOf("theme") + 1).join(" ")}`);
        //     let user = await client.fetchUser(u.userid)
        //     await user.send(`Your theme is: ${args.splice(5+x)}`)
        // }
    }

    else {
        await RandomTemplateFunc(message, client, message.channel.id, true)

        let rantemp = await gettempStruct(message.channel.id)

        rantemp.time = rantemp.time - 2.5

        while (rantemp.found === false) {

            if (Math.floor(Date.now() / 1000) - rantemp.time > 120) {

                await deletetempStruct(rantemp._id)
                await (await (<discord.TextChannel>client.channels.cache.get("722616679280148504")).messages.fetch(rantemp.messageid)).delete()
                return await message.channel.send(new discord.MessageEmbed()
                    .setTitle(`Random Theme Selection failed `)
                    .setColor("red")
                    .setDescription(`Mods please restart this match`)
                    .setTimestamp())
            }
            rantemp = await gettempStruct(message.channel.id)            
        }

        newmatch.template.push(rantemp.url)
        newmatch.istheme = true
        await deletetempStruct(rantemp._id)
        await (<discord.TextChannel>client.channels.cache.get("738047732312309870")).send(`<#${message.channel.id}> theme is ${newmatch.template}`)
    }



    let embed = new discord.MessageEmbed()
        .setTitle(`Qualifiying match`)
        .setColor("#d7be26")
        .setDescription(`This match has been split. Please contact mods to start your portion`)
        .setTimestamp()



    await message.channel.send({ embed }).then(async message => {
        let emmojis = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫']
        for (let i = 0; i < users.length; i++) {
            console.log(emmojis[i])
            await message.react(emmojis[i])
        }

    })



    //console.log(newmatch)
    // qualmatches.push(newmatch)

    await insertQuals(newmatch)
    // await message.edit()
    // return qualmatches;
}

export async function running(client: discord.Client): Promise<void> {
    let matches: activematch[] = await getActive()
    for (const match of matches) {
        if (match.exhibition === true) continue;
        //console.log(Math.floor(Date.now() / 1000) - match.votetime)
        console.log(Math.floor(Date.now() / 1000) - match.p1.time, "time")
        console.log(Math.floor(Date.now() / 1000) - match.p1.time <= 1260 && Math.floor(Date.now() / 1000) - match.p1.time >= 1200)
        let channelid = <discord.TextChannel>client.channels.cache.get(match.channelid)
        let user1 = (await client.users.fetch(match.p1.userid))
        let user2 = (await client.users.fetch(match.p2.userid))
        console.log(user1.id)
        console.log(user2.id)
        

        if (match.votingperiod === false) {

            // console.log('okk')
            // if (!match.exhibition && ((Math.floor(Date.now() / 1000) - match.p1.time <= 1860 && Math.floor(Date.now() / 1000) - match.p1.time >= 1800) 
            // && match.p1.memedone === false && match.p1.donesplit && match.p1.halfreminder === false)) {

            //     console.log("OK")
            //     match.p1.halfreminder = true

            //     let embed = new discord.MessageEmbed()
            //         .setColor("#d7be26")
            //         .setTitle(`Match between ${user1.username} and ${user2.username}`)
            //         .setDescription(`You have 30 mins left.\nUse \`!submit\` to submit`)
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

            // else if (!match.exhibition && (Math.floor(Date.now() / 1000) - match.p2.time <= 1860 && Math.floor(Date.now() / 1000) - match.p2.time >= 1800) 
            // && match.p2.memedone === false && match.p2.donesplit && match.p2.halfreminder === false) {
            //     console.log("OK")
            //     match.p2.halfreminder = true
            //     let embed = new discord.MessageEmbed()
            //         .setColor("#d7be26")
            //         .setTitle(`Match between ${user1.username} and ${user2.username}`)
            //         .setDescription(`You have 30 mins left.\nUse \`!submit\` to submit`)
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

            if (!(match.split) && ((Math.floor(Date.now() / 1000) - match.p2.time > 3600) && match.p2.memedone === false)
                && ((Math.floor(Date.now() / 1000) - match.p1.time > 3600) && match.p1.memedone === false)) {
                user1.send("You have lost because did not submit your meme")
                user2.send("You have lost because did not submit your meme")

                let embed = new discord.MessageEmbed()
                    .setColor("#d7be26")
                    .setTitle(`Match between ${user1.username} and ${user2.username}`)
                    .setDescription(`<@${user1.id}> & <@${user2.id}> have lost\n for not submitting meme on time`)
                    .setTimestamp()

                channelid.send(embed)
                // matches.splice(matches.indexOf(match), 1)
                try {
                    await deleteReminder(await getReminder(match._id))

                    try {
                        await deleteReminder(await getReminder(match.p1.userid))
                    } catch {
                        console.log(`Couldn't delete reminder for ${match.p1.userid}`)
                    }

                    try {
                        await deleteReminder(await getReminder(match.p2.userid))
                    } catch {
                        console.log(`Couldn't delete reminder for ${match.p2.userid}`)
                    }

                } catch {
                    console.log("Couldn't delete reminders")
                }
                await deleteActive(match)
            }

            else if ((Math.floor(Date.now() / 1000) - match.p1.time > 3600)
                && match.p1.memedone === false && match.p1.donesplit) {
                user1.send("You have failed to submit your meme, your opponent  is the winner.")

                let embed = new discord.MessageEmbed()
                    .setColor("#d7be26")
                    .setTitle(`Match between ${user1.username} and ${user2.username}`)
                    .setDescription(`<@${user2.id}> has won!`)
                    .setTimestamp()

                channelid.send(embed)
                try {
                    await deleteReminder(await getReminder(match._id))

                    try {
                        await deleteReminder(await getReminder(match.p1.userid))
                    } catch {
                        console.log(`Couldn't delete reminder for ${match.p1.userid}`)
                    }

                    try {
                        await deleteReminder(await getReminder(match.p2.userid))
                    } catch {
                        console.log(`Couldn't delete reminder for ${match.p2.userid}`)
                    }

                } catch {
                    console.log("Couldn't delete reminders")
                }
                // matches.splice(matches.indexOf(match), 1)
                await deleteActive(match)
            }

            else if ((Math.floor(Date.now() / 1000) - match.p2.time > 3600)
                && match.p2.memedone === false && match.p2.donesplit) {
                console.log(Date.now() - match.p2.time)
                user2.send("You have failed to submit your meme, your opponent  is the winner.")

                let embed = new discord.MessageEmbed()
                    .setTitle(`Match between ${user1.username} and ${user2.username}`)
                    .setDescription(`<@${user1.id}> has won!`)
                    .setColor("#d7be26")
                    .setTimestamp()

                channelid.send(embed)
                try {
                    await deleteReminder(await getReminder(match._id))

                    try {
                        await deleteReminder(await getReminder(match.p1.userid))
                    } catch {
                        console.log(`Couldn't delete reminder for ${match.p1.userid}`)
                    }

                    try {
                        await deleteReminder(await getReminder(match.p2.userid))
                    } catch {
                        console.log(`Couldn't delete reminder for ${match.p2.userid}`)
                    }

                } catch {
                    console.log("Couldn't delete reminders")
                }
                // matches.splice(matches.indexOf(match), 1)
                await deleteActive(match)
            }


            else if ((!(match.split) && ((Math.floor(Date.now() / 1000) - match.p2.time <= 3600) && match.p2.memedone === true)
                && ((Math.floor(Date.now() / 1000) - match.p1.time <= 3600) && match.p1.memedone === true))) {


                if (Math.floor(Math.random() * (5 - 1) + 1) % 2 === 1) {
                    let temp = match.p1

                    match.p1 = match.p2

                    match.p2 = temp

                    //await updateActive(match)
                }

                if (match.template) {
                    channelid.send(
                        new discord.MessageEmbed()
                            .setTitle("Template")
                            .setImage(match.template[0])
                            .setColor("#07da63")
                            .setTimestamp()
                    )
                }

                if (match.theme) {
                    channelid.send(
                        new discord.MessageEmbed()
                            .setTitle("Theme")
                            .setDescription(`Theme is: ${match.theme}`)
                            .setColor("#07da63")
                            .setTimestamp()
                    )
                }



                let embed1 = new discord.MessageEmbed()
                    .setDescription("Player 1")
                    .setImage(match.p1.memelink)
                    .setColor("#d7be26")
                    .setTimestamp()

                console.log("Player 1 embed done")


                let embed2 = new discord.MessageEmbed()
                    .setDescription("Player 2")
                    .setImage(match.p2.memelink)
                    .setColor("#d7be26")
                    .setTimestamp()


                let embed3 = new discord.MessageEmbed()
                    .setTitle("Vote for the best meme!")
                    .setColor("#d7be26")
                    .setDescription(`Vote for User 1 reacting with ${emojis[0]}\nVote for User 2 by reacting with ${emojis[1]}`)



                await channelid.send(embed1)
                await channelid.send(embed2)

                await channelid.send(embed3).then(async msg => {
                    match.messageID = msg.id
                    await (msg as discord.Message).react(emojis[0])
                    await (msg as discord.Message).react(emojis[1])
                })

                //await channelid.send("@eveyone")

                match.votingperiod = true
                match.votetime = (Math.floor(Date.now() / 1000))

                if (!match.exhibition) {
                    await channelid.send(`<@&719936221572235295>`)
                    await channelid.send("You have 2 hours to vote!")
                }




                if (match.exhibition) {
                    match.votetime = ((Math.floor(Date.now() / 1000)) - 5400)
                    await channelid.send("You have 30 mins to vote!")
                    await channelid.send(`<@&783003389390487582>`)
                }

                await updateActive(match)
                try {
                    await deleteReminder(await getReminder(match._id))

                    try {
                        await deleteReminder(await getReminder(match.p1.userid))
                    } catch {
                        console.log(`Couldn't delete reminder for ${match.p1.userid}`)
                    }

                    try {
                        await deleteReminder(await getReminder(match.p2.userid))
                    } catch {
                        console.log(`Couldn't delete reminder for ${match.p2.userid}`)
                    }

                } catch {
                    console.log("Couldn't delete reminders")
                }
            }

        }

        if (match.votingperiod === true && !match.split) {
            //7200
            if ((Math.floor(Date.now() / 1000) - match.votetime > 7200) && !match.split) {
                await end(client, match.channelid)
            }
        }

    }
}

export async function duelrunning(client: discord.Client) {
    console.log("FFF")
    let matches = await getActive()
    var ex = await getExhibition()
    

    for (let m of matches) {
        
        try {
            if(m.exhibition === false) continue;
            console.log(m._id)
            if (m.p1.donesplit === true && m.p1.memedone === false && (Math.floor(Date.now())/1000 - m.p1.time > 1800) ||
                m.p2.donesplit === true && m.p2.memedone === false && (Math.floor(Date.now())/1000 - m.p2.time > 1800)){
                    (<discord.TextChannel>await client.channels.cache.get(m._id)).send(
                        new discord.MessageEmbed()
                            .setTitle(`${client.users.cache.get(m.p1.userid)?.username}-vs-${client.users.cache.get(m.p1.userid)?.username}`)
                            .setDescription(`${m.p1.memedone ? `${client.users.cache.get(m.p1.userid)?.username}` : `${client.users.cache.get(m.p2.userid)?.username}`} has won!`)
                            .setColor("#d7be26")
                    )
                await deleteActive(m)
            }

            if (m.p1.donesplit && m.p1.memedone 
                && m.p2.memedone && m.p2.donesplit 
                && m.split === false && m.votingperiod === false) {
                await exhibitionVotingLogic(client, m)
            }

            if (m.votingperiod === true && (Math.floor(Date.now() / 1000) - m.votetime > 7200)) {
                await exhibitionResults(client, m)
            }
            
        } catch (error) {
            console.log(error.message)
        }
    }

    for(let ii = 0; ii < ex.activematches.length; ii++){
        if(<discord.TextChannel>await client.channels.cache.get(ex.activematches[ii]) === undefined){
            console.log("Cum 3")
            ex.activematches.splice(ii, 1)
            continue
        }

        //let guild:discord.Guild | undefined = (await client.guilds.cache.get((<discord.TextChannel>await client.channels.cache.get(ex.activematches[ii])).guild.id)!)

        // if(!guild?.channels.cache.has(ex.activematches[ii]) 
        //     && await client.guilds.cache.get((<discord.TextChannel>await 
        //     client.channels.cache.get(ex.activematches[ii])).guild.id)!.name.toLowerCase() === guild.name.toLowerCase()
        //     ){
        //         console.log("Cum")
        //         ex.activematches.splice(ii, 1)
        //         ii++
        //         continue;
        // }
        
        let ch = (<discord.TextChannel>await client.channels.cache.get(ex.activematches[ii]))

        if(!ch || ch === undefined){
            console.log("Cum 3")
            ex.activematches.splice(ii, 1)
            continue
        }

        if(Math.floor(Date.now() / 1000) - Math.floor(ch.createdTimestamp/1000 ) > 7200){
            (<discord.TextChannel>await client.channels.cache.get(ex.activematches[ii])).send("Cum 2")
            await ch.delete()
            ex.activematches.splice(ii, 1)
            continue
        }
        

    }

    for(let i = 0; i < ex.cooldowns.length; i++){

        let us = await client.users.fetch(ex.cooldowns[i].user)

        if(!ex.cooldowns[i]){
            continue
        }

        if(Math.floor(Date.now() / 1000) - Math.floor(ex.cooldowns[i].time) >= 1800){
            try{
                await us.send("You can start another exhibition match!")
            } catch {
                console.log("Could not dm user that cooldown is over")
            }
            
            ex.cooldowns.splice(i, 1)
            i++
        }
    }
    await updateExhibition(ex)
    console.log("FFF2")
}

async function exhibitionResults(client: discord.Client, m: activematch) {
    console.log("GGG")
    let channel = <discord.TextChannel>await client.channels.cache.get(m._id)
    let guild = await client.guilds.cache.get((<discord.TextChannel>await client.channels.cache.get(m._id)).guild.id)!
    let d1 = await getDuelProfile(m.p1.userid, guild.id)
    let d2 = await getDuelProfile(m.p2.userid, guild.id)

    if(m.p1.memedone === true && m.p2.memedone === false || m.p1.memedone === false && m.p2.memedone === true){
        if(m.p1.memedone){
            channel.send(
                new discord.MessageEmbed()
                    .setTitle(`${client.users.cache.get(m.p1.userid)?.username} has won!`)
                    .setDescription(`${client.users.cache.get(m.p1.userid)?.username} beat ${client.users.cache.get(m.p2.userid)?.username}`)
                    .setColor("#d7be26")
            );
        }

        if(m.p2.memedone){
            channel.send(
                new discord.MessageEmbed()
                    .setTitle(`${client.users.cache.get(m.p2.userid)?.username} has won!`)
                    .setDescription(`${client.users.cache.get(m.p2.userid)?.username} beat ${client.users.cache.get(m.p1.userid)?.username}`)
                    .setColor("#d7be26")
            );
        }
        return;
    }

    if (m.p1.votes > m.p2.votes) {
        d1.wins += 1
        d1.votetally = m.p1.votes
        d1.points += (25 + (m.p1.votes * 5))
        d2.loss += 1
        d2.votetally = m.p2.votes
        d2.points += (m.p2.votes * 5) 


        channel.send(
            new discord.MessageEmbed()
                .setTitle(`${client.users.cache.get(m.p1.userid)?.username} has won!`)
                .setDescription(`${client.users.cache.get(m.p1.userid)?.username} beat ${client.users.cache.get(m.p2.userid)?.username}\n` +
                    `by a score of ${m.p1.votes} to ${m.p2.votes} with Meme 1`)
                .setColor("#d7be26")
        );
      
        channel.send(
            await winner(client, m.p1.userid)
        )

        if(guild.name.toLowerCase() === "MemeRoyale".toLowerCase()){
            await (<discord.TextChannel>client.channels.cache.get((await client.guilds.cache.find(x => x.name.toLowerCase() === "MemeRoyale".toLowerCase())!
            .channels.cache.find(x => x.name === "winning-duel-memes")!.id))).send(
                new discord.MessageEmbed()
                .setColor("#d7be26")
                .setImage(m.p1.memelink)
                .setDescription(`${client.users.cache.get(m.p1.userid)?.username} beat ${client.users.cache.get(m.p2.userid)?.username}\n` +
                `by a score of ${m.p1.votes} to ${m.p2.votes} with Meme 1`)
                .setFooter(dateBuilder())
            )
        }
    }

    else if (m.p1.votes < m.p2.votes) {
        d1.loss += 1
        d1.votetally = m.p1.votes
        d1.points += (m.p2.votes * 5) 
        d2.wins += 1
        d2.votetally = m.p2.votes
        d1.points += (25 + (m.p1.votes * 5))

        channel.send(
            new discord.MessageEmbed()
                .setTitle(`${client.users.cache.get(m.p2.userid)?.username} has won!`)
                .setDescription(`${client.users.cache.get(m.p2.userid)?.username} beat ${client.users.cache.get(m.p1.userid)?.username}\n` +
                    `by a score of ${m.p2.votes} to ${m.p1.votes} with Meme 2`)
                .setColor("#d7be26")
        );

        channel.send(
            await winner(client, m.p2.userid)
        )
        
        if(guild.name.toLowerCase() === "MemeRoyale".toLowerCase()){
            await (<discord.TextChannel>client.channels.cache.get((await client.guilds.cache.find(x => x.name.toLowerCase() === "MemeRoyale".toLowerCase())!
            .channels.cache.find(x => x.name === "winning-duel-memes")!.id))).send(
                new discord.MessageEmbed()
                .setColor("#d7be26")
                .setImage(m.p2.memelink)
                .setDescription(`${client.users.cache.get(m.p2.userid)?.username} beat ${client.users.cache.get(m.p1.userid)?.username}\n` +
                `by a score of ${m.p2.votes} to ${m.p1.votes} with Meme 2`)
                .setFooter(dateBuilder())
            )
        }
    }

    else if (m.p1.votes === m.p2.votes) {
        d1.votetally = m.p1.votes
        d2.votetally = m.p2.votes
        channel.send(
            new discord.MessageEmbed()
                .setTitle(`Both users come to a draw`)
                .setDescription(`${client.users.cache.get(m.p2.userid)?.username} and ${client.users.cache.get(m.p1.userid)?.username}\n` +
                    `both got a score of ${m.p2.votes}`)
                .setColor("#d7be26")
        );
    }
    console.log("GGG2")
    if(guild.name.toLowerCase() !== "MemeRoyale".toLowerCase()){
        let e = new discord.MessageEmbed()
        .setTitle("Interested in more?")
        .setDescription(
          "Come join us in the "+
          "in the Meme Royale Server.\n"+
          "You can play more duels, and participate in our tournament\n"+
          "with a chance of winning our Cash Prizes.\nClick on the link the title to join."
        )
        .setURL("https://discord.gg/GK3R5Vt3tz")
        .setColor("#d7be26")
    
    
        await channel.send(e)
    }

    await updateDuelProfile(d1._id, d1, guild.id)
    await updateDuelProfile(d2._id, d2, guild.id)
    return await deleteActive(m)
}

async function exhibitionVotingLogic(client: discord.Client, m: activematch) {
    console.log("HHH")
    let channel = <discord.TextChannel>client.channels.cache.get(m._id)!
    let guild = await client.guilds.cache.get((<discord.TextChannel>await client.channels.cache.get(m._id)).guild.id)!
    console.log(m._id)

    if (Math.floor(Math.random() * (5 - 1) + 1) % 2 === 1) {
        let temp = m.p1

        m.p1 = m.p2

        m.p2 = temp

        //await updateActive(match)
    }

    if (m.theme) {
        channel.send(
            new discord.MessageEmbed()
                .setTitle("Theme")
                .setDescription(`The theme is ${m.theme}`)
                .setColor("GREEN")
        ).then(async msg => {
            m.messageID = (msg.id)
        })
    }

    else {
        channel.send(
            new discord.MessageEmbed()
                .setTitle("Template")
                .setImage(m.template[0])
                .setColor("GREEN")
        ).then(async msg => {
            m.messageID = (msg.id)
        })
    }

    channel.send(
        new discord.MessageEmbed()
            .setTitle("Player 1's Meme")
            .setImage(m.p1.memelink)
            .setColor("#d7be26")
    ).then(async msg => {
        m.messageID = (msg.id)
    })

    channel.send(
        new discord.MessageEmbed()
            .setTitle("Player 2's Meme")
            .setImage(m.p2.memelink)
            .setColor("#d7be26")
    ).then(async msg => {
        m.messageID = (msg.id)
    })

    await channel.send(
        new discord.MessageEmbed()
            .setTitle("Voting time")
            .setDescription(`Vote for Meme 1 by reacting with 1️⃣\nVote for Meme 2 by reacting with 2️⃣\nYou have **30 mins** to vote`)
            .setColor("#d7be26")
    ).then(async (msg) => {
        msg.react('1️⃣')
        msg.react('2️⃣')
        m.messageID = (msg.id)
    })

    let id = guild.roles.cache.find(x => x.name.toLowerCase().includes("duel"))
    await channel.send(`${id}`)

    m.votingperiod = true
    m.votetime = ((Math.floor(Date.now() / 1000)) - 5400)

    await updateActive(m)
    console.log("HHH2")
}


export async function qualrunning(client: discord.Client) {
    let qualmatches: qualmatch[] = await getQuals()

    for (let match of qualmatches) {
        await qualrunn(match, match.channelid, client)
    }

    //await running(client)
}

export async function splitqual(client: discord.Client, message: discord.Message, ...userid: string[]) {
    let user = await (await client.users.fetch(userid[0] || message.mentions!.users!.first()!.id));
    let qualmatches: qualmatch[] = await getQuals()

    for (let match of qualmatches) {
        let channelid = <discord.TextChannel>client.channels.cache.get(match.channelid)

        if (match.channelid === message.channel.id) {
            for (let u of match.players) {
                console.log(u)
                if (u.userid === user.id && u.memedone === false && u.split === false) {
                    u.time = Math.floor(Date.now() / 1000)
                    await channelid.send(new discord.MessageEmbed()
                        .setDescription(`<@${user.id}> your qualifier match has been split.\nYou have 30 mins to complete your meme\nUse \`!qualsubmit\` to submit`)
                        .setColor("#d7be26")
                        .setTimestamp())
                    u.split = true

                    await user.send(`<@${user.id}> your qualifier match has been split.\nYou have 30 mins to complete your meme\nUse \`!qualsubmit\` to submit`)


                    if (match.template.length > 0 && match.istheme || match.template && match.istheme) {
                        await user.send("\n\nHere is your theme(s): " + match.template[0])
                        
                        //await user.send({ files: [new discord.MessageAttachment(match.template)] })
                    }

                    else if (match.istheme === false) {
                        await user.send(new discord.MessageEmbed()
                            .setTitle("Your template")
                            .setImage(match.template[0])
                            .setColor("#d7be26")
                            .setTimestamp())
                    }

                    await updateQuals(match)

                    let timeArr:number[] = []
                    timeArr.push(3300)
                    timeArr.push(2700)
            
                    await insertReminder(
                        {
                            _id:u.userid,
                            mention: "",
                            channel: "",
                            type: "meme",
                            time:timeArr,
                            timestamp:Math.floor(Date.now()/1000),
                            basetime:3600
                        }
                    )
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

export async function splitregular(message: discord.Message, client: discord.Client, ...userid: string[]) {
    let user = await client.users.fetch(userid[0] || message.mentions!.users!.first()!.id);
    let matches: activematch[] = await getActive()

    // await user2.send(new discord.MessageEmbed()
    // .setTitle("Your template")
    // .setImage(rantemp.url)
    // .setColor("#d7be26")
    // .setTimestamp())

    // await user2.send(new discord.MessageEmbed()
    // .setTitle("Your theme")
    // .setDescription(rantemp.url)
    // .setColor("#d7be26")
    // .setTimestamp())

    for (let match of matches) {
        //let channel = <discord.TextChannel>client.channels.cache.get(match.channelid)
        if (match.split) {
            if (match.channelid === message.channel.id) {
                if (user.id === match.p1.userid) {
                    if (!(match.p1.donesplit)) {



                        await message.channel.send(new discord.MessageEmbed()
                            .setDescription(`<@${user.id}> your match has been split.\nYou have 1 hours to complete your meme\nUse ${`!submit`} to submit to submit your meme`)
                            .setColor("#d7be26")
                            .setTimestamp())

                        match.p1.donesplit = true
                        match.p1.time = Math.floor(Date.now() / 1000)
                        await (await client.users.fetch(match.p1.userid)).send(`Your match has been split.\nYou have 1 hours to complete your portion\nUse ${`!submit`} to submit to submit your meme`)
                        if (match.template) {
                            await (await client.users.fetch(match.p1.userid)).send(
                                new discord.MessageEmbed()
                                    .setTitle("Your template")
                                    .setImage(match.template[0])
                                    .setColor("#d7be26")
                                    .setTimestamp()
                            )
                        }

                        if (match.theme) {
                            await (await client.users.fetch(match.p1.userid)).send(
                                new discord.MessageEmbed()
                                    .setTitle("Your theme")
                                    .setDescription(match.theme)
                                    .setColor("#d7be26")
                                    .setTimestamp()
                            )
                        }

                        await updateActive(match)

                        let timeArr:number[] = []
                        timeArr.push(3300)
                        timeArr.push(2700)
                        timeArr.push(1800)
                
                        await insertReminder(
                            {
                                _id:match.p1.userid,
                                mention: "",
                                channel: "",
                                type: "meme",
                                time:timeArr,
                                timestamp:Math.floor(Date.now()/1000),
                                basetime:3600
                            }
                        )

                        return;
                    }
                }

                if (user.id === match.p2.userid) {
                    if (!(match.p2.donesplit)) {

                        await message.channel.send(new discord.MessageEmbed()
                            .setDescription(`<@${user.id}> your match has been split.\nYou have 1 hours to complete your meme\nUse ${`!submit`} to submit to submit your meme`)
                            .setColor("#d7be26")
                            .setTimestamp())

                        match.p2.donesplit = true
                        match.p2.time = Math.floor(Date.now() / 1000)
                        await (await client.users.fetch(match.p2.userid)).send(`Your match has been split.\nYou have 1 hours to complete your portion\nUse ${`!submit`} to submit to submit your meme`)

                        if (match.template) {
                            await (await client.users.fetch(match.p2.userid)).send(
                                new discord.MessageEmbed()
                                    .setTitle("Your template")
                                    .setImage(match.template[0])
                                    .setColor("#d7be26")
                                    .setTimestamp()
                            )
                        }

                        if (match.theme) {
                            await (await client.users.fetch(match.p2.userid)).send(
                                new discord.MessageEmbed()
                                    .setTitle("Your theme")
                                    .setDescription(match.theme)
                                    .setColor("#d7be26")
                                    .setTimestamp()
                            )
                        }
                        await updateActive(match)

                        let timeArr:number[] = []
                        timeArr.push(3300)
                        timeArr.push(2700)
                        timeArr.push(1800)
                
                        await insertReminder(
                            {
                                _id:match.p2.userid,
                                mention: "",
                                channel: "",
                                type: "meme",
                                time:timeArr,
                                timestamp:Math.floor(Date.now()/1000),
                                basetime:3600
                            }
                        )

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
    let user2 = message.mentions.users.array()[1]

    createAtUsermatch(user1)
    createAtUsermatch(user2)

    let newmatch: activematch = {
        _id: message.channel.id,
        channelid: message.channel.id,
        split: true,
        exhibition: false,
        messageID: "",
        template: [],
        theme: "",
        tempfound: false,
        p1: {
            userid: user1.id,
            memedone: false,
            donesplit: false,
            time: Math.floor(Date.now() / 1000),
            memelink: "",
            votes: 0,
            voters: [],
            halfreminder: false,
            fivereminder: false,
        },
        p2: {
            userid: user2.id,
            memedone: false,
            donesplit: false,
            time: Math.floor(Date.now() / 1000),
            memelink: "",
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
        .setTitle(`Looking for a ${["th", "theme"].includes(args[3]) ? "Theme" : "Template"}`)
        .setColor("#d7be26")
        .setTimestamp()



    message.channel.send(templook)

    if (["th", "theme"].includes(args[3])) {

        await RandomTemplateFunc(message, client, message.channel.id, true)

            let rantemp = await gettempStruct(message.channel.id)
    
            rantemp.time = rantemp.time - 2.5
    
    
    
            while (rantemp.found === false) {
    
                if (Math.floor(Date.now() / 1000) - rantemp.time > 120) {
    
                    await deletetempStruct(rantemp._id)
                    await (await (<discord.TextChannel>client.channels.cache.get("722616679280148504")).messages.fetch(rantemp.messageid)).delete()
                    return await message.channel.send(new discord.MessageEmbed()
                        .setTitle(`Random Theme Selection failed `)
                        .setColor("red")
                        .setDescription(`Mods please restart this match`)
                        .setTimestamp())
                }
                rantemp = await gettempStruct(message.channel.id)
            }
    
            newmatch.theme = rantemp.url
            await deletetempStruct(rantemp._id)

        await insertActive(newmatch)

        //await vs(message.channel.id, client, [message.mentions.users.array()[0].id, message.mentions.users.array()[1].id])

        let embed = new discord.MessageEmbed()
            .setTitle(`Match between ${user1.username ? user1.username : (await message.guild!.members.fetch(user1.id)).nickname} and ${user2.username ? user2.username : (await message.guild!.members.fetch(user2.id)).nickname}`)
            .setColor("#d7be26")
            .setDescription(`<@${user1.id}> and <@${user2.id}> both have 1 hours to complete your meme.\n Contact admins if you have an issue.`)
            .setTimestamp()



        await message.channel.send({ embed }).then(async message => {
            await message.react('🅰️')
            await message.react('🅱️')
        })

            
    }

    if(args[3] === "quick"){

        newmatch.theme = args[3]
        await insertActive(newmatch)

        //await vs(message.channel.id, client, [message.mentions.users.array()[0].id, message.mentions.users.array()[1].id])

        let embed = new discord.MessageEmbed()
            .setTitle(`Match between ${user1.username ? user1.username : (await message.guild!.members.fetch(user1.id)).nickname} and ${user2.username ? user2.username : (await message.guild!.members.fetch(user2.id)).nickname}`)
            .setColor("#d7be26")
            .setDescription(`<@${user1.id}> and <@${user2.id}> both have 1 hours to complete your meme.\n Contact admins if you have an issue.`)
            .setTimestamp()



        await message.channel.send({ embed }).then(async message => {
            await message.react('🅰️')
            await message.react('🅱️')
        })
    }

    else {
        await RandomTemplateFunc(message, client, message.channel.id, false)


        let rantemp = await gettempStruct(message.channel.id)

        rantemp.time = rantemp.time - 2.5

        console.log(rantemp)

        while (rantemp.found === false) {

            if (Math.floor(Date.now() / 1000) - rantemp.time > 120) {

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

        await insertActive(newmatch)

        //await vs(message.channel.id, client, [message.mentions.users.array()[0].id, message.mentions.users.array()[1].id])

        let embed = new discord.MessageEmbed()
            .setTitle(`Match between ${user1.username ? user1.username : (await message.guild!.members.fetch(user1.id)).nickname} and ${user2.username ? user2.username : (await message.guild!.members.fetch(user2.id)).nickname}`)
            .setColor("#d7be26")
            .setDescription(`<@${user1.id}> and <@${user2.id}> both have 1 hours to complete your meme.\n Contact admins if you have an issue.`)
            .setTimestamp()




        await message.channel.send({ embed }).then(async message => {
            await message.react('🅰️')
            await message.react('🅱️')
        })
    }


    // let templook = new discord.MessageEmbed()
    // .setTitle(`Looking for a temp`)
    // .setColor("#d7be26")
    // .setTimestamp()



    // message.channel.send(templook)

    // await RandomTemplateFunc(message, client, message.channel.id)

    // let rantemp = await gettempStruct(message.channel.id)

    // rantemp.time = rantemp.time - 2.5

    // while(rantemp.found === false){
    //     //console.log(rantemp)
    //     //await message.reply("IN LOOP")
    //     if(Math.floor(Date.now()/1000) - rantemp.time > 120){

    //         await deletetempStruct(rantemp._id)
    //         await (await (<discord.TextChannel>client.channels.cache.get("722616679280148504")).messages.fetch(rantemp.messageid)).delete()
    //         return await message.channel.send(new discord.MessageEmbed()
    //         .setTitle(`Random Template Selection failed `)
    //         .setColor("red")
    //         .setDescription(`Mods please restart this match`)
    //         .setTimestamp())
    //     }
    //     rantemp = await gettempStruct(message.channel.id)
    // }
    // newmatch.template = rantemp.url
    // await deletetempStruct(rantemp._id)


    // await insertActive(newmatch)

    // await vs(message.channel.id, client, [message.mentions.users.array()[0].id, message.mentions.users.array()[1].id])



    /**let embed = new discord.MessageEmbed()
        .setTitle(`Match between ${user1.username} and ${user2.username}`)
        .setColor("#d7be26")
        .setDescription(`${user1.username} and ${user2.username} your match has been split.\nContact mods to start your portion\nUse ${`!submit`} to submit`)
        .setTimestamp()

    await message.channel.send({ embed }).then(async message => {
        await message.react('🅰️')
        await message.react('🅱️')
    })**/


}

export async function reload(message: discord.Message, client: discord.Client) {
    let match = await getSingularQuals(message.channel.id)

    if (match) {
        let channel = <discord.TextChannel>client.channels.cache.get(match.channelid)

        // console.log(qual)
        if (!match) {
            
            return;
        }

        if (Math.floor(Date.now() / 1000) - match.octime > 1800 || match.playersdone.length === match.playerids.length) {

            // for (let i = 0; i < match.votes.length; i++) {
            //     match.votes[i] = []
            // }

            if (match.istheme === false) {
                await channel.send(new discord.MessageEmbed()
                    .setTitle("Template")
                    .setImage(match.template[0])
                    .setColor("#07da63")
                    .setTimestamp())
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

            // if (match.template.length > 0 || match.template) {
            //     await channel.send("\n\nThe theme is: " + match.template)
            //     //await user.send({ files: [new discord.MessageAttachment(match.template)] })
            // }

            if (match.template.length > 0 && match.istheme || match.template && match.istheme) {
                await channel.send("\n\nThe theme is: " + match.template)
                //await user.send({ files: [new discord.MessageAttachment(match.template)] })
            }

            await channel.send("You have 2 hours to vote")


            await updateQuals(match)

            await channel.send(`<@&719936221572235295>`)
        }
    }

    else {
        let match = await getMatch(message.channel.id)

        let channelid = <discord.TextChannel>client.channels.cache.get(match.channelid)
        let user1 = (await client.users.fetch(match.p1.userid))
        let user2 = (await client.users.fetch(match.p2.userid))


        if (!(match.split) && ((Math.floor(Date.now() / 1000) - match.p2.time > 3600) && match.p2.memedone === false)
            && ((Math.floor(Date.now() / 1000) - match.p1.time > 3600) && match.p1.memedone === false)) {
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

        else if ((Math.floor(Date.now() / 1000) - match.p1.time > 3600)
            && match.p1.memedone === false && match.p1.donesplit) {
            user1.send("You have failed to submit your meme, your opponent  is the winner.")

            let embed = new discord.MessageEmbed()
                .setColor("#d7be26")
                .setTitle(`Match between ${user1.username} and ${user2.username}`)
                .setDescription(`<@${user2.id}> has won!`)
                .setTimestamp()

            channelid.send(embed)
            // matches.splice(matches.indexOf(match), 1)
            await deleteActive(match)
        }

        else if ((Math.floor(Date.now() / 1000) - match.p2.time > 3600)
            && match.p2.memedone === false && match.p2.donesplit) {
            console.log(Date.now() - match.p2.time)
            user2.send("You have failed to submit your meme, your opponent  is the winner.")

            let embed = new discord.MessageEmbed()
                .setTitle(`Match between ${user1.username} and ${user2.username}`)
                .setDescription(`<@${user1.id}> has won!`)
                .setColor("#d7be26")
                .setTimestamp()

            channelid.send(embed)
            // matches.splice(matches.indexOf(match), 1)
            await deleteActive(match)
        }


        else if ((!(match.split) && ((Math.floor(Date.now() / 1000) - match.p2.time <= 3600) && match.p2.memedone === true)
            && ((Math.floor(Date.now() / 1000) - match.p1.time <= 3600) && match.p1.memedone === true))) {


            if (Math.floor(Math.random() * (5 - 1) + 1) % 2 === 1) {
                let temp = match.p1

                match.p1 = match.p2

                match.p2 = temp

                //await updateActive(match)
            }

            if (match.template) {
                channelid.send(
                    new discord.MessageEmbed()
                        .setTitle("Template")
                        .setImage(match.template[0])
                        .setColor("#07da63")
                        .setTimestamp()
                )

                channelid.send(
                    new discord.MessageEmbed()
                        .setTitle("Template")
                        .setImage(match.template[1])
                        .setColor("#07da63")
                        .setTimestamp()
                )
            }

            if (match.theme) {
                channelid.send(
                    new discord.MessageEmbed()
                        .setTitle("Theme")
                        .setDescription(`Theme is: ${match.theme}`)
                        .setColor("#07da63")
                        .setTimestamp()
                )
            }



            let embed1 = new discord.MessageEmbed()
                .setDescription("Player 1")
                .setImage(match.p1.memelink)
                .setColor("#d7be26")
                .setTimestamp()

            console.log("Player 1 embed done")


            let embed2 = new discord.MessageEmbed()
                .setDescription("Player 2")
                .setImage(match.p2.memelink)
                .setColor("#d7be26")
                .setTimestamp()


            let embed3 = new discord.MessageEmbed()
                .setTitle("Vote for the best meme!")
                .setColor("#d7be26")
                .setDescription(`Vote for User 1 reacting with ${emojis[0]}\nVote for User 2 by reacting with ${emojis[1]}`)



            await channelid.send(embed1)
            await channelid.send(embed2)

            await channelid.send(embed3).then(async msg => {
                match.messageID = msg.id
                await (msg as discord.Message).react(emojis[0])
                await (msg as discord.Message).react(emojis[1])
            })

            //await channelid.send("@eveyone")

            match.votingperiod = true
            match.votetime = (Math.floor(Date.now() / 1000))

            if (!match.exhibition) {
                await channelid.send(`<@&719936221572235295>`)
                await channelid.send("You have 2 hours to vote!")
            }




            if (match.exhibition) {
                match.votetime = ((Math.floor(Date.now() / 1000)) - 5400)
                await channelid.send("You have 30 mins to vote!")
                await channelid.send(`<@&783003389390487582>`)
            }

            await updateActive(match)

            //await channelid.send("@eveyone")

            match.votingperiod = true
            match.votetime = (Math.floor(Date.now() / 1000))

            await channelid.send(`<@&719936221572235295>`)

            await channelid.send("You have 2 hours to vote!")
        }

        return await updateActive(match)
    }
}

export async function matchstats(message: discord.Message, client: discord.Client) {
    let channel = message.mentions.channels.first()

    try {
        if (!channel) {
            return message.reply("No active match exists in this channel")
        }

        else {
            let match = await getMatch(channel.id)

            let em = new discord.MessageEmbed()
                .setTitle(`${channel.name}`)
                .setColor("BLUE")
                .addFields(
                    { name: `${match.theme ? `Match theme:` : `Match template`}`, value: `${match.theme ? `${match.theme}` : `${match.template}`}` },


                    { name: `${(await client.users.cache.get(match.p1.userid)!).username} Meme Done:`, value: `${match.p1.memedone ? `Yes` : `No`}`, inline: true },
                    { name: 'Match Portion Done:', value: `${match.p1.donesplit ? `${match.split ? `Yes` : `Not a split match`}` : `No`}`, inline: true },
                    { name: 'Meme Link:', value: `${match.p1.memedone ? `${match.p1.memelink}` : `No meme submitted yet`}`, inline: true },
                    { name: 'Time left', value: `${match.p1.donesplit ? `${match.p1.memedone ? "Submitted meme" : `${60 - Math.floor(((Date.now() / 1000) - match.p1.time) / 60)} mins left`}` : `${match.split ? `Hasn't started portion` : `Time up`}`}`, inline: true },
                    { name: '\u200B', value: '\u200B' },

                    { name: `${(await client.users.cache.get(match.p2.userid)!).username} Meme Done:`, value: `${match.p2.memedone ? `Yes` : `No`}`, inline: true },
                    { name: 'Match Portion Done:', value: `${match.p2.donesplit ? `${match.split ? `Yes` : `Not a split match`}` : `No`}`, inline: true },
                    { name: 'Meme Link:', value: `${match.p2.memedone ? `${match.p2.memelink}` : `No meme submitted yet`}`, inline: true },
                    { name: 'Time left', value: `${match.p2.donesplit ? `${match.p2.memedone ? "Submitted meme" : `${60 - Math.floor(((Date.now() / 1000) - match.p2.time) / 60)} mins left`}` : `${match.split ? `Hasn't started portion` : `Time up`}`}`, inline: true },
                    { name: '\u200B', value: '\u200B' },

                    { name: `Voting period:`, value: `${match.votingperiod ? `Yes` : `No`}`, inline: true },
                    { name: `Voting time:`, value: `${match.votingperiod ? `${(7200 / 60) - Math.floor((Math.floor(Date.now() / 1000) - match.votetime) / 60)} mins left` : "Voting hasn't started"}`, inline: true }



                )

            await message.channel.send(em)
        }
    } catch (err) {
        message.channel.send("```" + err + "```")
        return message.reply("there is an error! Ping blitz and show him the error.")
    }

}

export async function qualstats(message: discord.Message, client: discord.Client) {
    let channel = message.mentions.channels.first()

    try {
        if (!channel) {
            return message.reply("No active qualifer exists in this channel")
        }

        else {
            let match = await getQual(channel.id)

            let em = new discord.MessageEmbed()
                .setTitle(`${channel.name}`)
                .setColor("LUMINOUS_VIVID_PINK")
            // .addFields(
            //     { name: `${(await client.users.cache.get(match.)!).username} Meme Done:`, value: `${match.p1.memedone ? `Yes` : `No` }`, inline:true},
            //     { name: 'Match Portion Done:', value: `${match.p1.donesplit ? `${match.split ? `Yes` : `Not a split match` }` : `No` }`, inline:true},
            //     { name: 'Meme Link:', value: `${match.p1.memedone ?   `${match.p1.memelink}` : `No meme submitted yet` }`, inline:true},
            //     { name: 'Time left', value: `${match.p1.donesplit ? `${match.p1.memedone ? "Submitted meme" : `${60 - Math.floor(((Date.now() / 1000) - match.p1.time)/60)} mins left`}` : `${match.split ? `Hasn't started portion` : `Time up` }` }`, inline:true},
            //     { name: '\u200B', value: '\u200B' },

            //     { name: `${(await client.users.cache.get(match.p2.userid)!).username} Meme Done:`, value: `${match.p2.memedone ? `Yes` : `No` }`, inline:true},
            //     { name: 'Match Portion Done:', value: `${match.p2.donesplit ? `${match.split ? `Yes` : `Not a split match` }` : `No` }`, inline:true},
            //     { name: 'Meme Link:', value: `${match.p2.memedone ?   `${match.p2.memelink}` : `No meme submitted yet`}`, inline:true},
            //     { name: 'Time left', value: `${match.p2.donesplit ? `${match.p2.memedone ? "Submitted meme" : `${60 - Math.floor(((Date.now() / 1000) - match.p2.time)/60)} mins left`}` : `${match.split ? `Hasn't started portion` : `Time up` }` }`, inline:true},
            //     { name: '\u200B', value: '\u200B' },

            //     {name: `Voting period:`, value: `${match.votingperiod ? `Yes` : `No`}`, inline:true},
            //     {name: `Voting time:`, value: `${match.votingperiod ? `${(10800/60) - Math.floor((Math.floor(Date.now() / 1000) - match.votetime)/60)} mins left` : "Voting hasn't started"}`, inline:true}



            // )

            for (let i = 0; i < match.players.length; i++) {
                em.addFields(
                    { name: `${(await client.users.cache.get(match.players[i].userid)!).username} Meme Done:`, value: `${match.players[i].memedone ? `Yes` : `No`}`, inline: true },
                    { name: 'Match Portion Done:', value: `${match.players[i].split ? `${match.split ? `Yes` : `Not a split match`}` : `No`}`, inline: true },
                    { name: 'Meme Link:', value: `${match.players[i].memedone ? `${match.players[i].memelink}` : `No meme submitted yet`}`, inline: true },
                    { name: 'Time left', value: `${match.players[i].split ? `${match.players[i].memedone ? "Submitted meme" : `${30 - Math.floor(((Date.now() / 1000) - match.players[i].time) / 60)} mins left`}` : `${match.split ? `Hasn't started portion` : `Time up`}`}`, inline: true },
                    { name: '\u200B', value: '\u200B' },
                )
            }

            em.addFields(
                { name: `Voting period:`, value: `${match.votingperiod ? `Yes` : `No`}`, inline: true },
                { name: `Voting time:`, value: `${match.votingperiod ? `${(7200 / 60) - Math.floor((Math.floor(Date.now() / 1000) - match.votetime) / 60)} mins left` : "Voting hasn't started"}`, inline: true }
            )

            await message.channel.send(em)
        }
    } catch (err) {
        message.channel.send("```" + err + "```")
        return message.reply("there is an error! Ping blitz and show him the error.")
    }

}

export async function forfeit(message: discord.Message) {
    if (await getMatch(message.channel.id)) {
        let match = await getMatch(message.channel.id)

        if (match.p1.userid === message.mentions.users.array()[0].id) {
            match.p1.memedone = false
            match.p1.donesplit = true
            match.p1.time = (match.p1.time - 7200)
        }

        else if (match.p2.userid === message.mentions.users.array()[0].id) {
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

        for (i < match.players.length; i++;) {
            if (match.players[i].userid === message.mentions.users.array()[0].id) {
                break;
            }
        }

        match.players[i].failed = true
        match.players[i].memedone = false
        match.players[i].split = true
        match.players[i].time = (match.players[i].time - 1800)
        match.playersdone.push(match.players[i].userid)

        if (match.players.length - match.playersdone.length === 2) {
            for (let e = 0; e < match.players.length; e++) {
                if (!match.playersdone.includes(match.players[e].userid)) {
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
