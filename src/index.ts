import * as Discord from "discord.js";
require("dotenv").config();

import {
  activematch,
  cockratingInterface,
  configDB,
  randomtempstruct
} from "./misc/struct";
import { submit, qualsubmit } from "./commands/submit";
import {
  start,
  running,
  qualrunning,
  startqual,
  startmodqual,
  splitqual,
  startregularsplit,
  splitregular,
  reload,
  matchstats,
  qualstats,
} from "./commands/start";
import { duelcheck, exhibition } from "./commands/exhibitions"
import { qualend, end, cancelmatch } from "./commands/winner";
import { vs } from "./commands/card";
import { getUser, hasthreevotes, emojis, removethreevotes, reminders, deletechannels, createrole, clearstats, qualifierresultadd, autoreminders, SeasonRestart } from "./misc/utils";
import { ModHelp, UserHelp, ModSignupHelp, ModChallongeHelp, DuelHelp } from "./commands/help";

import {
  connectToDB,
  getActive,
  updateActive,
  updateQuals,
  deleteSignup,
  getMatch,
  getQual,
  getCockrating,
  insertCockrating,
  updateCockrating,
  updateModProfile,
  getalltempStructs,
  updatetempStruct,
  gettemplatedb,
  updatetemplatedb,
  getQuals,
  getConfig,
  updateConfig,
} from "./misc/db";

import { template, approvetemplate, addTheme, removeTheme, themelistLb, templatecheck } from "./commands/template";
import { createrUser, stats } from "./commands/user";
import {
  signup,
  startsignup,
  closesignup,
  removesignup,
  reopensignup,
  activeOffers,
  matchlistEmbed,
} from "./commands/signups";
import {
  CreateChallongeQualBracket,
  ChannelCreation,
  CreateChallongeMatchBracket,
  matchlistmaker,
  CreateQualGroups,
  declarequalwinner,
  GroupSearch,
  removequalwinner,
  QualChannelCreation,
} from "./commands/challonge";
import { manuallyverify, verify } from "./misc/verify";
import { cockratingLB, winningLB, quallistGroups } from "./misc/lbs";
import { createmodprofile, viewmodprofile, modLB, clearmodstats } from "./misc/modprofiles";
import { getRandomThemeList } from "./misc/randomtemp";


console.log("Hello World, bot has begun life");




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
  await connectToDB()
  client.user!.setActivity(`Warming up`);
  console.log(`Logged in as ${client.user?.tag}`);
  console.log("OK")
  // for(let i = 0; i < 2; i++) console.log(i)



  let matches: activematch[] = await getActive();

  if (matches) {
    for (const match of matches) {
      if (match.votingperiod) {
        let channel = <Discord.TextChannel>client.channels.cache.get(match.channelid)

        channel.messages.fetch(match.messageID).then(async msg => {
          if (msg.partial) {
            await msg.fetch();
          }
        })
      }
    }
  }

  setInterval(async function () {
    // console.log("A Kiss every 5 seconds");
    await running(client)
  }, 15000);

  setInterval(async function () {
    // console.log("A Second Kiss every 5 seconds");
    await qualrunning(client)
  }, 15000);

  setInterval(async function () {
    // console.log("A Third Kiss every 5 seconds");
    await autoreminders(client)
  }, 1000);

  //await autoreminders(client)

  //await running(client)
  //await qualrunning(client)
  await (<Discord.TextChannel>client.channels.cache.get("722616679280148504")).send("<@239516219445608449>", {
    embed: {
      description: `Updates/Restart has worked`,
      color: "#d7be26",
      timestamp: new Date()
    }
  });
  client.user!.setActivity(`${process.env.STATUS}`);
});

client.on("guildMemberAdd", async function (member) {

  await member.roles.add("730650583413030953")

  await member.user?.send("Please start verification with `!verify <reddit username>` in the verification channel.")

  console.log(`a user joins a guild: ${member.user?.username}`);
});

