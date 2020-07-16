//import { matchlist } from "../misc/struct";
import * as Discord from "discord.js";
import { getSignups, getMatchlist, updateMatchlist, insertMatchlist, insertQuallist, getQuallist, updateQuallist } from "../misc/db";
import { matchlist, quallist } from "../misc/struct";


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





        for (let i = 0; i < matchlist.users.length; i++) {
            console.log("ok")
            let name = (await guild!.members.fetch(matchlist.users[i])).nickname


            
            console.log("ok")
            console.log(name)


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

                                    if (channelstringname.includes("vs")) {
                                        await message.guild!.channels.create(`${channelstringname}`, { type: 'text', topic: `Round ${args[0]}` })
                                            .then(async channel => {
                                                let category = await message.guild!.channels.cache.find(c => c.name == "tournament" && c.type == "category");

                                                if (!category) throw new Error("Category channel does not exist");
                                                await channel.setParent(category.id);
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

}


export async function CreateQualGroups(message: Discord.Message, args: string[]) {
    if (message.member!.roles.cache.has('724818272922501190')
        || message.member!.roles.cache.has('724832462286356590')) {
        

         if (!args){
             return message.reply("Please enter how many people you want in a group")
         }   
        let gNum = parseInt(args[0])

        let Signups = await getSignups()


        if (Signups) {
            if (Signups.open === false) {
                let groups = await makeGroup(gNum, Signups.users)
                let qualgroups:quallist = await getQuallist()
                if(qualgroups){
                    qualgroups.users = groups

                    await updateQuallist(qualgroups)
                }

                else{
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

async function makeGroup(n: number, list: string[]){
    let evenGroupds = Math.floor(list.length / n)
    let groups = []
    list = await shuffle(list)

    let s = 0, end = n

    for(let i = 0; i < evenGroupds; i++){
        

        let temp = list.slice(s, end)

        s += n
        end += n

        groups.push(temp)
    }
    
    if(n%2 == 0){
        groups.push(list.slice(evenGroupds*n - 1))
    }
    
    else{
        groups.push(list.slice(evenGroupds*n - 1).slice(1))
    }


    return groups
}

async function shuffle(a: any[]) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export async function quallistEmbed(message: Discord.Message, client: Discord.Client, args: string[]){



    let signup = await getQuallist()

    if(args.length === 0){
        return message.reply(`, there are ${signup.users.length} groups`)
    }

    else {
        let page = parseInt(args[0])

        page -= 1

        const fields = [];

        for (let i = 0; i < signup.users[page].length; i++)
            fields.push({
                name: `${i + 1}) ${await (await client.users.fetch(signup.users[page][i])).username}`,
                value: `Userid is: ${signup.users[page][i]}`
            });

        return {
            title: `Group ${page += 1}`,
            description: "Groups for quals",
            fields,
            color: "#d7be26",
            timestamp: new Date()
        };
    }
}

export async function GroupSearch(message: Discord.Message, client: Discord.Client, args: string[]){
    let signup = await getQuallist()
    let id = (message.mentions?.users?.first()?.id || args[0])
    if(!id) return message.reply("invaild input. Please use User ID or a User mention")

    for (let i = 0; i < signup.users.length; i++){

        if(signup.users[i].includes(id)){
            return message.reply(`${await (await client.users.fetch(id)).username} is in #group-${i+1}`)
        }
    }

    return message.reply("they are not in a group")
    
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



            if (match) {
                if (match.users.includes(id)) {
                    return message.reply(" user already added.")
                }

                else {
                    match.users.push(id)
                    await updateMatchlist(match)
                    return message.reply(" added user.")
                }
            }

            else{

                let newmatch: matchlist = {
                    _id: 3,
                    url: "",
                    qualurl: "",
                    users: [],

                }

                newmatch.users.push(id)

                await insertMatchlist(newmatch)
                return message.reply(", added user.")

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
        || message.member!.roles.cache.has('724832462286356590')) {

        try {

            let id = message.mentions!.users!.first()!.id
            let match = await getMatchlist()



            if (match) {
                if (match.users.includes(id)) {
                    match.users.splice( match.users.indexOf(id), 1 )
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