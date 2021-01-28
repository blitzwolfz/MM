//import { matchlist } from "../misc/struct";
import * as Discord from "discord.js";
import { parse } from "dotenv/types";
import { getSignups, getMatchlist, updateMatchlist, insertMatchlist, insertQuallist, getQuallist, updateQuallist, updateProfile, insertReminder } from "../misc/db";
import { matchlist, quallist } from "../misc/struct";
import { indexOf2d } from "../misc/utils";
//import { indexOf2d } from "../misc/utils";


const challonge = require("challonge-js")


export async function CreateChallongeQualBracket(message: Discord.Message, disclient: Discord.Client, args: string[]) {
    if (message.member!.roles.cache.has('724818272922501190')
        || message.member!.roles.cache.has('724832462286356590')) {

        const client = challonge.createClient({
            apiKey: process.env.CHALLONGE
        });
        //console.time("aaa")

        let id = (args.join("")).replace("https://challonge.com/", "");

        let matchlist = await getMatchlist()

        //console.log(id)

        //message.reply(id)


        let Signups = await getSignups()

        //console.log(id)

        if (Signups) {
            if (Signups.open === false) {
                for (let i = 0; i < Signups.users.length; i++) {
                    await client.participants.create({
                        id: id,
                        participant: {
                            name: (await disclient.users.fetch(Signups.users[i])).username
                        },
                        callback: (err: any, data: any) => {
                            //
                            console.log(err, data);
                        }
                    });
                }
            }

            else {
                return message.reply("Signups haven't closed")
            }

        }

        else {
            return message.reply("No one signed up")
        }


        matchlist.qualurl = `${id}`

        await updateMatchlist(matchlist)

        console.timeEnd("aaa")

        return message.reply(new Discord.MessageEmbed()
            .setColor("#d7be26")
            .setTitle(`Tournement: ${id}`)
            .setDescription(`Here's the link to the brackers\nhttps://www.challonge.com/${id}`)
            .setTimestamp())
    }

    else {
        await (await disclient.users.fetch(message.author.id)).send("You aren't allowed to use that command!")
    }

}

export async function CreateChallongeMatchBracket(message: Discord.Message, disclient: Discord.Client, args: string[], guild: Discord.Guild) {
    if (message.member!.roles.cache.has('724818272922501190')
        || message.member!.roles.cache.has('724818272922501190')
        || message.member!.roles.cache.has('724832462286356590')) {

        const client = challonge.createClient({
            apiKey: process.env.CHALLONGE
        });

        let matchid = (args.join("")).replace("https://challonge.com/", "");

        let matchlist = await getMatchlist();

        // console.log(matchid)

        // let qualid = (matchlist.qualurl)
        // qualid = qualid.replace("https://challonge.com/", "")

        // console.log(qualid)



        matchlist.users = await shuffle(matchlist.users)
        matchlist.users = await shuffle(matchlist.users)
        matchlist.users = await shuffle(matchlist.users)
        matchlist.users = await shuffle(matchlist.users)
        matchlist.users = await shuffle(matchlist.users)

        for (let i = 0; i < matchlist.users.length; i++) {
            console.log("ok")
            let name = (await (await guild!.members.fetch(matchlist.users[i])).nickname) || await (await disclient.users.fetch(matchlist.users[i])).username
            //let name = matchlist.users[i]



            // console.log("ok")
            // console.log(name)


            client.participants.create({
                id: matchid,
                participant: {
                    name: name
                },
                callback: (err: any, data: any) => {
                    console.log(err, data);
                }
            });
        }




        matchlist.url = `${matchid}`

        await updateMatchlist(matchlist)

        //await ChannelCreation(message, disclient, ["1"])

        await message.reply(new Discord.MessageEmbed()
            .setColor("#d7be26")
            .setTitle(`Meme Mania ${args[0]}`)
            .setDescription(`Here's the link to the brackets\nhttps://www.challonge.com/${matchid}`)
            .setTimestamp())
    }

    else {
        await (await disclient.users.fetch(message.author.id)).send("You aren't allowed to use that command!")
    }

}

