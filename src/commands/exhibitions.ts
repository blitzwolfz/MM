import * as Discord from "discord.js"
import { getExhibition, insertActive, updateExhibition } from "../misc/db"
import { getRandomTemplateList, getRandomThemeList } from "../misc/randomtemp"
import { activematch } from "../misc/struct"

export async function exhibition(message: Discord.Message, client: Discord.Client, args: string[]){

    console.log(args)

    if (!message.mentions.users.array()){
        return message.reply("Please mention someone")
    }

    else if (message.mentions.users.first()?.id === message.author.id){
        return message.reply("No boni")
    }


    if (args.length < 2){
        return message.reply("Please use flag theme or template")
    }

    if (args.length >= 3){
        return message.reply("No too many arguments. Use either theme or template")
    }

    else if(!["template", "theme"].includes(args[1].toLowerCase())){
        return message.reply("Please use flag theme or template")
    }

    let ex = await getExhibition()

    if(ex.cooldowns.some(x => x.user === message.author.id)){
        return message.reply("It hasn't been 3h yet")
    }

    let m = message


    // if (ex.cooldowns.findIndex(x => (x.user === (message.author.id)) || (x.user === (message.mentions.users.first()?.id)))){
    //     return message.reply("it has not been 3 hours yet")
    // }


        // m.author.send(`<@${m.mentions.users.first()?.id}> has declined your match proposal`)
        // return message.author.send('Match has been cancelled');

        
    //const msg = await message.mentions.users.first()?.send("Do you accept this match?")

    const filter = (response:any) => {
        return (("accept").toLowerCase() === response.content.toLowerCase());
    };

    var res;
    console.log(`Value of res is: ${res}`)
    
    
    await message.mentions.users.first()?.send(`<@${m.author.id}> wants to duel you. Send Accept to continue, or don't reply to not`).then(async (userdm:Discord.Message) => {
        console.log(userdm.channel.id)
        await userdm.channel.awaitMessages(filter, { max: 1, time: 90000, errors: ['time'] })
            .then(async collected => {
                await m.channel.send(`${collected.first()!.author} accepted, <@${m.author.id}>!`);
                res = true;
            })

            .catch(async collected => {
                await m.author.send(`<@${m.author.id}> match has been declined`);
                res = false;
                return;
            });
    });

    console.log(`Value of res is: ${res}`)
    

    if(res){

        ex.cooldowns.push({
            user:m.author.id,
            time:Math.floor(Date.now() / 1000)
        })
    
        await updateExhibition(ex)
    
        ex = await getExhibition()

        let guild = client.guilds.cache.get("719406444109103117")
        let category = await guild!.channels.cache.find(c => c.name == "duels" && c.type == "category")!;


        await guild?.channels
        .create(`${message.author.username}-vs-${message.mentions.users.first()?.username}`, { type: 'text', topic: `Exhibition Match`, parent: category!.id})
        .then(async channel => {
            // if (!category) throw new Error("Category channel does not exist");
            await channel.lockPermissions()
            //console.log(`Channel made on: ${channel.createdTimestamp}, ${channel.createdAt}`)
            // await channel.createOverwrite(message.author.id, {"READ_MESSAGE_HISTORY": true, "SEND_MESSAGES":true})
            // await channel.createOverwrite(message.mentions.users.first()!.id, {"READ_MESSAGE_HISTORY": true, "SEND_MESSAGES":true})

            let newmatch: activematch = {
                _id: channel.id,
                channelid: channel.id,
                split: false,
                exhibition:true,
                messageID: "",
                template: "",
                theme: "",
                tempfound: false,
                p1: {
                    userid: message.author.id,
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
                    userid: message.mentions.users.first()!.id,
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

            let user1 = message.author
            let user2 = message.mentions.users.first()!


            if(args[1] === "template"){
                let templatelist = await getRandomTemplateList(client)
                newmatch.template = templatelist[Math.floor(Math.random() * (((templatelist.length - 1) - 1) - 1) + 1)];
            }

            if(args[1] === "theme"){
                let templatelist = await getRandomThemeList(client)
                newmatch.theme = templatelist[Math.floor(Math.random() * (((templatelist.length - 1) - 1) - 1) + 1)];
            }

            let embed = new Discord.MessageEmbed()
            .setTitle(`Match between ${user1.username ? user1.username : (await message.guild!.members.fetch(user1.id)).nickname} and ${user2.username ? user2.username :(await message.guild!.members.fetch(user2.id)).nickname}`)
            .setColor("#d7be26")
            .setDescription(`<@${user1.id}> and <@${user2.id}> both have 30 mins to complete your memes.\n Contact admins if you have an issue.`)
            .setTimestamp()
    
    
    
            channel.send({ embed })   

            if(args[1] === "theme"){
                await user1.send(`Your theme is: ${newmatch.theme}`)
                await user2.send(`Your theme is: ${newmatch.theme}`)

            }
            
            else{
                await user1.send(new Discord.MessageEmbed()
                .setTitle("Your template")
                .setImage(newmatch.template)
                .setColor("#d7be26")
                .setTimestamp())
            
                await user2.send(new Discord.MessageEmbed()
                .setTitle("Your template")
                .setImage(newmatch.template)
                .setColor("#d7be26")
                .setTimestamp())
            }

        
        
      
        
            await user1.send(`You have 30 mins to complete your meme\nUse \`!submit\` to submit each image`)
            await user2.send(`You have 30 mins to complete your meme\nUse \`!submit\` to submit each image`)

            await insertActive(newmatch)
            ex.activematches.push(channel.id)
            await updateExhibition(ex)
            
        });
    }

    
    // if(collected.array() === 'cancel') return message.reply('Canceled');
    // message.author.send('Done !');

}


export async function deleteExhibitionchannels(client: Discord.Client) {
    var ex = await getExhibition()
    //console.log(ex)

    

    for(let ii = 0; ii < ex.activematches.length; ii++){
        let ch = await client.channels.fetch(ex.activematches[ii])

        if(!ch){
            continue;
        }

        if(Math.floor(Date.now() / 1000) - Math.floor(ch.createdTimestamp/1000 ) > 7200){
            await ch.delete()
            ex.activematches.splice(ii, 1)
            ii++
        } 
    }

    
    for(let i = 0; i < ex.cooldowns.length; i++){

        let us = await client.users.fetch(ex.cooldowns[i].user)

        if(!ex.cooldowns[i]){
            continue
        }

        if(Math.floor(Date.now() / 1000) - Math.floor(ex.cooldowns[i].time) >= 3600){
            await us.send("You can start another exhibition match!")
            ex.cooldowns.splice(i, 1)
            i++
        }
    }
    await updateExhibition(ex)
}