import * as Discord from "discord.js";
require("dotenv").config();
import {activematch, qualmatch} from "./misc/struct"
import {submit, qualsubmit} from "./commands/submit"
import { start, running, qualrunning, startqual, startmodqual, splitqual, startregularsplit, splitregular } from "./commands/start";
import { endmatch, qualend } from "./commands/winner";
import { vs } from "./commands/card";
import { getUser, hasthreevotes, emojis} from "./misc/utils";
import { ModHelp, UserHelp } from "./commands/help";
import { connectToDB, getQuals, getActive, updateActive, updateQuals} from "./misc/db";
import { template, approvetemplate } from "./commands/template";
import { createrUser, stats } from "./commands/user";
//import data from "../match.json"
//const fs = require('fs');
console.log("Hello World, bot has begun life");

// let matches:activematch[] = matchdata
// let qualmatches:qualmatch[] = qualmatchdata
// connectToDB()

// //await insertActive(matches)



const express = require('express');
const app = express();
app.use(express.static('public'));
const http = require('http');
//@ts-ignore
var _server = http.createServer(app);
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

app.get('/', (_request: any, response: any) => {
    response.sendFile(__dirname + "/index.html");
    console.log(Date.now() + " Ping Received");
    response.sendStatus(200);
});


const listener = app.listen(process.env.PORT, () => {
    console.log('Your app is listening on port ' + listener.address().port);
});

client.on('ready', async () => {
  client.user!.setActivity(`Warming up`);
  console.log(`Logged in as ${client.user?.tag}`);
  console.log("OK")
  // for(let i = 0; i < 2; i++) console.log(i)

  await connectToDB()

  let matches:activematch[] = await getActive();
  
  if(matches){
    for(const match of matches){
      if(match.votingperiod){
        let channel = <Discord.TextChannel>client.channels.cache.get(match.channelid)
        
        channel.messages.fetch(match.messageID).then(async msg => {
          if(msg.partial){
            await msg.fetch();
          }
        })
      }
    }
  }

  await running(client)
  await qualrunning(client)
  client.user!.setActivity(`Meme Mania Season 0`);
  // client.user!.setPresence({ activity: { name: "Testing", type: "CUSTOM_STATUS" }, status: "online" })
  //console.log(await getActive())

});



client.on("messageReactionAdd", async function(messageReaction, user){
  console.log(`a reaction is added to a message`);
  //console.log(messageReaction, user)
  if(user.bot) return;
  let matches:activematch[] = await getActive();

  let quals:qualmatch[] = await getQuals()

  // // //await insertQuals(qualmatches)
  // let qualmatches:qualmatch[];

  if(matches){
    for (const match of matches){
      console.log(match.p1.voters)
      console.log(match.p2.voters)
      if (messageReaction.partial) await messageReaction.fetch();
      if (messageReaction.message.partial) await messageReaction.message.fetch();

      if(user.id === match.p1.userid || user.id === match.p2.userid){
        if(messageReaction.emoji.name === "🅱️") {
          //await messageReaction.message.react("🅱️")
          await messageReaction.users.remove(user.id)
          return await user.send("Can't vote on your own match")
        }

        if(messageReaction.emoji.name === "🅰️") {
          await messageReaction.message.react("🅰️")
          await messageReaction.users.remove(user.id)
          return await user.send("Can't vote on your own match")
        }
      }
      
      let id = client.channels.cache.get(messageReaction.message.channel.id)?.id

      if(match.channelid === id){
        
        if(!match.p1.voters.includes(user.id) && !match.p2.voters.includes(user.id)){
          if (messageReaction.emoji.name === "🅱️"){
            match.p2.votes += 1
            match.p2.voters.push(user.id)
            await user.send("Vote counted for meme B") 
            await messageReaction.users.remove(user.id)
            await messageReaction.message.react("🅱️")
          }
  
          else if (messageReaction.emoji.name === "🅰️"){
            match.p1.votes += 1
            match.p1.voters.push(user.id)
            await user.send("Vote counted for meme A") 
            await messageReaction.users.remove(user.id)
            await messageReaction.message.react("🅱️")
          }
        }

        else if(match.p1.voters.includes(user.id)){
          if (messageReaction.emoji.name === "🅱️"){
            match.p2.votes += 1
            match.p2.voters.push(user.id)
            await user.send("Vote counted for meme B") 
            match.p1.votes -= 1
            match.p1.voters.splice(match.p1.voters.indexOf(user.id), 1)

            await messageReaction.users.remove(user.id)
            await messageReaction.message.react("🅱️")
          }
  
          else if (messageReaction.emoji.name === "🅰️"){
            await user.send("You can't vote on the same meme twice") 
            await messageReaction.users.remove(user.id)
            await messageReaction.message.react("🅱️")
          }
        }

        else if(match.p2.voters.includes(user.id)){
          if (messageReaction.emoji.name === "🅱️"){
            await user.send("You can't vote on the same meme twice") 
            await messageReaction.users.remove(user.id)
            await messageReaction.message.react("🅱️")

          }
  
          else if (messageReaction.emoji.name === "🅰️"){
            match.p1.votes += 1
            match.p1.voters.push(user.id)
            await user.send("Vote counted for meme A") 
            match.p2.votes -= 1
            match.p2.voters.splice(match.p1.voters.indexOf(user.id), 1)

            await messageReaction.users.remove(user.id)
            await messageReaction.message.react("🅰️")
          }
        }
        console.log(match.p1.voters)
        console.log(match.p2.voters)
      }
      await updateActive(match)
    }
  }

  if(quals){
    for (const match of quals){
      hasthreevotes(match.votes, user.id)
      if (messageReaction.partial) await messageReaction.fetch();
      if (messageReaction.message.partial) await messageReaction.message.fetch();

      // if(match.playerids.includes(user.id)){
      //   await messageReaction.users.remove(user.id)
      //   return user.send("You can't vote in your own qualifers")
      // }
      
      if (emojis.includes(messageReaction.emoji.name)){
        let i = emojis.indexOf(messageReaction.emoji.name)
        if(match.nonvoteable.includes(i)){
          await messageReaction.users.remove(user.id)
          return user.send("You can't for a non meme")
        }
        else{
          match.votes[i].push(user.id)
          await messageReaction.users.remove(user.id)
          await updateQuals(match)
        }
      }

    }
    
  }

});


