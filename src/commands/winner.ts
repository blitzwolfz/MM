import * as discord from "discord.js"
import { activematch } from "../misc/struct"
import { deleteActive, deleteQuals, updateProfile, getSingularQuals, getMatch, getQual, deleteReminder, getReminder, insertReminder } from "../misc/db"
import { grandwinner, winner } from "./card"
import { dateBuilder, resultadd } from "../misc/utils"
import { matchwinner } from "./challonge"
require("dotenv").config();

export async function end(client: discord.Client, id: string) {
    let match: activematch = await getMatch(id)

    // if(!match.exhibition){

    //     for(let s = 0; s <  match.p1.voters.length; s++){
    //         await await updateProfile(match.p1.voters[s], "points", 2)
    //         await await updateProfile(match.p1.voters[s], "memesvoted", 1)
    //     }

    //     for(let t = 0; t <  match.p2.voters.length; t++){
    //         await await updateProfile(match.p2.voters[t], "points", 2)
    //         await await updateProfile(match.p2.voters[t], "memesvoted", 1)
    //     }
    // }

    await deleteActive(match)

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

        if (!match.exhibition) {

            updateProfile(user2.id, "wins", 1)
            updateProfile(user1.id, "loss", 1)
        }


        await channelid.send(embed)
        if(process.env.winner && match.exhibition === false){
            await channelid.send([await grandwinner(client, user2.id)!])
        }
        
        else{
            await channelid.send([await winner(client, user2.id)!])
        }
    }

    else if ((Math.floor(Date.now() / 1000) - match.p2.time > 1800) && match.p2.memedone === false) {
        console.log(Date.now() - match.p2.time)
        user2.send("You have failed to submit your meme, your opponet is the winner.")


        let embed = new discord.MessageEmbed()
            .setTitle(`Match between ${user1.username} and ${user2.username}`)
            .setColor("#d7be26")
            .setDescription(`<@${user1.id}> has won!`)
            .setFooter(dateBuilder())

        if (!match.exhibition) {
            updateProfile(user1.id, "wins", 1)
            updateProfile(user2.id, "loss", 1)
        }


        await channelid.send(embed)

        if(process.env.winner && match.exhibition === false){
            await channelid.send([await grandwinner(client, user1.id)!])
        }
        
        else{
            await channelid.send([await winner(client, user1.id)!])
        }

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
            .setDescription(`<@${user1.id}> has won with image A!\n The final votes were ${match.p1.votes} to ${match.p2.votes}`)
            .setFooter(dateBuilder())

        if (!match.exhibition) {
            updateProfile(user1.id, "wins", 1)
            updateProfile(user1.id, "points", (25 + (match.p1.votes * 5)))
            updateProfile(user2.id, "loss", 1)
            updateProfile(user2.id, "points", match.p2.votes * 5)
        }


        await channelid.send(embed)


        if(process.env.winner && match.exhibition === false){
            await channelid.send([await grandwinner(client, user1.id)!])
        }
        
        else{
            await channelid.send([await winner(client, user1.id)!])
        }

        if (!match.exhibition) {
            await user1.send(`Your match is over, here is the final result. You gained 25 points for winning your match, and ${(match.p1.votes * 5)} points from your votes.`, { embed: embed })
            await user2.send(`Your match is over, here is the final result. You gained ${(match.p2.votes * 5)} points from your votes.`, { embed: embed })
        }

        // let d = new Date()

        if (match.exhibition === false) {
            await (<discord.TextChannel>client.channels.cache.get("734565012378746950")).send((new discord.MessageEmbed()
                .setColor("#d7be26")
                .setImage(match.p1.memelink)
                .setDescription(`${(await (await channelid.guild!.members.fetch(user1.id)).nickname) || await (await client.users.fetch(user1.id)).username} won with ${match.p1.votes} votes!`)
                .setFooter(dateBuilder())
            ))
        }

        else if (match.exhibition === true) {
            await (<discord.TextChannel>client.channels.cache.get("780774797273071626")).send((new discord.MessageEmbed()
                .setColor("#d7be26")
                .setImage(match.p1.memelink)
                .setDescription(`<@${user1.id}> beat <@${user2.id}>.\nThe final score was ${match.p1.votes} to ${match.p2.votes} votes!`)
                .setFooter(dateBuilder())
            ))
        }



    }

    else if (match.p1.votes < match.p2.votes) {
        let embed = new discord.MessageEmbed()
            .setTitle(`Match between ${user1.username} and ${user2.username}`)
            .setColor("#d7be26")
            .setDescription(`<@${user2.id}> has won with image B!\n The final votes were ${match.p1.votes} to ${match.p2.votes}`)
            .setFooter(dateBuilder())

        if (!match.exhibition) {
            updateProfile(user1.id, "loss", 1)
            updateProfile(user1.id, "points", match.p1.votes * 5)
            updateProfile(user2.id, "wins", 1)
            updateProfile(user2.id, "points", (25 + (match.p2.votes * 5)))
        }

        await channelid.send(embed)
        if(process.env.winner && match.exhibition === false){
            await channelid.send([await grandwinner(client, user2.id)!])
        }
        
        else{
            await channelid.send([await winner(client, user2.id)!])
        }

        // let d = new Date()

        if (match.exhibition === false) {
            await (<discord.TextChannel>client.channels.cache.get("734565012378746950")).send((new discord.MessageEmbed()
                .setColor("#d7be26")
                .setImage(match.p2.memelink)
                .setDescription(`${(await (await channelid.guild!.members.fetch(user2.id)).nickname) || await (await client.users.fetch(user2.id)).username} won with ${match.p2.votes} votes!`)
                .setFooter(dateBuilder())
            ))
        }

        else if (match.exhibition === true) {
            await (<discord.TextChannel>client.channels.cache.get("780774797273071626")).send((new discord.MessageEmbed()
                .setColor("#d7be26")
                .setImage(match.p2.memelink)
                .setDescription(`<@${user2.id}> beat <@${user1.id}>.\nThe final score was ${match.p2.votes} to ${match.p1.votes} votes!`)
                .setFooter(dateBuilder())
            ))
        }

        if (!match.exhibition) {
            await user1.send(`Your match is over, here is the final result. You gained ${(match.p1.votes * 5)} points from your votes.`, { embed: embed })
            await user2.send(`Your match is over, here is the final result. You gained 25 points for winning your match, and gained ${(match.p2.votes * 5)} points from your votes.`, { embed: embed })
        }
    }

    else if (match.p1.votes === match.p2.votes) {

        
        await user1.send(`Your match is over,both of you ended in a tie of ${match.p1.votes}`)
        await user2.send(`Your match is over, both of you ended in a tie of ${match.p1.votes}`)

        await channelid.send(new discord.MessageEmbed()
        .setColor("#d7be26")
        .setTitle(`Match between ${user1.username} and ${user2.username}`)
        .setDescription(`Both users have gotten ${match.p1.votes} vote(s). Both users came to a draw.`)
        .setFooter(dateBuilder()))
        
        if(match.exhibition === false){
            await channelid
            .send(`<@${user1.id}> <@${user2.id}> Please complete this re-match ASAP. Contact a ref to begin.`)
        }
    }

    let t = channelid.topic!.toString().split(",")


    if (!match.exhibition) {

        for (let s = 0; s < match.p1.voters.length; s++) {
            await await updateProfile(match.p1.voters[s], "points", 2)
            await await updateProfile(match.p1.voters[s], "memesvoted", 1)
        }

        for (let t = 0; t < match.p2.voters.length; t++) {
            await await updateProfile(match.p2.voters[t], "points", 2)
            await await updateProfile(match.p2.voters[t], "memesvoted", 1)
        }

        let m = await channelid.messages.cache.first()!.mentions.users.first()!.id

        let winnerid = (m === match.p1.userid ? `${t[1]}` : `${t[2]}`);

        if (channelid.topic) {
            if (match.p1.votes > match.p2.votes) {
                await matchwinner([`${t[0]}`, `${match.p1.votes}`, `${match.p2.votes}`, `${winnerid}`])
            }

            if (match.p2.votes > match.p1.votes) {
                await matchwinner([`${t[0]}`, `${match.p2.votes}`, `${match.p1.votes}`, `${winnerid}`])
            }
        }
    }

    try{
        await deleteReminder(await getReminder(match._id))
        await deleteReminder(await getReminder(match.p1.userid))
        await deleteReminder(await getReminder(match.p2.userid))
    } catch {
        console.log("fuck")
    }

    // matches.splice(matches.indexOf(match), 1)
    return;
}