client.on("messageReactionAdd", async function (messageReaction, user) {
  //console.log(messageReaction.message.member!.roles.cache.has('719936221572235295'))
  if (user.bot) return;

  // if(messageReaction.emoji.name === '🤏' && user.id !== "722303830368190485") {
  //   await messageReaction.users.remove(user.id)
  //   await messageReaction.message.react('🌀')
  //   let m = await messageReaction.message
  //   await m.edit("yes")
  // }

  let temps: randomtempstruct[] = await getalltempStructs()

  if (temps) {

    for (const temp of temps) {
      //console.log(temp)

      if (messageReaction.emoji.name === '🌀' && user.id !== "722303830368190485") {

        if (temp.istheme === false) {
          let templatelist = await (await gettemplatedb()).list
          let random: string = templatelist[Math.floor(Math.random() * templatelist.length)];

          let embed = new Discord.MessageEmbed()
            .setDescription("Random template")
            .setImage(random)
            .setColor("#d7be26")
            .setTimestamp()
          console.log(await messageReaction.message.id)

          temp.url = random
          //temp.time = temp.time - (110 * 1000) 

          //await messageReaction.message.edit({embed})
          await (await (<Discord.TextChannel>client.channels.cache.get("722616679280148504"))
            .messages.fetch(temp.messageid))
            .edit({ embed })
          await updatetempStruct(temp._id, temp)
          await messageReaction.users.remove(user.id)
        }

        if (temp.istheme === true) {

          let themelist = await getRandomThemeList(client)
          let random: string = themelist[Math.floor(Math.random() * (((themelist.length - 1) - 1) - 1) + 1)];

          let embed = new Discord.MessageEmbed()
            .setTitle("Random Theme")
            .setDescription(`Theme is: ${random}`)
            .setColor("#d7be26")
            .setTimestamp()
          console.log(await messageReaction.message.id)

          temp.url = random
          //temp.time = temp.time - (110 * 1000) 

          await (await (<Discord.TextChannel>client.channels.cache.get("722616679280148504"))
            .messages.fetch(temp.messageid))
            .edit({ embed })
          await updatetempStruct(temp._id, temp)
          await messageReaction.users.remove(user.id)
        }


      }

      if (messageReaction.emoji.name === '✅' && user.id !== "722303830368190485") {
        temp.found = true
        await updatetempStruct(temp._id, temp).then(async () => {
          await messageReaction.message.delete()
        })
      }

      else if (messageReaction.emoji.name === '❌' && user.id !== "722303830368190485") {
        temp.time = 121
        await updatetempStruct(temp._id, temp).then(async () => {
          await messageReaction.message.delete()
        })

      }
    }
  }

  if (messageReaction.emoji.name === '🅰️' || messageReaction.emoji.name === '🅱️' && user.id !== "722303830368190485") {
    //messageReaction.message.channel.send(user.client.guilds.cache.get(messageReaction.message.guild!.id)!.roles.cache.has("719936221572235295"))

    if (messageReaction.partial) await messageReaction.fetch();
    if (messageReaction.message.partial) await messageReaction.message.fetch();

    if (user.client.guilds.cache
      .get(messageReaction.message.guild!.id)!
      .members.cache.get(user.id)!
      .roles.cache.has("719936221572235295")
      === true) {

      if (messageReaction.emoji.name === '🅰️') {

        let id = await (await getMatch(messageReaction.message.channel.id)).p1.userid
        await splitregular(messageReaction.message, client, id)
        await updateModProfile(messageReaction.message.author.id, "modactions", 1)
        await updateModProfile(messageReaction.message.author.id, "matchportionsstarted", 1)
        await messageReaction.users.remove(user.id)

      }

      else if (messageReaction.emoji.name === '🅱️') {

        let id = await (await getMatch(messageReaction.message.channel.id)).p2.userid
        await splitregular(messageReaction.message, client, id)
        await updateModProfile(messageReaction.message.author.id, "modactions", 1)
        await updateModProfile(messageReaction.message.author.id, "matchportionsstarted", 1)
        await messageReaction.users.remove(user.id)

      }
    }

    else {
      await messageReaction.users.remove(user.id)
      await user.send("No.")
    }


  }

  if (messageReaction.emoji.name === '🏁' || messageReaction.emoji.name === '🗡️' && user.id !== "722303830368190485") {
    //messageReaction.message.channel.send(user.client.guilds.cache.get(messageReaction.message.guild!.id)!.roles.cache.has("719936221572235295"))
    if (messageReaction.message.channel.id !== "722291683030466621") return;
    if (messageReaction.partial) await messageReaction.fetch();
    if (messageReaction.message.partial) await messageReaction.message.fetch();

    if (user.client.guilds.cache
      .get(messageReaction.message.guild!.id)!
      .members.cache.get(user.id)!
      .roles.cache.has("719936221572235295")
      === true) {

      //let tempccc = <Discord.TextChannel>client.channels.cache.get("724827952390340648")
      if (messageReaction.emoji.name === '🏁') {
        let voteCollection: Discord.Collection<string, Discord.MessageReaction>;

        await messageReaction.message.channel.messages.fetch(messageReaction.message.id).then(msg => voteCollection = msg.reactions.cache);

        let l = voteCollection!.first()!.count!
        console.log(l)
        console.log(messageReaction.message.embeds[0].image)

        if (l === 3) {
          //await tempccc.send(await messageReaction.message.embeds[0].image?.url)

          let e = await gettemplatedb()

          e.list.push(await messageReaction.message.embeds[0].image!.url)

          await updatetemplatedb(e.list)
          await messageReaction.message.delete()
        }

      }

      else if (messageReaction.emoji.name === '🗡️') {
        let voteCollection: Discord.Collection<string, Discord.MessageReaction>;

        await messageReaction.message.channel.messages.fetch(messageReaction.message.id).then(msg => voteCollection = msg.reactions.cache);

        let l = voteCollection!.array()[1]!.count!
        console.log(l)
        console.log(messageReaction.message.embeds[0].image)

        if (l === 3) {
          //await tempccc.send(await messageReaction.message.embeds[0].image?.url)
          await messageReaction.message.delete()
        }

      }
    }

    else {
      await messageReaction.users.remove(user.id)
      await user.send("No.")
    }


  }

  if (['🇦', '🇧', '🇨', '🇩', '🇪', '🇫'].includes(messageReaction.emoji.name) && user.id !== "722303830368190485") {
    //messageReaction.message.channel.send(user.client.guilds.cache.get(messageReaction.message.guild!.id)!.roles.cache.has("719936221572235295"))

    if (messageReaction.partial) await messageReaction.fetch();
    if (messageReaction.message.partial) await messageReaction.message.fetch();

    if (user.client.guilds.cache
      .get(messageReaction.message.guild!.id)!
      .members.cache.get(user.id)!
      .roles.cache.has("719936221572235295")
      === true) {


      let pos = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫'].indexOf(messageReaction.emoji.name)
      let id = await (await getQual(messageReaction.message.channel.id)).playerids[pos]
      await updateModProfile(messageReaction.message.author.id, "modactions", 1)
      await updateModProfile(messageReaction.message.author.id, "matchportionsstarted", 1)
      await splitqual(client, messageReaction.message, id)
      await messageReaction.users.remove(user.id)
      await messageReaction.remove()


    }

    else {
      await messageReaction.users.remove(user.id)
      await user.send("No.")
    }
  }

  if (!emojis.includes(messageReaction.emoji.name)) return;

  console.log(`a reaction is added to a message`);
  //console.log(messageReaction, user)
  // let quals: qualmatch[] = await getQuals()




  if ((messageReaction.emoji.name === emojis[1] || messageReaction.emoji.name === emojis[0])
    && await getMatch(messageReaction.message.channel.id)) {
    let match = await getMatch(messageReaction.message.channel.id)

    if (messageReaction.partial) await messageReaction.fetch();
    if (messageReaction.message.partial) await messageReaction.message.fetch();
    if (!match) return;

    if (user.id !== match.p1.userid && user.id !== match.p2.userid) { // != match.p1.userid || user.id != match.p2.userid
      console.log("checkq1")
      if (messageReaction.emoji.name === emojis[0]) {
        console.log("checkq2")
        if (match.p1.voters.includes(user.id)) {
          await user.send("You can't vote on the same meme twice")
          await messageReaction.users.remove(user.id)
          await messageReaction.message.react(emojis[0])
        }

        else {
          match.p1.votes += 1
          match.p1.voters.push(user.id)

          if (match.p2.voters.includes(user.id)) {
            match.p2.votes -= 1
            match.p2.voters.splice(match.p2.voters.indexOf(user.id), 1)
          }
          await messageReaction.users.remove(user.id)
          await messageReaction.message.react(emojis[0])
          if (!match.exhibition) {
            await user.send(`Vote counted for Player 1's memes in <#${match.channelid}>. You gained 2 points for voting`)
          }

          else {
            await user.send(`Vote counted for Player 1's memes in <#${match.channelid}>.`)
          }
          console.log("checkq3")

        }
      }

      else if (messageReaction.emoji.name === emojis[1]) {
        console.log("checkq4")

        if (match.p2.voters.includes(user.id)) {
          await user.send("You can't vote on the same meme twice")
          await messageReaction.users.remove(user.id)
          await messageReaction.message.react(emojis[1])
        }

        else {
          match.p2.votes += 1
          match.p2.voters.push(user.id)


          if (match.p1.voters.includes(user.id)) {
            match.p1.votes -= 1
            match.p1.voters.splice(match.p1.voters.indexOf(user.id), 1)
          }
          await messageReaction.users.remove(user.id)
          await messageReaction.message.react(emojis[1])
          if (!match.exhibition) {
            await user.send(`Vote counted for Player 2's memes in <#${match.channelid}>. You gained 2 points for voting`)
          }

          else {
            await user.send(`Vote counted for Player 2's memes in <#${match.channelid}>.`)
          }
          console.log("checkq5")
        }
      }

      await updateActive(match)
    }

    else {
      await messageReaction.users.remove(user.id)
      await user.send("Can't vote on your own match")
    }
  }

  //removethreevotes() now only checks if it's 2 votes or less
  if (emojis.includes(messageReaction.emoji.name) && await getQual(messageReaction.message.channel.id)) {
    let match = await getQual(messageReaction.message.channel.id)

    if (!match) return;

    if (messageReaction.partial) await messageReaction.fetch();
    if (messageReaction.message.partial) await messageReaction.message.fetch();

    if (match.votingperiod === false) return;

    if (match.playerids.includes(user.id)) {
      await messageReaction.users.remove(user.id)
      return user.send("You can't vote in your own qualifers")
    }

    if (messageReaction.emoji.name === emojis[6]) {
      match.votes = removethreevotes(match.votes, user.id)
      await updateQuals(match)
      messageReaction.users.remove(user.id)
      return user.send("Your votes have been reset")
    }

    else {
      let i = emojis.indexOf(messageReaction.emoji.name)

      if (hasthreevotes(match.votes, user.id)) {
        await messageReaction.users.remove(user.id)
        return user.send("You used up all your votes. Please hit the recycle emote to reset your votes")
      }

      if (!match.playersdone.includes(match.playerids[i])) {
        await messageReaction.users.remove(user.id)
        return user.send("You can't for a non meme")
      }

      else if (match.votes[i].includes(user.id)) {
        await messageReaction.users.remove(user.id)
        return user.send("You can't for a meme twice. Hit the recycle emote to reset your votes")
      }

      else {
        match.votes[i].push(user.id)
        await messageReaction.users.remove(user.id)
        await updateQuals(match)
        return user.send(`Your vote for meme ${i + 1} in <#${match.channelid}> been counted. You gained 2 points for voting`);
      }
    }
  }


});

