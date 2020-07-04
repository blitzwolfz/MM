//import { matchlist } from "../misc/struct";
import * as Discord from "discord.js";
import { getSignups, getMatchlist, updateMatchlist, insertMatchlist } from "../misc/db";
import { matchlist } from "../misc/struct";

const challonge = require("challonge-js")


export async function CreateChallongeQualBracket(message: Discord.Message, disclient: Discord.Client, args: string[]) {
    if (message.member!.roles.cache.has('724818272922501190')
        || message.member!.roles.cache.has('724818272922501190')
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

        console.log(id)

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


        matchlist.qualurl = `https://www.challonge.com/${id}`

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


export async function CreateChallongeMatchBracket(message: Discord.Message, disclient: Discord.Client, args: string[]) {
    if (message.member!.roles.cache.has('724818272922501190')
        || message.member!.roles.cache.has('724818272922501190')
        || message.member!.roles.cache.has('724832462286356590')) {

        const client = challonge.createClient({
            apiKey: process.env.CHALLONGE
        });

        let matchid = (args.join("")).replace("https://challonge.com/", "");

        let matchlist = await getMatchlist();

        console.log(matchid)

        let qualid = (matchlist.qualurl).replace("https://challonge.com/", "")



        await client.participants.index({
            id: qualid,
            callback: async (err:any, data: any) => {
                console.log(err);

                for (let i = 0; i < data.length; i++) {

                    if (data[i].participant.finalRank <= 16) {
                        console.log(data[i].participant.name)

                        await client.participants.create({
                            id: matchid,
                            participant: {
                                name: data[i].participant.name
                            },
                            callback: (err: any, data: any) => {
                                console.log(err, data);
                            }
                        });
                    }
                }
            }
        });


        matchlist.url = `https://www.challonge.com/${matchid}`

        await updateMatchlist(matchlist)

        //await ChannelCreation(message, disclient, ["1"])

        await message.reply(new Discord.MessageEmbed()
            .setColor("#d7be26")
            .setTitle(`Meme Mania ${args[0]}`)
            .setDescription(`Here's the link to the brackers\nhttps://www.challonge.com/${matchid}`)
            .setTimestamp())
    }

    else {
        await (await disclient.users.fetch(message.author.id)).send("You aren't allowed to use that command!")
    }

}


export async function ChannelCreation(message: Discord.Message, disclient: Discord.Client, args: string[]) {
    console.log("OK")
    if (!args) return message.reply("Please input round number!")

    else {

        const client = challonge.createClient({
            apiKey: process.env.CHALLONGE
        });

        let matchlist = await getMatchlist()

        console.log(disclient.ws.ping)

        console.log("OK")
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


                        if (data[i].match.winnerId === null && data[i].match.loserId === null) {


                            let oneid = data[i].match.player1Id

                            let twoid = data[i].match.player2Id

                            let channelstringname = ""

                            client.participants.index({
                                id: matchlist.url,
                                callback: async (err: any, data: any) => {
                                    if (err) console.log(err)

                                    for (let x = 0; x < data.length; x++) {
                                        if (data[x].participant.id === oneid) {
                                            channelstringname += data[x].participant.name.substring(0, 5)
                                        }

                                        if (channelstringname) {
                                            if (data[x].participant.id === twoid) {
                                                channelstringname += "vs" + data[x].participant.name.substring(0, 5)
                                                break
                                            }
                                        }
                                    }
                                    await message.guild!.channels.create(`${channelstringname}`, { type: 'text', topic: 'Round 1' })
                                        .then(async channel => {
                                            let category = await message.guild!.channels.cache.find(c => c.name == "matches" && c.type == "category");

                                            if (!category) throw new Error("Category channel does not exist");
                                            await channel.setParent(category.id);
                                        }
                                        )
                                }
                            });

                        }
                    }
                }

            }
        });
    }

}





// export async function CreateChallongeMatchBracket(message: Discord.Message, disclient: Discord.Client, args: string[]) {
//     if (message.member!.roles.cache.has('724818272922501190')
//         || message.member!.roles.cache.has('724818272922501190')
//         || message.member!.roles.cache.has('724832462286356590')) {


//         return message.reply(new Discord.MessageEmbed()
//             .setColor("#d7be26")
//             .setTitle(`MemeManiaMatchTest${num}`)
//             .setDescription(`Here's the link to the brackers\nhttps://www.challonge.com\\`)
//             .setTimestamp())
//     }

//     else {
//         await (await disclient.users.fetch(message.author.id)).send("You aren't allowed to use that command!")
//     }

// }

export async function declarequalwinner(message: Discord.Message, client: Discord.Client) {

    if (message.member!.roles.cache.has('724818272922501190')
        || message.member!.roles.cache.has('724818272922501190')
        || message.member!.roles.cache.has('724832462286356590')) {

        try {

            let id = message.mentions!.users!.first()!.id
            let match = await getMatchlist()

            if (!match) {

                let newmatch: matchlist = {
                    _id: 3,
                    url: "",
                    qualurl: "",
                    users: [],

                }

                newmatch.users.push(id)

                await updateMatchlist(newmatch)
                return message.reply(", added user.")

            }

            else if (match) {
                if (match.users.includes(id)) {
                    return message.reply(", user already added.")
                }

                else {
                    match.users.push(id)
                    await updateMatchlist(match)
                    return message.reply(", added user.")
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
}



// client.participants.show({
//     id: 'MemeManiaChannelTest',
//     participantId: data[i].match.player1Id,
//     callback: async (err:any, data:any) => {
//     if(err) console.log(err)
//     // console.log(data.participant.name)
//     console.log(channelstringname + data.participant.name.substring(0, 5))
//     channelstringname += data.participant.name.substring(0, 5)
//     }
//   });

// //console.log(channelstringname)

// client.participants.show({
//     id: 'MemeManiaChannelTest',
//     participantId: data[i].match.player2Id,
//     callback: async (err:any, data:any) => {
//         if(err) console.log(err)
//        //console.log(data.participant.name)
//         console.log(channelstringname + "vs" + data.participant.name.substring(0, 5))
//         channelstringname += "vs" + data.participant.name.substring(0, 5)
//     }
// });