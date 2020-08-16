import * as discord from "discord.js"
// import {getUser} from "../misc/utils"
// import {prefix} from "../misc/config.json"
import { activematch } from "../misc/struct"
import { deleteActive, deleteQuals, updateProfile, getSingularQuals, getMatch } from "../misc/db"
import { winner } from "./card"
import { dateBuilder } from "../misc/utils"

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
            .setFooter(dateBuilder())

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
            .setFooter(dateBuilder())

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
            .setFooter(dateBuilder())

        await channelid.send(embed)
    }
    
    else if (match.p1.votes > match.p2.votes) {
        let embed = new discord.MessageEmbed()
            .setTitle(`Match between ${user1.username} and ${user2.username}`)
            .setColor("#d7be26")
            .setDescription(`<@${user1.id}> has won with image A!\n The final votes where ${match.p1.votes} to ${match.p2.votes}`)
            .setFooter(dateBuilder())
        
        updateProfile(user1.id, "wins", 1)
        updateProfile(user2.id, "loss", 1)

        await channelid.send(embed)


        await channelid.send([await winner(client, user1.id)!])

        // let d = new Date()
        
        await (<discord.TextChannel>client.channels.cache.get("734565012378746950")).send((new discord.MessageEmbed()
            .setColor("#d7be26")
            .setImage(match.p1.memelink)
            .setDescription(`${(await (await channelid.guild!.members.fetch(user1.id)).nickname) || await (await client.users.fetch(user1.id)).username} won with ${match.p1.votes} votes!`)
            .setFooter(dateBuilder())
        ))

    
    }

    else if (match.p1.votes < match.p2.votes) {
        let embed = new discord.MessageEmbed()
            .setTitle(`Match between ${user1.username} and ${user2.username}`)
            .setColor("#d7be26")
            .setDescription(`<@${user2.id}> has won with image B!\n The final votes where ${match.p1.votes} to ${match.p2.votes}`)
            .setFooter(dateBuilder())

        updateProfile(user1.id, "loss", 1)
        updateProfile(user2.id, "wins", 1)

        await channelid.send(embed)
        await channelid.send([await winner(client, user2.id)!])

        // let d = new Date()
        
        await (<discord.TextChannel>client.channels.cache.get("734565012378746950")).send((new discord.MessageEmbed()
            .setColor("#d7be26")
            .setDescription(`${(await (await channelid.guild!.members.fetch(user2.id)).nickname) || await (await client.users.fetch(user2.id)).username} won with ${match.p2.votes} votes!`)
            .setImage(match.p2.memelink)
            .setFooter(dateBuilder())
            //.setTimestamp()
        ))
    }

    else if (match.p1.votes === match.p2.votes) {
        let embed = new discord.MessageEmbed()
            .setColor("#d7be26")
            .setTitle(`Match between ${user1.username} and ${user2.username}`)
            .setDescription(`Both users have gotten ${match.p1.votes} vote(s). Both users came to a draw.\nPlease find a new time for your rematch.`)
            .setFooter(dateBuilder())

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

            for (let i = 0; i < match.votes.length; i++){
                fields.push({
                    name: `${await (await client.users.fetch(match.players[i].userid)).username} | Meme #${match.players.indexOf(match.players[i]) + 1}`,
                    //value: `${match.votes[i].length > 0 ? `Came in with ${match.votes[i].length} vote(s)` : `Failed to submit meme`}`
                    value: `${match.players[i].memedone ? `Finished with ${match.votes[i].length} | Earned: ${Math.floor(match.votes[i].length/totalvotes*100)} points` : `Failed to submit meme`}`, //`Came in with ${match.votes[i].length}`,
                });
            }

            var list = [];
            for (var j = 0; j < match.votes.length; j++) 
                list.push({'votes': match.votes[j], 'field': fields[j]});

            //2) sort:
            list.sort(function(a, b) {
                //ratings.sort((a: modprofile, b: modprofile) => (b.modactions) - (a.modactions));
                return ((b.votes.length) - (a.votes.length));
                //Sort could be modified to, for example, sort on the age 
                // if the name is the same.
            });

            //3) separate them back out:
            for (var k = 0; k < list.length; k++) {
                match.votes[k] = list[k].votes;
                fields[k] = list[k].field;
            }

            await deleteQuals(match)

            await (await (<discord.TextChannel>client.channels.cache.get("722291182461386804")))
            .send({
                embed: {
                    title: `Votes for ${channel.name} are in!`,
                    description: `${totalvotes} votes for this qualifier`,
                    fields,
                    color: "#d7be26",
                    timestamp: new Date()
                }
            });

            return channel.send({
                embed: {
                    title: `Votes for ${channel.name} are in!`,
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