export async function ChannelCreation(message: Discord.Message, disclient: Discord.Client, args: string[]) {
    //console.log("OK")
    if (!args) return message.reply("Please input round number!")

    else {

        let names: any[] = []
        let guild = disclient.guilds.cache.get("719406444109103117")!

        let match = await getMatchlist()

        for (let i = 0; i < match.users.length; i++) {
            //console.log(match.users[i])
            try {
                let name = ((await (await guild!.members.fetch(match.users[i])).nickname) || await (await disclient.users.fetch(match.users[i])).username)
                names.push([name, match.users[i]])
            } catch { message.channel.send(`${match.users[i]} is fucked`) }
            //names.concat([((await (await message.guild!.members.fetch(i)).nickname) || await (await disclient.users.fetch(i)).username), i])
        }

        const client = challonge.createClient({
            apiKey: process.env.CHALLONGE
        });

        let matchlist = await getMatchlist()

        // console.log(disclient.ws.ping)

        // console.log("OK")
        //console.log(client)

        await client.matches.index({
            id: matchlist.url,
            callback: async (err: any, data: any) => {
                //console.log(data);
                if (err) console.log(err)


                //console.log(data)

                for (let i = 0; i < data.length; i++) {
                    //var channelstringname = ""

                    if (data[i].match.round === parseInt(args[0])) {
                        //await message.reply(`\`\`\` ${data[i]}\`\`\``)

                        //console.log(data[i])


                        if (data[i].match.winnerId === null && data[i].match.loserId === null) {


                            let oneid = data[i].match.player1Id

                            let twoid = data[i].match.player2Id

                            if (oneid === null || twoid === null) continue;

                            let channelstringname: string = ""
                            let name1: string = ""
                            let name2: string = ""
                            let matchid = data[i].match.id

                            client.participants.index({
                                id: matchlist.url,
                                callback: async (err: any, data: any) => {
                                    if (err) console.log(err)


                                    for (let x = 0; x < data.length; x++) {
                                        if (data[x].participant.id === oneid) {

                                            channelstringname += data[x].participant.name.substring(0, 10)
                                            name1 = data[x].participant.name
                                            break;
                                        }
                                    }

                                    for (let y = 0; y < data.length; y++) {
                                        if (data[y].participant.id === twoid) {
                                            channelstringname += "-vs-" + data[y].participant.name.substring(0, 10)
                                            name2 = data[y].participant.name
                                            break;
                                        }
                                    }

                                    if (channelstringname.includes("-vs-")) {
                                        // let names:string[][] = []

                                        // let match = await getMatchlist()

                                        // for(let i of match.users){
                                        //   //((await (await message.guild!.members.fetch(i)!).nickname) ||
                                        //     names.push([(await (await guild!.members.fetch(i)!).nickname || (await disclient.users.fetch(i)!).username), i])
                                        // }

                                        // console.log(names)

                                        await message.guild!.channels.create(channelstringname, { type: 'text', topic: `${matchid},${oneid},${twoid}` })
                                            .then(async channel => {
                                                let category = await message.guild!.channels.cache.find(c => c.name == "matches" && c.type == "category");

                                                // console.log(name1)
                                                // console.log(name1)

                                                let id1 = indexOf2d(names, name1, 0, 1)
                                                let id2 = indexOf2d(names, name2, 0, 1)

                                                await channel.send(`<@${id1}> <@${id2}> You have ${args[1]}h to complete this match. Contact a ref to begin, you may also split your match`)
                                                if (!category) throw new Error("Category channel does not exist");
                                                await channel.setParent(category.id);
                                                await channel.lockPermissions()
                                                let t = await getMatchlist()
                                                
                                                await insertReminder(
                                                    {
                                                      _id:channel.id,
                                                      mention:`<@${id1}> <@${id2}>`,
                                                      channel:channel.id,
                                                      type:"match",
                                                      time:86400,
                                                      timestamp:Math.round(message.createdTimestamp / 1000)
                                                    }
                                                )


                                                t.qualurl = Math.round(message.createdTimestamp / 1000).toString()

                                                await updateMatchlist(t)
                                            });
                                    }

                                }
                            });

                        }
                    }
                }

            }
        });
    }
    return message.reply("Made all channels")
}
export async function QualChannelCreation(message: Discord.Message, args: string[]) {

    let groups = await getQuallist()
    //console.log(groups.users)

    let time = args[1]

    for (let i = 0; i < groups.users.length; i++) {

        if (groups.users[i].length > 0) {

            let category = await message.guild!.channels.cache.find(c => c.name == "qualifiers" && c.type == "category");

            await message.guild!.channels.create(`Group ${i + 1}`, { type: 'text', topic: `Round ${args[0]}`, parent: category!.id })
                .then(async channel => {

                    // if (!category) throw new Error("Category channel does not exist");
                    // await channel.setParent("745171069601579029");
                    // // await channel.lockPermissions()
                    let string = ""

                    for (let u of groups.users[i]) {
                        string += `<@${u}> `
                    }

                    await insertReminder(
                        {
                          _id:channel.id,
                          mention:string,
                          channel:channel.id,
                          type:"match",
                          time:86400,
                          timestamp:Math.round(message.createdTimestamp / 1000)
                        }
                    )

                    await channel.send(`${string}, Portion ${args[0]} has begun, and you have ${time}h to complete it. Contact a ref to begin your portion!`)
                });
        }

    }

    return message.reply("Made all channels")
}

