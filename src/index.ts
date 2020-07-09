import * as Discord from "discord.js";
require("dotenv").config();
import {activematch, qualmatch} from "./misc/struct"
import {submit, qualsubmit} from "./commands/submit"
import { start, running, qualrunning, startqual, startmodqual, splitqual, startregularsplit, splitregular } from "./commands/start";
import { endmatch, qualend } from "./commands/winner";
import { vs } from "./commands/card";
import { getUser, hasthreevotes, emojis, removethreevotes} from "./misc/utils";
import { ModHelp, UserHelp, ModSignupHelp, ModChallongeHelp } from "./commands/help";
import { connectToDB, getQuals, getActive, updateActive, updateQuals, deleteSignup, getMatch, getQual} from "./misc/db";
import { template, approvetemplate } from "./commands/template";
import { createrUser, stats } from "./commands/user";
import { signup, startsignup, closesignup, removesignup, reopensignup, viewsignup } from "./commands/signups";
import { CreateChallongeQualBracket, ChannelCreation, CreateChallongeMatchBracket, matchlistmaker } from "./commands/challonge";
import { verify, test } from "./misc/verify";
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
  //client.user!.setActivity(`Meme Mania Season 0 | !help`);
  client.user!.setActivity(`${process.env.STATUS}`);
  // client.user!.setPresence({ activity: { name: "Testing", type: "CUSTOM_STATUS" }, status: "online" })
  //console.log(await getActive())

});