client.on("message", async message => {
  //const gamemaster = message.guild.roles.get("719936221572235295");
  
  const prefix = process.env.PREFIX!;
  console.log(await getActive())
  console.log(await getQuals()) 
  

  if (message.content.indexOf(prefix) !== 0 || message.author.bot){
    if(message.author.id !== "688558229646475344") return;
  }

  await running(client)
  await qualrunning(client);
  
  var args: Array<string> = message.content.slice(prefix.length).trim().split(/ +/g);
  
  if (!args || args.length === 0) {
    return
  };
  
  const command: string | undefined = args?.shift()?.toLowerCase();
  
  if (!command){
    return
  };
  
  if (command === "ping") {
    const m: Discord.Message = await message.channel.send("Ping?") as Discord.Message;
    await m.edit(`Latency is ${m.createdTimestamp - message.createdTimestamp}ms. Discord API Latency is ${Math.round(client.ws.ping)}ms`);
  }

  else if(command === "submit"){
    await submit(message, client)
  }

  else if(command === "qualsubmit"){
    await qualsubmit(message, client)
  }

  else if(command === "submittemplate" || command === "template"){
    await template(message, client)
  }

  else if(command === "start"){
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    await start(message, client)
  }

  else if (command === "startqual"){
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    await startqual(message, client)
  }

  else if (command === "startmodqual" || command === "splitqual"){
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    await startmodqual(message, client)
  }

  else if (command === "startmodmatch" || command === "splitmatch"){
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    await startregularsplit(message, client)
  }

  else if(command === "approve"){
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    await approvetemplate(message, client)
  }

  else if (command === "create"){
    await createrUser(message)
  }

  else if (command === "stats"){
    await stats(message, client)
  }

  else if (command === "startsplitqual"){
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    await splitqual(client, message)
  }

  else if(command === "startsplit"){
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    await splitregular(message, client)
  }

  else if(command === "qualend"){
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    await qualend(client, message)
  }

  else if(command === "end"){
    // if (message.author.id !== "239516219445608449"){
    //   return
    // }
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    await endmatch(message, client)
  }

  else if(command === "modhelp"){
    await message.channel.send({embed:ModHelp})
  }

  else if(command === "help"){
    await message.channel.send({embed:UserHelp})
  }

  else if(command === "vs"){
    let users: Array<string> = []
    
    for (let i = 0; i < args.length; i++){
        let userid = await getUser(args[i])
        if (userid){
            users.push(userid)
        }
    }
    await vs(message, client, users)
  }
  // matches = await getActive()

  // qualmatches = await getQuals()
  
});

client.login(process.env.TOKEN);




// let data = JSON.stringify(matches, null, 2);
// let data2 = JSON.stringify(qualmatches, null, 2);

// await fs.writeFile('./match.json', data, (err: any) => {
//     if (err) throw err;
//     console.log('Data written to file');
// });

// await fs.writeFile('./qualmatch.json', data2, (err: any) => {
//   if (err) throw err;
//   console.log('Data written to file');
// });


// let data = fs.readFileSync('./match.json');
// let matchdata = JSON.parse(data);

// let data2 = fs.readFileSync('./qualmatch.json');
// let qualmatchdata = JSON.parse(data2);