client.on("message", async message => {
  //const gamemaster = message.guild.roles.get("719936221572235295");


  // if(message.content.includes("!speedrun")){
  //   await qualrunning(client);
  //   await running(client);
  //   console.log("Ran!")
  // }

  if (message.content.indexOf(process.env.PREFIX!) !== 0 || message.author.bot) {
    if (message.author.id !== "688558229646475344") return;
  }

  var args: Array<string> = message.content.slice(process.env.PREFIX!.length).trim().split(/ +/g);

  if (!args || args.length === 0) {
    return
  };



  const command: string | undefined = args?.shift()?.toLowerCase();

  if (!command) {
    return
  };

  //await message.channel.startTyping(100)

  // if(command === "s"){
  //   await qualrunning(client);
  //   await running(client);
  // }

  if (command === "!speedrun") {
    await qualrunning(client);
    await running(client);
    console.log("Ran!")
  }

  if (command === "forcepoll") {

    let match = await getMatch(message.channel.id)

    if (Math.floor(Math.random() * (5 - 1) + 1) % 2 === 1) {
      let temp = match.p1

      match.p1 = match.p2

      match.p2 = temp
    }
    match.p1.time = (Math.floor(Date.now() / 1000)) - 2800
    match.p2.time = (Math.floor(Date.now() / 1000)) - 2800
    match.votingperiod = true
    match.votetime = (Math.floor(Date.now() / 1000))

    await updateActive(match)

    await reload(message, client)

  }

  else if (command === "ping") {
    const m: Discord.Message = await message.channel.send("Ping?") as Discord.Message;
    await m.edit(`Latency is ${m.createdTimestamp - message.createdTimestamp}ms. Discord API Latency is ${Math.round(client.ws.ping)}ms`);
  }

  else if(command === "templatecheck"){
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("only selected users can use this command. If any problem occured, DM <@239516219445608449>.");
    await templatecheck(message, client, args)
  }

  else if (command === "updatemessage" || command === "upmsg") {
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("only selected users can use this command. If any problem occured, DM <@239516219445608449>.");

    let c = await getConfig()

    c.upmsg = args.join(" ")
    await updateConfig(c)

    message.reply(`Added update message of ${args.join(" ")}`);
  }

  else if (command === "announce") {
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("only selected users can use this command. If any problem occured, DM <@393137628083388430>.");
    let c: configDB = await getConfig(), output = c.upmsg
    let channel = <Discord.TextChannel>client.channels.cache.get("722284266108747880"); //Change this to the announcement channel id

    if (["everyone", "e", "Everyone", "E"].includes(args[0])) channel.send(`@everyone ${output}`);

    else if (["help", "h", "Help", "H"].includes(args[0])) message.reply("Please either `.announce everyone` to ping everyone or `.announce` to not ping everyone");

    else channel.send(output);
  }

  else if (command === "say") {
    const sayMessage = args.join(" ");
    if (sayMessage.match(/@everyone/) && !message!.member!.permissions.has(['MANAGE_MESSAGES'])) {
      await message.channel.send(`-mute <@${message.author.id}>`)
      return message.reply("YOU DARE PING EVERYONE!");
    }
    message.delete().catch(console.log);
    message.channel.send(sayMessage);
  }

  else if (command === "purge" || command === "clear") {

    return message.reply("Feature no longer in use")


    // if (!message!.member!.permissions.has(['MANAGE_MESSAGES'], true)) {
    //   return message.reply("you don't have those premissions")
    // }

    // console.log(args)

    // const amount = parseInt(args[0])

    // const user = message.mentions.users.first();

    // if (!amount || amount < 1 || amount > 100) return message.reply("Please give a number between 1 to 100");


    // await message.channel.messages.fetch({
    //   limit: amount
    // })
    //   .then(async (messages) => {
    //     if (user) {
    //       const filterBy = user;
    //       let deletemessages = messages.filter(m => m.author.id === filterBy.id).array().slice(0, amount);
    //       //console.log(deletemessages)
    //       await message.channel.bulkDelete(deletemessages).catch(error => console.log(error.stack));
    //     }

    //     else {
    //       await message.channel.bulkDelete(messages).catch(error => console.log(error.stack));
    //     }

    //   })

    // message.channel.bulkDelete(fetched)
    //   .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));

  }

  else if (command === "reminder") {
    await reminders(client, args)
  }

  else if (command === "createrole") {
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    await createrole(message, args)
  }

  else if (command === "deletechannels") {
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    await deletechannels(message, args)
  }

  else if (command === "test") {
    await message.reply("no").then(async message => { await message.react('🤏') })

    console.log(args)
    await message.member?.setNickname(args[0])
  }

  else if (command === "createqualgroup") {
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    if (message.channel.id === "722285800225505879" || message.channel.id === "722285842705547305" || message.channel.id === "724839353129369681") return;

    await CreateQualGroups(message, args)
  }

  else if (command === "viewgroups") {
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    if (message.channel.id === "722285800225505879" || message.channel.id === "722285842705547305" || message.channel.id === "724839353129369681") return;

    // if (!args) return await quallistEmbed(message, client, args)

    message.channel.send({ embed: await quallistGroups(message, client, args) })
  }

  else if (command === "search") {
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    await GroupSearch(message, args)
  }

  else if (command === "qrd") {
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    await qualifierresultadd(await (<Discord.TextChannel>client.channels.cache.get(message.channel.id)), client, args[0], args[1])
  }

  else if (command === "exhibition" || command === "duel") {
    //if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")

    if (args[0].toLowerCase() === "help") {
      await message.channel.send({ embed: DuelHelp })
    }

    else if (args[0].toLowerCase() === "check") {
      await duelcheck(message)
    }

    else {
      await exhibition(message, client, args)
    }

  }

  else if (command === "dqw" || command === "declarequalwinner") {
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")

    await declarequalwinner(message, client)
  }

  else if (command === "removequalwinner") {
    await removequalwinner(message, client)
  }

  if (command === "verify" || command === "code") {
    await verify(message, client)
  }

  if (command === "manualverify"){
    if (!message.member!.roles.cache.has('724818272922501190')) return message.reply("You don't have those premissions")
    await manuallyverify(message, client, args)
  }

  else if (command === "submit") {
    if (message.channel.id === "722285800225505879" || message.channel.id === "722285842705547305" || message.channel.id === "724839353129369681") return;
    await submit(message, client)
  }

  else if (command === "qualsubmit") {
    if (message.channel.id === "722285800225505879" || message.channel.id === "722285842705547305" || message.channel.id === "724839353129369681") return;
    await qualsubmit(message, client)
  }

  else if (command === "submittemplate" || command === "template") {
    await template(message, client)
  }

  else if (command === "start") {
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    await start(message, client)
    await updateModProfile(message.author.id, "modactions", 1)
    await updateModProfile(message.author.id, "matchesstarted", 1)
  }

  else if (command === "forefeit") {
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    await message.reply("Not ready")
    //await forfeit(message, client)
  }

  else if (command === "checkmatch") {
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")

    if (await getMatch(message.channel.id)) {
      message.reply("there is an active match")
    }

    else if (await getQual(message.channel.id)) {
      message.reply("there is an active qualifier match")
    }

    else {
      message.reply("there are no matches")
    }
  }

  else if (command === "startqual") {
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    await startqual(message, client)
    await updateModProfile(message.author.id, "modactions", 1)
    await updateModProfile(message.author.id, "matchesstarted", 1)
  }

  else if (command === "startmodqual" || command === "splitqual") {
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    await startmodqual(message, client)
    await updateModProfile(message.author.id, "modactions", 1)
    await updateModProfile(message.author.id, "matchesstarted", 1)
  }

  else if (command === "startmodmatch" || command === "splitmatch" || command === "split") {
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    await startregularsplit(message, client)
    await updateModProfile(message.author.id, "modactions", 1)
    await updateModProfile(message.author.id, "matchesstarted", 1)
  }

  else if (command === "settheme" || command === "themeset") {
    //let id = message.mentions.channels.first()!.id
    if (!message.mentions.channels.first()) return message.reply("please, state the channel for the qualifier")

    if (!args[1]) return message.reply("please enter a theme")

    let match = await getQual(message.mentions.channels.first()!.id)

    match.template = args.slice(1).join(" ")

    await (<Discord.TextChannel>client.channels.cache.get("738047732312309870"))
      .send(`<#${match.channelid}> theme is ${args.slice(1).join(" ")}`);

    match.istheme = true

    await updateQuals(match)

    await message.reply("Theme has been set!")

  }

  else if (command === "addtheme") {
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    await addTheme(message, client, args)
  }

  else if (command === "deletetheme") {
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    await removeTheme(message, client, args)
  }

  else if (command === "themelist") {
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    await themelistLb(message, client, args)
  }

  else if (command === "approve") {
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    if (message.channel.id === "722285800225505879" || message.channel.id === "722285842705547305" || message.channel.id === "724839353129369681") return;

    await approvetemplate(message, client)
    await updateModProfile(message.author.id, "modactions", 1)
  }

  else if (command === "create") {
    await createrUser(message)
  }

  else if (command === "modcreate") {
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    await createmodprofile(message)
  }

  else if (command === "modstats") {
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    await viewmodprofile(message, client, args)
  }

  else if (command === "modlb") {
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    await modLB(message, client, args)
  }

  else if (command === "resetmodprofiles") {
    if (message.author.id !== "239516219445608449") return message.reply("You don't have those premissions")
    await clearmodstats(message)
  }

  else if (command === "cr" || command === "cockrating") {

    if (!message.member!.roles.cache.has('719936221572235295')) {
      return message.reply("You are not cock rating master.")
    }

    else {
      let id = (message.mentions?.users?.first()?.id || message.author.id)
      let form = await getCockrating(id)
      let max = 100
      let min = (id === "239516219445608449" ? Math.floor(Math.random() * ((max - 35) - 35) + 1) : Math.floor(Math.random() * ((max - 1) - 1) + 1))

      if (!form) {
        message.reply(`<@${id}> has ${max === min ? `100% good cock` : `${min}/${max} cock.`}`)



        let newform: cockratingInterface = {
          _id: id,
          num: min,
          time: Math.floor(Date.now() / 1000)
        }

        await insertCockrating(newform)
      }

      if (Math.floor(Date.now() / 1000) - form.time < 259200) {
        return message.reply("It has not been 3 days")
      }

      else {
        message.reply(`<@${id}> has ${max === min ? `100% good cock` : `${min}/${max} cock. The previous rating was ${form.num}/${max} cock`}`)

        form.num = min
        form.time = Math.floor(Date.now() / 1000)
        await updateCockrating(form)
      }
    }
  }

  else if (command === "mr" || command === "manualrating" || command === "powercock") {

    if (!message.member!.roles.cache.has('719936221572235295')) {
      return message.reply("You are not cock rating master.")
    }

    else {
      let id = (message.mentions?.users?.first()?.id || message.author.id)
      let form = await getCockrating(id)
      let max = 100
      let min = parseInt(args[1] || args[0])

      if (!form) {
        message.reply(`<@${id}> has ${max === min ? `100% good cock` : `${min}/${max} cock.`}`)



        let newform: cockratingInterface = {
          _id: id,
          num: min,
          time: Math.floor(Date.now() / 1000)
        }

        await insertCockrating(newform)
      }

      else {
        message.reply(`<@${id}> has ${max === min ? `100% good cock` : `${min}/${max} cock. The previous rating was ${form.num}/${max} cock`}`)

        form.num = min
        await updateCockrating(form)
      }
    }
  }

  else if (command === "crlb") {
    await cockratingLB(message, client, args)
  }

  else if (command === "lb") {
    await winningLB(message, client, args)
  }

  else if (command === "clearstats") {
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    await clearstats(message)
  }

  else if (command === "stats") {
    await stats(message, client)
  }

  else if (command === "startsplitqual" || command === "ssq") {
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    await splitqual(client, message)
    await updateModProfile(message.author.id, "modactions", 1)
    await updateModProfile(message.author.id, "matchportionsstarted", 1)
  }

  else if (command === "matchstats") {
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    await matchstats(message, client)
  }

  else if (command === "qualstats") {
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    await qualstats(message, client)
  }

  else if (command === "startsplit") {
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    await splitregular(message, client)
    await updateModProfile(message.author.id, "modactions", 1)
    await updateModProfile(message.author.id, "matchportionsstarted", 1)
  }

  else if (command === "reload") {
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    await reload(message, client)
  }

  else if (command === "qualend") {
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")

    await qualend(client, message.channel.id)
  }

  else if (command === "end") {
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    await end(client, message.channel.id)
  }

  else if (command === "cancel") {
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    await cancelmatch(message)
  }

  else if (command === "modhelp") {
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    await message.channel.send({ embed: ModHelp })
  }

  else if (command === "help") {
    await message.channel.send({ embed: UserHelp })
  }

  else if (command === "signuphelp") {
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    await message.channel.send({ embed: ModSignupHelp })
  }

  else if(command === "seasonrestart"){
    if (message.author.id !== "239516219445608449") return message.reply("You don't have those premissions")
    await SeasonRestart(message)
  }

  else if (command === "challongehelp") {
    if (!message.member!.roles.cache.has('719936221572235295')) return message.reply("You don't have those premissions")
    await message.channel.send({ embed: ModChallongeHelp })
  }

  else if (command === "pullout" || command === "goingformilk" || command === "unsignup" || command === "withdraw" || command === "removesignup") {
    await removesignup(message)
  }

  else if (command === "viewsignup" || command === "viewlist") {
    //await viewsignup(message, client)
    await activeOffers(message, client, args)
    //matchlistEmbed
  }

  else if (command === "allmatches") {
    if (!message.member!.roles.cache.has('724818272922501190')) return message.reply("You don't have those premissions")
    let a = await getActive()

    if (a) {
      for (let i = 0; i < a.length; i++) {
        await message.channel.send(`${a[i].channelid} ---> <#${a[i].channelid}>`)
      }

    }

    let aa = await getQuals()

    if (aa) {
      for (let i = 0; i < aa.length; i++) {
        await message.channel.send(`${aa[i].channelid}`)
      }
    }


  }

  else if (command === "viewmatchlist" || command === "matchlist") {
    //await viewsignup(message, client)
    await matchlistEmbed(message, client)

  }

  else if (command === "startsignup") {
    await startsignup(message, client)
  }

  else if (command === "matchlistmaker") {
    if (message.channel.id === "722285800225505879" || message.channel.id === "722285842705547305" || message.channel.id === "724839353129369681") return;
    await matchlistmaker()
  }

  else if (command === "createqualiferbracket" || command === "createqualbracket") {
    if (message.member!.roles.cache.has('724818272922501190')
      || message.member!.roles.cache.has('724832462286356590'))
      await matchlistmaker()
    await CreateChallongeQualBracket(message, client, args)
  }

  else if (command === "createbracket") {
    if (message.member!.roles.cache.has('724818272922501190')
      || message.member!.roles.cache.has('724832462286356590'))
      await CreateChallongeMatchBracket(message, client, args, (await client.guilds.cache.get("719406444109103117")!))
  }

  else if (command === "channelcreate") {
    if (message.member!.roles.cache.has('724818272922501190')
      || message.member!.roles.cache.has('724832462286356590'))
      await ChannelCreation(message, client, args)
  }

  else if (command === "qualchannelcreate") {
    await QualChannelCreation(message, args)
  }

  //CqtzrpLVF0GOnJXcFwLwyLbYoAwSQ1jH5QkGnpUJ

  else if (command === "reopensignup") {
    if (message.member!.roles.cache.has('724818272922501190')
      || message.member!.roles.cache.has('724832462286356590'))
      await reopensignup(message, client)
  }

  else if (command === "closesignup") {
    if (message.member!.roles.cache.has('724818272922501190')
      || message.member!.roles.cache.has('724832462286356590'))
      await closesignup(message, client)
  }

  else if (command === "signup") {
    await signup(message, client)
  }

  else if (command === "removesignup") {
    await removesignup(message)
  }

  else if (command === "deletesignup") {

    if (message.member!.roles.cache.has('724818272922501190')
      || message.member!.roles.cache.has('724832462286356590')) {
      message.reply(await deleteSignup())
    }

    else {
      message.reply("No.")
    }
  }

  else if (command === "vs") {
    let users: Array<string> = []

    for (let i = 0; i < args.length; i++) {
      let userid = await getUser(args[i])
      if (userid) {
        users.push(userid)
      }
    }
    await vs(message.channel.id, client, users)
  }
  (await <Discord.TextChannel>client.channels.cache.get("734075282708758540")).send(`ok`)
});

client.login(process.env.TOKEN);