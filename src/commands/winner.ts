import * as discord from "discord.js"
// import {getUser} from "../misc/utils"
// import {prefix} from "../misc/config.json"
import { activematch} from "../misc/struct"
import { deleteActive, deleteQuals, getActive, updateProfile, getSingularQuals, getMatch } from "../misc/db"
import { winner } from "./card"

export async function endmatch(message: discord.Message, client: discord.Client) {
    let matches: activematch[] = await getActive()

    for (const match of matches) {
        let user1 = (await client.users.fetch(match.p1.userid))
        let user2 = (await client.users.fetch(match.p2.userid))

        let channelid = <discord.TextChannel>client.channels.cache.get(match.channelid)

        if (message.channel.id === channelid.id) {
            if (match.votingperiod) {
                if (match.p1.votes > match.p2.votes) {
                    let embed = new discord.MessageEmbed()
                        .setColor("#d7be26")
                        .setTitle(`Match between ${user1.username} and ${user2.username}`)
                        .setDescription(`<@${user1.id}> has won!\n The final votes where ${match.p1.votes} to ${match.p2.votes}\n${user1.username} won with image A`)
                        .setTimestamp()

                    updateProfile(user1.id, "wins", 1)
                    updateProfile(user2.id, "loss", 1)

                    channelid.send(embed)

                }

                else if (match.p1.votes < match.p2.votes) {
                    let embed = new discord.MessageEmbed()
                        .setTitle(`Match between ${user1.username} and ${user2.username}`)
                        .setColor("#d7be26")
                        .setDescription(`<@${user2.id}> has won!\n The final votes where ${match.p1.votes} to ${match.p2.votes}\n${user2.username} won with image B`)
                        .setTimestamp()

                    updateProfile(user2.id, "wins", 1)
                    updateProfile(user1.id, "loss", 1)

                    channelid.send(embed)
                }

                else if (match.p1.votes === match.p2.votes) {
                    let embed = new discord.MessageEmbed()
                        .setColor("#d7be26")
                        .setTitle(`Match between ${user1.username} and ${user2.username}`)
                        .setDescription(`Both users have come to a draw.\nPlease find a new time for your rematch.`)
                        .setTimestamp()

                    channelid.send(embed)
                }

                // matches.splice(matches.indexOf(match), 1)
                await deleteActive(match)
                break;
            }

            else {
                let embed = new discord.MessageEmbed()
                    .setTitle(`Match between ${user1.username} and ${user2.username}`)
                    .setColor("#d7be26")
                    .setDescription(`Match has ended early before voting period.\nPlease contact mod for information`)
                    .setTimestamp()

                channelid.send(embed)
                // matches.splice(matches.indexOf(match), 1)
                await deleteActive(match)
                break;
            }
        }

    }
}