export async function CreateQualGroups(message: Discord.Message, args: string[]) {
    if (message.member!.roles.cache.has('724818272922501190')
        || message.member!.roles.cache.has('724832462286356590')) {


        if (!args) {
            return message.reply("Please enter how many people you want in a group")
        }
        let gNum = parseInt(args[0])

        let Signups = await getSignups()


        if (Signups) {
            if (Signups.open === false) {
                let groups = await makeGroup(gNum, Signups.users)
                let qualgroups: quallist = await getQuallist()
                if (qualgroups) {
                    qualgroups.users = groups

                    await updateQuallist(qualgroups)
                }

                else {
                    qualgroups = {
                        _id: 2,
                        url: "",
                        users: groups
                    }

                    await insertQuallist(qualgroups)
                }

                return message.reply("Made qualifier groups")

            }

            else {
                return message.reply("Signups haven't closed")
            }

        }

        else {
            return message.reply("No one signed up")
        }

    }
}

export async function CreateCustomQualGroups(message: Discord.Message, args: string[]) {
    if (message.member!.roles.cache.has('724818272922501190')
        || message.member!.roles.cache.has('724832462286356590')) {


        if (!args) {
            return message.reply("Please enter how many people you want in a group")
        }
        let gNum = parseInt(args[0])
        let am = parseInt(args[2])
        let gNum2 = parseInt(args[1])
        let am2 = parseInt(args[3])

        let Signups = await getSignups()


        if (Signups) {
            if (Signups.open === false) {

                let groups:string[][] = [];

                for(let q = 0; q < 2; q++){
                    groups.concat(await makeGroup(gNum, Signups.users.slice(0, am+1)))
                    groups.concat(await makeGroup(gNum2, Signups.users.slice(am+1, am2)))
                }


                
                let qualgroups: quallist = await getQuallist()
                if (qualgroups) {
                    qualgroups.users = groups

                    await updateQuallist(qualgroups)
                }

                else {
                    qualgroups = {
                        _id: 2,
                        url: "",
                        users: groups
                    }

                    await insertQuallist(qualgroups)
                }

                return message.reply("Made qualifier groups")

            }

            else {
                return message.reply("Signups haven't closed")
            }

        }

        else {
            return message.reply("No one signed up")
        }

    }
}

async function makeGroup(amount: number, list: string[]) {
    
    // function splitArrayIntoChunksOfLen(arr, len) {
    //     var chunks = [], i = 0, n = arr.length;
    //     while (i < n) {
    //       chunks.push(arr.slice(i, i += len));
    //     }
    //     return chunks;
    //   }

    let chunks:any[] = [], i = 0, n = list.length;

    while(i < n){
        chunks.push(list.slice(i, i += amount));
    }

    return chunks;

}

// async function makeGroup(n: number, list: string[]) {
//     let evenGroupds = Math.floor(list.length / n)
//     let groups = []
//     list = await shuffle(list)

//     let s = 0, end = n

//     for (let i = 0; i < evenGroupds; i++) {


