import * as Discord from "discord.js";
require("dotenv").config();
import {activematch} from "./misc/struct"
import {submit, qualsubmit} from "./commands/submit"
import { start, running, qualrunning, startqual, startmodqual, splitqual } from "./commands/start";
import { endmatch, qualend } from "./commands/winner";
import { vs } from "./commands/card";
import { getUser } from "./misc/utils";
import { ModHelp, UserHelp } from "./commands/help";
import { connectToDB, getQuals, getActive, updateActive} from "./misc/db";
import { template } from "./commands/template";
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
const client = new Discord.Client();

app.get('/', (_request: any, response: any) => {
    response.sendFile(__dirname + "/index.html");
    console.log(Date.now() + " Ping Received");
    response.sendStatus(200);
});


const listener = app.listen(process.env.PORT, () => {
    console.log('Your app is listening on port ' + listener.address().port);
});

client.on('ready', async () => {
  console.log(`Logged in as ${client.user?.tag}`);
  console.log("OK")
  // for(let i = 0; i < 2; i++) console.log(i)

  await connectToDB()

  await running(client)
  await qualrunning(client)

  //console.log(await getActive())

});



client.on("messageReactionAdd", async function(messageReaction, user){
  console.log(`a reaction is added to a message`);
  //console.log(messageReaction, user)
  if(user.bot) return;
  let matches:activematch[] = await getActive();

  // // //await insertQuals(qualmatches)
  // let qualmatches:qualmatch[];

  if(matches){
    for (const match of matches){
      console.log(match.p1.voters)
      console.log(match.p2.voters)
      if(user.id === match.p1.userid || user.id === match.p2.userid){
        if(messageReaction.emoji.name === "🅱️" || messageReaction.emoji.name === "🅰️") {
        await messageReaction.remove(user.id)
        return await user.send("Can't vote on your own match")
        }
      }
      
      let id = client.channels.get(messageReaction.message.channel.id)?.id

      if(match.channelid === id){
        
        if(!match.p1.voters.includes(user.id) && !match.p2.voters.includes(user.id)){
          if (messageReaction.emoji.name === "🅱️"){
            match.p2.votes += 1
            match.p2.voters.push(user.id)
            await user.send("Vote counted for meme B") 
            await messageReaction.remove(user.id)
            await messageReaction.message.react("🅱️")
          }
  
          else if (messageReaction.emoji.name === "🅰️"){
            match.p1.votes += 1
            match.p1.voters.push(user.id)
            await user.send("Vote counted for meme A") 
            await messageReaction.remove(user.id)
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

            await messageReaction.remove(user.id)
            await messageReaction.message.react("🅱️")
          }
  
          else if (messageReaction.emoji.name === "🅰️"){
            await user.send("You can't vote on the same meme twice") 
            await messageReaction.remove(user.id)
            await messageReaction.message.react("🅱️")
          }
        }

        else if(match.p2.voters.includes(user.id)){
          if (messageReaction.emoji.name === "🅱️"){
            await user.send("You can't vote on the same meme twice") 
            await messageReaction.remove(user.id)
            await messageReaction.message.react("🅱️")

          }
  
          else if (messageReaction.emoji.name === "🅰️"){
            match.p1.votes += 1
            match.p1.voters.push(user.id)
            await user.send("Vote counted for meme A") 
            match.p2.votes -= 1
            match.p2.voters.splice(match.p1.voters.indexOf(user.id), 1)

            await messageReaction.remove(user.id)
            await messageReaction.message.react("🅰️")
          }
        }
        console.log(match.p1.voters)
        console.log(match.p2.voters)
      }
      await updateActive(match)
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
    if (!message.member.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    await start(message, client)
  }

  else if (command === "startqual"){
    await startqual(message, client)
  }

  else if (command === "startmodqual"){
    await startmodqual(message)
  }

  else if (command === "startsplit"){
    await splitqual(client, message)
  }

  else if(command === "qualend"){
    if (!message.member.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    await qualend(client, message)
  }

  else if(command === "end"){
    // if (message.author.id !== "239516219445608449"){
    //   return
    // }
    if (message.member.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
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