export async function end(client: discord.Client, id: string) {
    let match: activematch = await getMatch(id)

    console.log(match)

    let channelid = <discord.TextChannel>client.channels.cache.get(match.channelid)
    let user1 = (await client.users.fetch(match.p1.userid))
    let user2 = (await client.users.fetch(match.p2.userid))

    console.log(Math.floor(Date.now() / 1000) - match.votetime)
    console.log((Math.floor(Date.now() / 1000) - match.votetime) >= 35)
    if ((Math.floor(Date.now() / 1000) - match.p1.time > 1800) && match.p1.memedone === false) {
        user1.send("You have failed to submit your meme, your opponet is the winner.")

        let embed = new discord.MessageEmbed()
            .setTitle(`Match between ${user1.username} and ${user2.username}`)
            .setColor("#d7be26")
            .setDescription(`<@${user2.id}> has won!`)
            .setTimestamp()

        updateProfile(user2.id, "wins", 1)
        updateProfile(user1.id, "loss", 1)

        await channelid.send(embed)
        await channelid.send([await winner(client, user2.id)!])
    }

    else if ((Math.floor(Date.now() / 1000) - match.p2.time > 1800) && match.p2.memedone === false) {
        console.log(Date.now() - match.p2.time)
        user2.send("You have failed to submit your meme, your opponet is the winner.")

        let embed = new discord.MessageEmbed()
            .setTitle(`Match between ${user1.username} and ${user2.username}`)
            .setColor("#d7be26")
            .setDescription(`<@${user1.id}> has won!`)
            .setTimestamp()

        updateProfile(user1.id, "wins", 1)
        updateProfile(user2.id, "loss", 1)

        await channelid.send(embed)
        await channelid.send([await winner(client, user1.id)!])

    }

    else if (((Math.floor(Date.now() / 1000) - match.p2.time > 1800) && match.p2.memedone === false) && ((Math.floor(Date.now() / 1000) - match.p1.time > 1800) && match.p1.memedone === false)) {
        user1.send("You have failed to submit your meme")
        user2.send("You have failed to submit your meme")

        let embed = new discord.MessageEmbed()
            .setTitle(`Match between ${user1.username} and ${user2.username}`)
            .setColor("#d7be26")
            .setDescription(`<@${user1.id}> & ${user2.id}have lost\n for not submitting meme on time`)
            .setTimestamp()

        await channelid.send(embed)
    }
    
    else if (match.p1.votes > match.p2.votes) {
        let embed = new discord.MessageEmbed()
            .setTitle(`Match between ${user1.username} and ${user2.username}`)
            .setColor("#d7be26")
            .setDescription(`<@${user1.id}> has won with image A!\n The final votes where ${match.p1.votes} to ${match.p2.votes}`)
            .setTimestamp()
        
        updateProfile(user1.id, "wins", 1)
        updateProfile(user2.id, "loss", 1)

        await channelid.send(embed)


        await channelid.send([await winner(client, user1.id)!])

        // let d = new Date()
        
        await (<discord.TextChannel>client.channels.cache.get("734565012378746950")).send((new discord.MessageEmbed()
            .setColor("#d7be26")
            .setImage(match.p1.memelink)
            .setDescription(`${(await (await channelid.guild!.members.fetch(user1.id)).nickname) || await (await client.users.fetch(user1.id)).username} won with ${match.p1.votes} votes!`)
            .setTimestamp()
        ))

    
    }

    else if (match.p1.votes < match.p2.votes) {
        let embed = new discord.MessageEmbed()
            .setTitle(`Match between ${user1.username} and ${user2.username}`)
            .setColor("#d7be26")
            .setDescription(`<@${user2.id}> has won with image B!\n The final votes where ${match.p1.votes} to ${match.p2.votes}`)
            .setTimestamp()

        updateProfile(user1.id, "loss", 1)
        updateProfile(user2.id, "wins", 1)

        await channelid.send(embed)
        await channelid.send([await winner(client, user2.id)!])

        // let d = new Date()
        
        await (<discord.TextChannel>client.channels.cache.get("734565012378746950")).send((new discord.MessageEmbed()
            .setColor("#d7be26")
            .setDescription(`${(await (await channelid.guild!.members.fetch(user2.id)).nickname) || await (await client.users.fetch(user2.id)).username} won with ${match.p2.votes} votes!`)
            .setImage(match.p2.memelink)
            .setTimestamp()
        ))
    }

    else if (match.p1.votes === match.p2.votes) {
        let embed = new discord.MessageEmbed()
            .setColor("#d7be26")
            .setTitle(`Match between ${user1.username} and ${user2.username}`)
            .setDescription(`Both users have gotten ${match.p1.votes} vote(s). Both users came to a draw.\nPlease find a new time for your rematch.`)
            .setTimestamp()

        await channelid.send(embed)
    }

    // matches.splice(matches.indexOf(match), 1)
    await deleteActive(match)
    return;
}