client.on("guildMemberAdd", async function(member){
  
  await member.roles.add("730650583413030953")

  await member.user?.send("Please start verification with `!verify`.")

  console.log(`a user joins a guild: ${member.user?.username}`);
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

      
      let id = client.channels.cache.get(messageReaction.message.channel.id)?.id

      if(match.channelid === id){

        if(user.id === match.p1.userid || user.id === match.p2.userid){
          if(messageReaction.emoji.name === emojis[1]) {
            //await messageReaction.message.react(emojis[1])
            await messageReaction.users.remove(user.id)
            return await user.send("Can't vote on your own match")
          }
  
          if(messageReaction.emoji.name === emojis[0]) {
            await messageReaction.message.react(emojis[0])
            await messageReaction.users.remove(user.id)
            return await user.send("Can't vote on your own match")
          }
        }
        
        if(!match.p1.voters.includes(user.id) && !match.p2.voters.includes(user.id)){
          if (messageReaction.emoji.name === emojis[1]){
            match.p2.votes += 1
            match.p2.voters.push(user.id)
            await user.send("Vote counted for meme 2") 
            await messageReaction.users.remove(user.id)
            await messageReaction.message.react(emojis[1])
          }
  
          else if (messageReaction.emoji.name === emojis[0]){
            match.p1.votes += 1
            match.p1.voters.push(user.id)
            await user.send("Vote counted for meme 1") 
            await messageReaction.users.remove(user.id)
            await messageReaction.message.react(emojis[1])
          }
        }

        else if(match.p1.voters.includes(user.id)){
          if (messageReaction.emoji.name === emojis[1]){
            match.p2.votes += 1
            match.p2.voters.push(user.id)
            await user.send("Vote counted for meme 2") 
            match.p1.votes -= 1
            match.p1.voters.splice(match.p1.voters.indexOf(user.id), 1)

            await messageReaction.users.remove(user.id)
            await messageReaction.message.react(emojis[1])
          }
  
          else if (messageReaction.emoji.name === emojis[0]){
            await user.send("You can't vote on the same meme twice") 
            await messageReaction.users.remove(user.id)
            await messageReaction.message.react(emojis[0])
          }
        }

        else if(match.p2.voters.includes(user.id)){
          if (messageReaction.emoji.name === emojis[1]){
            await user.send("You can't vote on the same meme twice") 
            await messageReaction.users.remove(user.id)
            await messageReaction.message.react(emojis[1])

          }
  
          else if (messageReaction.emoji.name === emojis[0]){
            match.p1.votes += 1
            match.p1.voters.push(user.id)
            await user.send("Vote counted for meme 1") 
            match.p2.votes -= 1
            match.p2.voters.splice(match.p1.voters.indexOf(user.id), 1)

            await messageReaction.users.remove(user.id)
            await messageReaction.message.react(emojis[0])
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

      let id = client.channels.cache.get(messageReaction.message.channel.id)?.id
      if (match.channelid === id){
        
        if (messageReaction.partial) await messageReaction.fetch();
        if (messageReaction.message.partial) await messageReaction.message.fetch();

        if (emojis.includes(messageReaction.emoji.name)){
          let i = emojis.indexOf(messageReaction.emoji.name)
          console.log(messageReaction.emoji.name, emojis[6])
  
          if(messageReaction.emoji.name === emojis[6]){
            match.votes = removethreevotes(match.votes, user.id)
            await updateQuals(match)
            await messageReaction.users.remove(user.id)
            return user.send("Your votes have been reset")
          }

          if(hasthreevotes(match.votes, user.id)){
            await messageReaction.users.remove(user.id)
            return user.send("You used up all your votes. Please hit the recycle emote to reset your votes")
          }

          if(match.playerids.includes(user.id)){
            await messageReaction.users.remove(user.id)
            return user.send("You can't vote in your own qualifers")
          }
  
          if(!match.playersdone.includes(match.playerids[i])){
            await messageReaction.users.remove(user.id)
            return user.send("You can't for a non meme")
          }
  
          else if(match.votes[i].includes(user.id)){
            await messageReaction.users.remove(user.id)
            return user.send("You can't for a meme twice. Hit the recycle emote to reset your votes")
          }
          else{
            match.votes[i].push(user.id)
            await messageReaction.users.remove(user.id)
            await updateQuals(match)
            return user.send("You vote has been counted.");
          }
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

  if (command === "test"){
    // await message.member?.roles.add("730650583413030953")

    // await message.member?.user?.send("Please start verification with `!verify`.")
  
    // console.log(`a user joins a guild: ${message.member?.user.username}`);

    await test()
  }

  if(command === "verify" || command === "code"){
    await verify(message, client)
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

  else if(command === "checkmatch"){
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    
    if(await getMatch(message.channel.id)){
      message.reply(", there is an active match")
    }

    else if(await getQual(message.channel.id)){
      message.reply(", there is an active qualifier match")
    }

    else{
      message.reply(", there are no matches")
    }

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
    
    await qualend(client, message.channel.id)
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

  else if(command === "signuphelp"){
    await message.channel.send({embed:ModSignupHelp})
  }

  else if(command === "challongehelp"){
    await message.channel.send({embed:ModChallongeHelp})
  }

  else if(command === "signup"){
    await signup(message)
  }

  else if(command === "viewsignup" || command === "viewlist"){
    await viewsignup(message, client)
  }

  else if(command === "startsignup"){
    await startsignup(message, client)
  }

  else if(command === "matchlistmaker"){
    await matchlistmaker()
  }

  else if(command === "createqualiferbracket" || command === "createqualbracket"){
    if (message.member!.roles.cache.has('724818272922501190') 
    || message.member!.roles.cache.has('724832462286356590'))
    await matchlistmaker()
    await CreateChallongeQualBracket(message, client, args)
  }

  else if(command === "createbracket"){
    if (message.member!.roles.cache.has('724818272922501190') 
    || message.member!.roles.cache.has('724832462286356590'))
    await CreateChallongeMatchBracket(message, client, args)
  }

  else if(command === "channelcreate"){
    if (message.member!.roles.cache.has('724818272922501190') 
    || message.member!.roles.cache.has('724832462286356590'))
    await ChannelCreation(message, client, args)
  }
  
  else if (command === "reopensignup"){
    if (message.member!.roles.cache.has('724818272922501190') 
    || message.member!.roles.cache.has('724832462286356590'))
    await reopensignup(message, client)
  }

  else if(command === "closesignup"){
    if (message.member!.roles.cache.has('724818272922501190') 
    || message.member!.roles.cache.has('724832462286356590'))
    await closesignup(message, client)
  }

  else if(command === "signup"){
    await signup(message)
  }

  else if(command === "removesignup"){
    await removesignup(message)
  }

  else if(command === "deletesignup"){
    
    if (message.member!.roles.cache.has('724818272922501190') 
    || message.member!.roles.cache.has('724832462286356590')){
      message.reply(await deleteSignup())
    }

    else{
      message.reply("No.")
    }
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
  
});

client.login(process.env.TOKEN);