export async function qualend(client: discord.Client, id: string) {
    

    const match = await getSingularQuals(id)
    let s = ""
    
    for (let i = 0; i < match.players.length; i++) {
        s += `<@${match.players[i].userid}> `
    }
    
    let channel = <discord.TextChannel>client.channels.cache.get(id)
    try{
        await deleteReminder(await getReminder(channel.id))
    } catch {
        console.log("Reminder has already been deleted")
    }

    if (match.votingperiod) {

        if (match.playersdone.length <= 2 && match.playersdone.length >= 1) {

            let fields = [];
            //value: `${match.players[i].memedone ? `Finished with ${match.votes[i].length} | Earned: ${Math.floor(match.votes[i].length / totalvotes * 100)}% of the votes\nUserID: ${match.players[i].userid}` : `Finished with ${0} | Earned: ${0}% of the votes\nUserID: ${match.players[i].userid}`}`, //`Came in with ${match.votes[i].length}`,

            for (let i = 0; i < match.votes.length; i++)
                if (match.players[i].memedone && match.playersdone.length === 2) {
                    fields.push({
                        name: `${await (await client.users.fetch(match.players[i].userid)).username}`,
                        value: `Finished with 50 | Earned: 50% of the votes\nUserID: ${match.players[i].userid}`
                    });
                }

                else if (match.players[i].memedone && match.playersdone.length === 1) {
                    fields.push({
                        name: `${await (await client.users.fetch(match.players[i].userid)).username}`,
                        value: `Finished with 100 | Earned: 100% of the votes\nUserID: ${match.players[i].userid}`
                    });
                }

                else if (match.players[i].memedone === false) {
                    fields.push({
                        name: `<@${await (await client.users.fetch(match.players[i].userid)).username}>-Failed`,
                        value: `Finished with ${0} | Earned: ${0}% of the votes\nUserID: ${match.players[i].userid}`
                    });
                }

            await deleteQuals(match)
            let c = <discord.TextChannel>client.channels.cache.get(channel.id)

            let m = (await c.messages.fetch({limit:100})).last()!

            let time = Math.floor(((Math.floor(m.createdTimestamp/1000)+ 259200) - Math.floor(Date.now()/1000))/3600)

            if(time <= 72){
                await channel.send(`${s} you have ${time}h left to complete Portion 2`)
            }
            return channel.send({
                embed: {
                    title: `Qualifier has ended`,
                    fields,
                    color: "#d7be26",
                    timestamp: new Date()
                }
            });
        }

        if (match.playersdone.length === 0) {
            await deleteQuals(match)
            let c = <discord.TextChannel>client.channels.cache.get(channel.id)

            let m = (await c.messages.fetch({limit:100})).last()!

            let time = Math.floor(((Math.floor(m.createdTimestamp/1000)+ 259200) - Math.floor(Date.now()/1000))/3600)

            if(time <= 72 && channel.topic?.split(" ").length !== 1){
                await channel.send(`${s} you have ${time}h left to complete Portion 2`)
            }
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

            let totalvotes: number = 0;


            for (let votes of match.votes) {
                totalvotes += votes.length
            }

            for (let i = 0; i < match.votes.length; i++) {

                let name = `${await (await client.users.fetch(match.players[i].userid)).username} | Meme #${match.players.indexOf(match.players[i]) + 1}${match.players[i].memedone ? ``: `-Failed`}`

                fields.push({
                    name: name,
                    //value: `${match.votes[i].length > 0 ? `Came in with ${match.votes[i].length} vote(s)` : `Failed to submit meme`}`
                    value: `${match.players[i].memedone ? `Finished with ${match.votes[i].length} | Earned: ${Math.floor(match.votes[i].length / totalvotes * 100)}% of the votes\nUserID: ${match.players[i].userid}` : `Finished with ${0} | Earned: ${0}% of the votes\nUserID: ${match.players[i].userid}`}`,
                });
            }

            var list = [];
            for (var j = 0; j < match.votes.length; j++)
                list.push({ 'votes': match.votes[j], 'field': fields[j] });

            //2) sort:
            list.sort(function (a, b) {
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

            for (let i = 0; i < match.votes.length; i++) {
                for (let x = 0; x < match.votes[i].length; x++) {
                    await updateProfile(match.votes[i][x], "points", 2)
                    await updateProfile(match.votes[i][x], "memesvoted", 1)
                }
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
                try{
                    await deleteReminder(await getReminder(match._id))
                } catch {
                    console.log("fuck")
                }
            channel.send({
                embed: {
                    title: `Votes for ${channel.name} are in!`,
                    description: `${totalvotes} votes for this qualifier`,
                    fields,
                    color: "#d7be26",
                    timestamp: new Date()
                }
            }).then(async message => {

                console.log("This is msg id:", message)

                let t = channel.topic?.split(" ")


                if (!t) {
                    await channel.setTopic(message.id)

                }

                else if (t.join("").toLowerCase() === "round1") await channel.setTopic(message.id);

                else if (t.length === 1) {
                    // t.push(message.id)

                    // await channel.setTopic(t.join(" "))

                    let emm = await resultadd(channel, client, [channel.topic!.split(" ")[0], message.id])

                    await channel.send({ embed:emm }).then(m => m.react(`👌`))

                    return await (await (<discord.TextChannel>client.channels.cache.get("722291182461386804")))
                        .send({ embed:emm });
                }

            });


            let c = <discord.TextChannel>client.channels.cache.get(channel.id)

            let m = (await c.messages.fetch({limit:100})).last()!

            let time = Math.floor(((Math.floor(m.createdTimestamp/1000)+ 259200) - Math.floor(Date.now()/1000))/3600)

            if(time <= 72 && channel.topic?.split(" ").join("").toLowerCase() === "round1"){
                await channel.send(`${s} you have ${time}h left to complete Portion 2`)
                // let timeArr:Array<number> = []
            
                // if((time-2)*3600 > 0){
                //     timeArr.push((time-2)*3600)
                // }
        
                // if((time-12)*3600 > 0){
                //     timeArr.push((time-12)*3600)
                // }
        
                // if((time-24)*3600 > 0){
                //     timeArr.push((time-24)*3600)
                // }
        
                // await insertReminder(
                //     {
                //         _id:channel.id,
                //         mention:`${s}`,
                //         channel:channel.id,
                //         type:"match",
                //         time:timeArr,
                //         timestamp:Math.floor(Date.now()/1000),
                //         basetime:time*3600
                //     }
                // )

                let time2 = 36

                let timeArr:Array<number> = []
            
                if((time2-2)*3600 > 0){
                    timeArr.push((time2-2)*3600)
                }
        
                if((time2-12)*3600 > 0){
                    timeArr.push((time2-12)*3600)
                }
                // let addon = function (t:number) {
                //     if(t > 36){
                        
                //     }
                    
                //     return a * b
                // };

                await insertReminder(
                    {
                        _id:channel.id,
                        mention:`${s}`,
                        channel:channel.id,
                        type:"match",
                        time:timeArr,
                        timestamp:Math.floor(Date.now()/1000), //+Math.abs(),
                        basetime:time2*3600
                    }
                )
            }
            //return;

            // if(channel.topic?.length === 2){



            // }
        }
    }

    else if (!match.votingperiod) {
        await deleteQuals(match)

        try{
            await deleteReminder(await getReminder(match._id))
        } catch {
            console.log("fuck")
        }

        return channel.send({
            embed: {
                title: `Votes for this qualifier are in!`,
                color: "#d7be26",
                description: "Match has ended early before voting period.\nPlease contact mod for information",
                timestamp: new Date()
            }
        });
    }

    //let qlist = await getMatchlist()
    // let timestamp = parseInt(qlist.qualurl)
    // if(Math.floor(Date.now()/1000) - Math.floor(timestamp/1000) > 0){
    //     await channel.send(`Next portion has begun, and you have ${Math.floor((Math.floor(Date.now()/1000) - Math.floor(timestamp/1000))/3600)}h to complete it. Contact a ref to begin your portion!`)
    // }
}


export async function cancelmatch(message: discord.Message) {
    if (await getMatch(message.channel.id)) {
        await deleteActive(await getMatch(message.channel.id))
        try {
            await deleteReminder(await getReminder(message.channel.id))   
        } catch (error) {
            console.log("")
        }
        return await message.reply("this match has been cancelled")

    }

    else if (await getQual(message.channel.id)) {
        await deleteQuals(await getQual(message.channel.id))
        try {
            await deleteReminder(await getReminder(message.channel.id))   
        } catch (error) {
            console.log("")
        }
        return await message.reply("this qualifier has been cancelled")
    }

    else {
        return await message.reply("there are no matches")
    }
}