export async function qualend(client: discord.Client, id: string) {

    const match = await getSingularQuals(id)
    let channel = <discord.TextChannel>client.channels.cache.get(id)
    let guild = client.guilds.cache.get("719406444109103117")

    if (match.votingperiod) {

        if (match.playersdone.length <= 2 && match.playersdone.length >= 1) {

            let fields = [];
            for (let i = 0; i < match.votes.length; i++)
                if(match.players[i].memedone){
                    fields.push({
                        name: `${(await (await guild!.members.fetch(match.players[i].userid)).nickname) || await (await client.users.fetch(match.players[i].userid)).username}`,
                        value: `Has automatically won!`
                    });
                }
                else if(match.players[i].memedone === false){
                    fields.push({
                        name: `${(await (await guild!.members.fetch(match.players[i].userid)).nickname) || await (await client.users.fetch(match.players[i].userid)).username}`,
                        value: `Failed to submit meme!`
                    });
                }

            await deleteQuals(match)
            return channel.send({
                embed: {
                    title: `Qualifier has ended`,
                    fields,
                    color: "#d7be26",
                    timestamp: new Date()
                }
            });
        }

        if(match.playersdone.length === 0){
            await deleteQuals(match)
            return channel.send({
                embed: {
                    title: `Qualifier has ended. No one submitted a meme.`,
                    color: "#d7be26",
                    timestamp: new Date()
                }
            });
        }

        else if (match.playersdone.length > 2) {
            const fields = [];

            let totalvotes:number = 0;

            for(let votes of match.votes){
                totalvotes += votes.length
            }

            for (let i = 0; i < match.votes.length; i++)
                fields.push({
                    name: `${(await (await guild!.members.fetch(match.players[i].userid)).nickname) || await (await client.users.fetch(match.players[i].userid)).username} | Meme #${match.players.indexOf(match.players[i]) + 1}`,
                    //value: `${match.votes[i].length > 0 ? `Came in with ${match.votes[i].length} vote(s)` : `Failed to submit meme`}`
                    value: `${match.players[i].memedone ? `Finished with ${match.votes[i].length} | ${Math.floor(match.votes[i].length/totalvotes*100)}% of the votes ` : `Failed to submit meme`}`, //`Came in with ${match.votes[i].length}`,
                });

            await deleteQuals(match)

            return channel.send({
                embed: {
                    title: `Votes for this qualifier are in!`,
                    description: `${totalvotes} votes for this qualifier`,
                    fields,
                    color: "#d7be26",
                    timestamp: new Date()
                }
            });
        }
    }

    else if (!match.votingperiod) {
        await deleteQuals(match)
        
        return channel.send({
            embed: {
                title: `Votes for this qualifier are in!`,
                color: "#d7be26",
                description: "Match has ended early before voting period.\nPlease contact mod for information",
                timestamp: new Date()
            }
        });
    }
}




// let matches: qualmatch[] = await getQuals()

// for (const match of matches) {

//     if (id === match.channelid) {
//         let channel = <discord.TextChannel>await client.channels.fetch(match.channelid)

//         if (match.votingperiod) {

//             if (match.playersdone.length <= 2) {
//                 const fields = [];
//                 for (let i = 0; i < match.votes.length; i++)
//                     fields.push({
//                         name: `${await (await client.users.fetch(match.players[i].userid)).username}`,
//                         value: `Has automatically won!`
//                     });
//                 await deleteQuals(match)
//                 return channel.send({
//                     embed: {
//                         title: `Qualifier has ended`,
//                         fields,
//                         color: "#d7be26",
//                         timestamp: new Date()
//                     }
//                 });
//             }

//             else {
//                 const fields = [];
//                 for (let i = 0; i < match.votes.length; i++)
//                     fields.push({
//                         name: `${await (await client.users.fetch(match.players[i].userid)).username}`,
//                         value: `${match.votes[i].length > 0 ? `Came in with ${match.votes[i].length} vote(s)` : `Failed to submit meme`}`
//                     });
//                 await deleteQuals(match)
//                 return channel.send({
//                     embed: {
//                         title: `Votes for this qualifier are in!`,
//                         fields,
//                         color: "#d7be26",
//                         timestamp: new Date()
//                     }
//                 });
//             }
//         }

//         else if(!match.votingperiod){
//             let channel = <discord.TextChannel>await client.channels.fetch(match.channelid)
//             let em = new discord.MessageEmbed()
//                 .setTitle(`Qualifier match`)
//                 .setColor("#d7be26")
//                 .setDescription(`Match has ended early before voting period.\nPlease contact mod for information`)
//                 .setTimestamp()
//             await deleteQuals(match)
//             return channel.send(em)
//         }
//     }
// }

// let channel = <discord.TextChannel>await client.channels.fetch(id)

// return channel.send(
//     new discord.MessageEmbed()
//     .setTitle(`Qualifier match`)
//     .setColor("#d7be26")
//     .setDescription(`No match is running in this channel`)
//     .setTimestamp()
// )