//         let temp = list.slice(s, end)

//         s += n
//         end += n

//         groups.push(temp)
//     }

//     if (n % 2 == 0) {
//         groups.push(list.slice(evenGroupds * n - 1))
//     }

//     else {
//         groups.push(list.slice(evenGroupds * n - 1).slice(1))
//     }


//     return groups
// }

async function shuffle(a: any[]) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export async function matchwinner(args: string[]) {

    const client = challonge.createClient({
        apiKey: process.env.CHALLONGE
    });


    let score = `${args[1]}-${args[2]}`



    client.matches.update({
        id: await (await getMatchlist()).url,
        matchId: args[0],
        match: {
            scoresCsv: score,
            winnerId: args[3]
        },
        callback: (err: any, data: any) => {
            console.log(err, data);
        }
    });
}

export async function GroupSearch(message: Discord.Message, args: string[]) {
    let signup = await getQuallist()
    let id = (message.mentions?.users?.first()?.id || args[0])
    if (!id) return message.reply("invaild input. Please use User ID or a User mention")

    //let name = await (await message.guild!.members.cache.get(id))!.nickname || await (await client.users.fetch(id)).username


    for (let i = 0; i < signup.users.length; i++) {

        if (signup.users[i].includes(id)) {
            return await message.reply(`This person is in <#${message.guild!.channels.cache.find(channel => channel.name === `group-${i + 1}`)!.id}>`)
        }
    }

    return message.reply("they are not in a group")

}

export async function declarequalwinner(message: Discord.Message, client: Discord.Client) {

    if (message.member!.roles.cache.has('724818272922501190')
        || message.member!.roles.cache.has('724818272922501190')
        || message.member!.roles.cache.has('724832462286356590') || !message.member!.roles.cache.has('719936221572235295')) {

        try {

            let id = message.mentions!.users!.first()!.id
            let match = await getMatchlist()



            if (match) {
                if (match.users.includes(id)) {
                    return message.reply(" user already added.")
                }

                else {
                    match.users.push(id)
                    await updateMatchlist(match)
                    updateProfile(id, "wins", 1)
                    updateProfile(id, "points", 25)
                    await message.mentions!.users!.first()?.send("Congrats on winning your qualifer. Now get ready for the bracket portion")
                    return message.reply("added user.")
                }
            }

            else {

                let newmatch: matchlist = {
                    _id: 3,
                    url: "",
                    qualurl: "",
                    users: [],

                }

                newmatch.users.push(id)

                await insertMatchlist(newmatch)
                await message.mentions!.users!.first()?.send("Congrats on winning your qualifer. Now get ready for the bracket portion")
                return message.reply("added user.")

            }

        } catch (err) {
            message.channel.send("```" + err + "```")
            return message.reply(", there is an error! Ping blitz and show him the error.")
        }

    }

    else {
        await (await client.users.fetch(message.author.id)).send("You aren't allowed to use that command!")
    }
}

export async function removequalwinner(message: Discord.Message, client: Discord.Client) {

    if (message.member!.roles.cache.has('724818272922501190')
        || message.member!.roles.cache.has('724818272922501190')
        || message.member!.roles.cache.has('724832462286356590') || !message.member!.roles.cache.has('719936221572235295')) {


        try {

            let id = message.mentions!.users!.first()!.id
            let match = await getMatchlist()



            if (match) {
                if (match.users.includes(id)) {
                    match.users.splice(match.users.indexOf(id), 1)
                    await updateMatchlist(match)
                    return message.reply("user removed.")
                }

                else {
                    return message.reply("user not on list")
                }
            }

        } catch (err) {
            message.channel.send("```" + err + "```")
            return message.reply(", there is an error! Ping blitz and show him the error.")
        }

    }

    else {
        await (await client.users.fetch(message.author.id)).send("You aren't allowed to use that command!")
    }
}

export async function matchlistmaker() {
    let match = await getMatchlist()

    if (!match) {

        let newmatch: matchlist = {
            _id: 3,
            url: "",
            qualurl: "",
            users: [],

        }

        insertMatchlist(newmatch)
    }

    else {
        match.qualurl = ""
        match.users = []
        match.url = ""

        await updateMatchlist(match)
    }
}