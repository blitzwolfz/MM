import * as discord from "discord.js"
import { getUser, emojis } from "../misc/utils"
const prefix = process.env.PREFIX!
import { activematch, qualmatch, players } from "../misc/struct"
import { end, qualend } from "./winner"
import { vs } from "./card"
import { updateActive, deleteActive, insertActive, insertQuals, updateQuals, getActive, getQuals } from "../misc/db"
import { createAtUsermatch } from "./user"
//const Canvas = require('canvas');

export async function start(message: discord.Message, client: discord.Client) {
    //.start @user1 @user2

    let users: string[] = []
    var args: Array<string> = message.content.slice(prefix.length).trim().split(/ +/g)

    if (args.length < 3) {
        return message.reply("invalid response. Command is `!start @user1 @user2 template link`\n or `!start @user1 @user2 theme description`")
    }

    //console.log(args)

    for (let i = 0; i < args.length; i++) {
        let userid = await getUser(args[i])
        if (userid) {
            users.push(userid)
        }
    }
    let user1 = (await client.users.fetch(users[0]))
    let user2 = (await client.users.fetch(users[1]))

    createAtUsermatch(user1)
    createAtUsermatch(user2)

    let newmatch: activematch = {
        _id: message.channel.id,
        channelid: message.channel.id,
        split: false,
        messageID: "",
        p1: {
            userid: user1.id,
            memedone: false,
            donesplit: true,
            time: Math.floor(Date.now() / 1000),
            memelink: "",
            votes: 0,
            voters: [],
        },
        p2: {
            userid: user2.id,
            memedone: false,
            donesplit: true,
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
        .setColor("#d7be26")
        .setDescription(`<@${user1.id}> and <@${user2.id}> both have 30 mins to complete your memes.\n Contact admins if you have an issue.`)
        .setTimestamp()



    message.channel.send({ embed })

    if (["t", "template"].includes(args[3])) {
        let att = new discord.MessageAttachment(message.attachments.array()[0].url)
        await user1.send("Here is your template:")
        await user1.send(att)

        await user2.send("Here is your template:")
        await user2.send(att)

        // await message.channel.send("Here is your template:")
        // await message.channel.send(att)
    }

    else if (["th", "theme"].includes(args[3])) {
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

    if (["t", "template"].includes(args[x])) {
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

export async function running(client: discord.Client): Promise<void> {
    let matches: activematch[] = await getActive()
    for (const match of matches) {
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

        if (match.votingperiod === false) {

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
                break
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



            else if (!(match.split) && ((Math.floor(Date.now() / 1000) - match.p2.time < 2400) && match.p2.memedone === true)
                && ((Math.floor(Date.now() / 1000) - match.p2.time < 2400) && match.p1.memedone === true)) {

                var embed1 = new discord.MessageEmbed()
                    .setImage(match.p1.memelink)
                    .setColor("#d7be26")
                    .setTimestamp()

                var embed2 = new discord.MessageEmbed()
                    .setImage(match.p2.memelink)
                    .setColor("#d7be26")
                    .setTimestamp()


                let embed3 = new discord.MessageEmbed()
                    .setTitle("Please vote")
                    .setColor("#d7be26")
                    .setDescription("Vote for Meme 1 reacting with 🅰️\nMeme 2 by reacting with 🅱️")

                await channelid.send(embed1)
                await channelid.send(embed2)

                await channelid.send(embed3).then(async msg => {
                    match.messageID = msg.id
                    await (msg as discord.Message).react("🅰️")
                    await (msg as discord.Message).react("🅱️")
                })

                //await channelid.send("@eveyone")

                match.votingperiod = true
                match.votetime = (Math.floor(Date.now() / 1000))
                await updateActive(match)
            }
        }

        if (match.votingperiod === true) {
            //7200
            if ((Math.floor(Date.now() / 1000) - match.votetime > 7200)) {
                await end(client)
            }
        }
    }
}

export async function qualrunning(client: discord.Client) {
    let qualmatches: qualmatch[] = await getQuals()

    for (let match of qualmatches) {

        let channelid = <discord.TextChannel>client.channels.cache.get(match.channelid)

        if (match.votingperiod === false) {

            for (let u of match.players) {

                console.log(u)
                console.log(match.players.length)

                if (Math.floor(Date.now() / 1000) - match.octime > 1800 && match.split === false) {
                    for (let x of match.players) {
                        if (x.memedone) {
                            let embed = new discord.MessageEmbed()
                                .setColor("#d7be26")
                                .setImage(u.memelink)
                                .setTimestamp()
                            if (!match.playersdone.includes(u.userid)) {
                                match.playersdone.push(u.userid)
                            }

                            await channelid.send(embed)
                        }

                        else {
                            let embed2 = new discord.MessageEmbed()
                                .setDescription("Player failed to submit meme on time")
                                .setColor("#d7be26")
                                .setTimestamp()
                            await channelid.send(embed2)
                        }
                    }

                    //await deleteQuals(match)
                    let em = new discord.MessageEmbed()
                        .setDescription("Please vote")
                        .setColor("#d7be26")
                        .setTimestamp()

                    channelid.send(em).then(async msg => {
                        for (let i = 0; i < match.playerids.length; i++) {
                            await msg.react(emojis[i])
                        }
                        await msg.react(emojis[6])
                    })
                    match.votingperiod = true
                    await updateQuals(match)
                    return;
                }

                if (match.split) {
                    if (Math.floor(Date.now() / 1000) - u.time > 1800 && u.split === true) {
                        let embed3 = new discord.MessageEmbed()
                            .setDescription("You failed to submit meme on time")
                            .setColor("#d7be26")
                            .setTimestamp()
                        await updateQuals(match)
                        await (await client.users.fetch(u.userid)).send(embed3)
                    }

                    if (match.playersdone.length === match.players.length) {
                        match.split = false
                        match.votingperiod = true
                        match.votetime = Math.floor(Date.now() / 1000)
                        await updateQuals(match)
                    }

                }
            }

            if (match.votingperiod) {
                //7200
                if ((Math.floor(Date.now() / 1000) - match.votetime > 7200) || match.playersdone.length <= 2) {
                    await qualend(client, channelid.id)
                }
            }

        }
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
                        .setDescription(`${user.username} your match has been split.\nYou have 30 mins\nto complete your memes`)
                        .setColor("#d7be26")
                        .setTimestamp())
                    u.split = true

                    if (match.template.length > 0) {
                        await user.send("Here is your template:")
                        await user.send({ files: [new discord.MessageAttachment(match.template)] })
                    }

                    await updateQuals(match)
                }
                else if (u.split === true && u.userid === user.id) {
                    await channelid.send(new discord.MessageEmbed()
                        .setDescription(`${user.username} has completed their portion`)
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

export async function splitregular(message: discord.Message, client: discord.Client) {
    let user = await (client.users.fetch(message.mentions!.users!.first()!.id));
    let matches: activematch[] = await getActive()

    for (let match of matches) {
        //let channel = <discord.TextChannel>client.channels.cache.get(match.channelid)
        if (match.split) {
            if (match.channelid === message.channel.id) {
                if (user.id === match.p1.userid) {
                    if (!(match.p1.donesplit)) {

                        await message.channel.send(new discord.MessageEmbed()
                            .setDescription(`${user.username} your match has been split.\nYou have 30 mins\nto complete your memes`)
                            .setColor("#d7be26")
                            .setTimestamp())

                        match.p1.donesplit = true
                        match.p1.time = Math.floor(Date.now() / 1000)
                        await updateActive(match)
                        return;
                    }
                }

                if (user.id === match.p2.userid) {
                    if (!(match.p2.donesplit)) {

                        await message.channel.send(new discord.MessageEmbed()
                            .setDescription(`${user.username} your match has been split.\nYou have 30 mins\nto complete your memes`)
                            .setColor("#d7be26")
                            .setTimestamp())

                        match.p2.donesplit = true
                        match.p2.time = Math.floor(Date.now() / 1000)
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

    let users: string[] = []
    var args: Array<string> = message.content.slice(prefix.length).trim().split(/ +/g)

    if (args.length < 3) {
        return message.reply("invalid response. Command is `!start @user1 @user2 template link`\n or `!start @user1 @user2 theme description`")
    }

    //console.log(args)

    for (let i = 0; i < args.length; i++) {
        let userid = await getUser(args[i])
        if (userid) {
            users.push(userid)
        }
    }
    let user1 = (await client.users.fetch(users[0]))
    let user2 = (await client.users.fetch(users[1]))

    createAtUsermatch(user1)
    createAtUsermatch(user2)

    let newmatch: activematch = {
        _id: message.channel.id,
        channelid: message.channel.id,
        split: true,
        messageID: "",
        p1: {
            userid: user1.id,
            memedone: false,
            donesplit: false,
            time: Math.floor(Date.now() / 1000),
            memelink: "",
            votes: 0,
            voters: [],
        },
        p2: {
            userid: user2.id,
            memedone: false,
            donesplit: false,
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
        .setColor("#d7be26")
        .setDescription(`<@${user1.id}> and <@${user2.id}> your match has been split.\nContact mods to start your portion`)
        .setTimestamp()



    message.channel.send({ embed })

    if (["t", "template"].includes(args[3])) {
        let att = new discord.MessageAttachment(message.attachments.array()[0].url)
        await user1.send("Here is your template:")
        await user1.send(att)

        await user2.send("Here is your template:")
        await user2.send(att)

        // await message.channel.send("Here is your template:")
        // await message.channel.send(att)
    }

    else if (["th", "theme"].includes(args[3])) {
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

