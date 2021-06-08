import * as Discord from "discord.js"
import { matchlistmaker } from "../commands/challonge";
import { startsignup } from "../commands/signups";
import { splitregular } from "../commands/start";
import { getMatch, getAllProfiles, updateProfile, getQual, getMatchlist, getQuallist, dbSoftReset, deleteSignup, deleteQuallist, getAllModProfiles, getAllCockratings, getReminders, deleteReminder, getSignups, updateReminder, getReminder } from "./db";
import { clearmodstats } from "./modprofiles";

export async function getUser(mention: string) {
  // The id is the first and only match found by the RegEx.
  const matches = mention.match(/^<@!?(\d+)>$/);

  // If supplied variable was not a mention, matches will be null instead of an array.
  if (!matches) return;

  // However the first element in the matches array will be the entire mention, not just the ID,
  // so use index 1.
  const id = matches[1];

  return id;
}

// export const emojis = {
//   1: "1️⃣",
//   2: "2️⃣",
//   3: "3️⃣",
//   4: "4️⃣",
//   5: "5️⃣",
//   6: "6️⃣",
//   recycle: "♻️",
// };

export let emojis = [
  "1️⃣",
  "2️⃣",
  "3️⃣",
  "4️⃣",
  "5️⃣",
  "6️⃣",
  "♻️",
  "✅",
  "❌",
  "🌀"
];


export function hasthreevotes(arr: Array<Array<string>>, search: string) {
  let x = 0;
  arr.some((row: Array<string>) => {
    if (row.includes(search)) x++;
  });

  if (x >= 2) {
    return true;
  }
  return false;

}

export function removethreevotes(arr: Array<Array<string>>, search: string) {
  for (let i = 0; i < arr.length; i++) {
    for (let x = 0; x < arr[i].length; x++) {
      if (arr[i][x] === search) {
        arr[i].splice(x, 1)
      }
    }
  }

  return arr;
}

export const backwardsFilter = (reaction: { emoji: { name: string; }; }, user: Discord.User) => reaction.emoji.name === '⬅' && !user.bot;
export const forwardsFilter = (reaction: { emoji: { name: string; }; }, user: Discord.User) => reaction.emoji.name === '➡' && !user.bot;

export function indexOf2d(arr: any[][], item: any, searchpos: number, returnpos: number) {

  for (let i = 0; i < arr.length; i++) {


    if (arr[i][searchpos] == item) {

      

      return arr[i][returnpos]
    }
  }

  return -1
}


export function dateBuilder() {
  let d = new Date();
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let day = days[d.getDay()];
  let date = d.getDate();
  
  let month = months[d.getMonth()];
  let year = d.getFullYear();
  return `${day}, ${month} ${date} ${year}`;
}


export async function reminders(client: Discord.Client, args: string[]) {

  let guild = client.guilds.cache.get("719406444109103117")!
  let catchannels = guild.channels.cache.array()!

  let pp = 0

  for (let channel of catchannels) {

    
    try {
      if (channel.parent && channel.parent!.name === "matches") {
        
        if (await getMatch(channel.id)) {
          let match = await getMatch(channel.id)
          
          if (match.split) {
            if (!match.p1.memedone && !match.p2.memedone) {
              await (<Discord.TextChannel>client.channels.cache.get(channel.id))
                .send(`<@${match.p1.userid}>and <@${match.p2.userid}> you have ${args[0]}h left to complete your match`)
            }

            else if (match.p1.memedone) {
              await (<Discord.TextChannel>client.channels.cache.get(channel.id))
                .send(`<@${match.p2.userid}>you have ${args[0]}h left to complete your match`)
            }

            else if (match.p2.memedone) {
              await (<Discord.TextChannel>client.channels.cache.get(channel.id))
                .send(`<@${match.p1.userid}>you have ${args[0]}h left to complete your match`)
            }
          }
        }

        else {
          let all = (await (<Discord.TextChannel>await client.channels.fetch(channel.id))!
            .messages.fetch({ limit: 100 }))

          
          let m = all.first()!

          await m.channel
            .send(`<@${m.mentions.users.first()!.id}> and <@${m.mentions.users.array()[1]!.id}>, you have ${args[0]}h left to complete your match`)

        }
      }

      else if (channel.parent && channel.parent!.name === "qualifiers") {
        if (await getQual(channel.id)) {
          let match = await getQual(channel.id)

          let s = ""

          if (match.votingperiod === true) continue;

          for (let i = 0; i < match.players.length; i++) {
            if (!match.playersdone.includes(match.players[i].userid)) {
              s += `<@${match.players[i].userid}> `
            }
          }


          await (<Discord.TextChannel>client.channels.cache.get(channel.id))
            .send(`${s} you have ${args[0]}h left to complete portion ${args[1]}`)

        }

        else {
          //Group ${i + 1}
          let n = parseInt(channel.name.toLowerCase().split(" ").join("").replace("group", "")) - 1

          let x = await (await getQuallist()).users[n]

          // let all = (await (<Discord.TextChannel>await client.channels.fetch(channel.id)!)
          //   .messages.fetch({ limit: 100 }))

          

          // let m = all.last()!

          let s = ""

          for (let e = 0; e <x.length; e++) {
            s += `<@${x[e]}> `
          }
          await (<Discord.TextChannel>client.channels.cache.get(channel.id))
          .send(`<@${s}>, you have ${args[0]}h left to complete portion`);
            

        }
      }
    } catch {
      continue
    }

    pp += 1;

  }

  try {
    await console.log(`Me gets ${pp} good boy points`)
  } catch (error) {

  }

  await autoreminders(client)
}

export async function aaautoreminders(client: Discord.Client) {
  // await matchreminder(client)
  // await memereminder(client)

  let reminders = await getReminders();

  for(let r of reminders){
      if (Math.floor(Date.now() / 1000) - r.timestamp >= r.time[r.time.length-1]){
          if(r.type === "match"){
              if(r.basetime !== r.time[r.time.length-1]){
                for(let xx of r.mention.match(/\d+/g)!){
                  try {
                    (await client.users.fetch(xx)).send(
                      `You have ${(r.basetime - r.time[r.time.length-1])/3600}h left to do your match`
                    )
                  } catch (error) {
                    console.log(error.message);
                    (<Discord.TextChannel>await client.channels.fetch(r.channel)).send(
                      `${xx} you have ${(r.basetime - r.time[r.time.length-1])/3600}h left to do your match`
                    )
                  }

                }
              }

              if(r.basetime === r.time[r.time.length-1]){
                let c = <Discord.TextChannel>client.channels.cache.get(r.channel)

                let m = (await c.messages.fetch({limit:100})).last()!

                let arr = r.mention.match(/\d+/g)!

                for(let xx of arr){
                  await splitregular(m, client, xx)

                  await (<Discord.TextChannel>client.channels.cache.get("748760056333336627")).send({

                    embed: {
                      description: `<@${client.user?.id}>/${client.user?.tag} has auto started <@${xx}> in <#${r.channel}>`,
                      color: "#d7be26",
                      timestamp: new Date()
                    }
                  });
                }
              }
              
              r.time.pop()

              if(r.time.length === 0){
                await deleteReminder(r);

                // let c = <Discord.TextChannel>client.channels.cache.get(r.channel)

                // let m = (await c.messages.fetch({limit:100})).last()!

                // await splitregular(m, client, id)
              }

              else await updateReminder(r);
          }

          if(r.type === "meme"){
              (await client.users.cache.get(r._id))!.send(
                  `${r.mention} you have ${(r.basetime - r.time[r.time.length-1])/60}m left to do your portion`
              )

              r.time.pop()

              if(r.time.length === 0){
                  await deleteReminder(r);
              }

              else await updateReminder(r);
          }
      }

  }
}

export async function delay(message:Discord.Message, client:Discord.Client, args:string[]) {
  let reminder = await getReminder(await message.mentions.channels.first()!.id)
  if(message.mentions.channels.array().length === 0){
    return message.reply("Please mention a channel")
  }
  args.pop()
  
  let time = 0;

  for(let x of args){
    if(x.includes("h")){
      x.replace("h", "")

      time += (parseInt(x) * 3600)

    }

    if(x.includes("m")){
      x.replace("m", "")

      time += (parseInt(x) * 60) 

    }

  }

  if(time === 0){
    return message.reply("Please enter a valid time in either ``xh xm``, ``xh``, or ``xm`` format.")
  }

  reminder.basetime += time
  reminder.time[0] += time

  await updateReminder(reminder)
  
  return message.channel.send(`Delayed by ${args.join(" ")}`)

}

// async function  matchreminder(client:Discord.Client) {

//   let r = await getReminders(
//     { type: "match" }
//   )

//   for (let i of r) {
//     if (Math.floor(Date.now() / 1000) - i.timestamp >= i.time) {
//       (<Discord.TextChannel>await client.channels.fetch(i.channel)).send(
//         `${i.mention} you have ${(172800 - i.time)/3600}h left to do your match`
//       )
//       await deleteReminder(i)

//       if(i.time === 86400){
//         await insertReminder(
//           {
//             _id:i.channel,
//             mention:i.mention,
//             channel:i.channel,
//             type:"match",
//             time:129600,
//             timestamp:i.timestamp
//           }
//         )
//       }

//       if(i.time === 129600){
//         await insertReminder(
//           {
//             _id:i.channel,
//             mention:i.mention,
//             channel:i.channel,
//             type:"match",
//             time:165600,
//             timestamp:i.timestamp
//           }
//         )
//       }

//     }
//   }

// }

// async function  memereminder(client:Discord.Client) {

//   let r = await getReminders(
//     { type: "meme" }
//   )

//   for (let i of r) {
//     if (Math.floor(Date.now() / 1000) - i.timestamp >= i.time) {
//       try {
//         (await client.users.cache.get(i._id))!.send(
//           `You have ${Math.floor((3600 - i.time)/60)}m left to do your match`
//         )
//       } catch (
//         error
//       ) {
//          
//       }

//       await deleteReminder(i)

//       if(i.time === 1800){
//         await insertReminder(
//           {
//             _id:i._id,
//             mention:i.mention,
//             channel:i.channel,
//             type:"meme",
//             time:2700,
//             timestamp:i.timestamp
//           }
//         )
//       }

//       if(i.time === 2700){
//         await insertReminder(
//           {
//             _id:i._id,
//             mention:i.mention,
//             channel:i.channel,
//             type:"meme",
//             time:3300,
//             timestamp:i.timestamp
//           }
//         )
//       }
//     }
//   }
// }

export async function aautoreminders(client: Discord.Client, ...st: string[]) {
  let catchannels = client.guilds.cache.get("719406444109103117")!.channels.cache.array()!


  for (let channel of catchannels) {

    try {

      let all = (await (<Discord.TextChannel>await client.channels.fetch(channel.id))!
        .messages.fetch({ limit: 100 }))

      


      if (channel.parent && channel.parent!.name === "matches") {
        //1607365500000
        let now = Math.ceil(Math.round(Math.floor(Date.now() / 1000) - Math.floor(1607365500000 / 1000)) / 100) * 100

        if (await getMatch(channel.id)) {

          let match = await getMatch(channel.id)

          let stmsg: string = ""

          if (!match.p1.memedone) stmsg += `<@${match.p1.userid}>`
          if (!match.p2.memedone) stmsg += ` <@${match.p2.userid}>`

          if (match.split) {
            if (stmsg) {
              if (now === 43200) {
                await (<Discord.TextChannel>client.channels.cache.get(channel.id))
                  .send(`${stmsg} you have 12h left to complete your match`)
              }

              else if (now === 86400) {
                await (<Discord.TextChannel>client.channels.cache.get(channel.id))
                  .send(`${stmsg} you have 24h left to complete your match`)
              }

              else if (now === 7200) {
                await (<Discord.TextChannel>client.channels.cache.get(channel.id))
                  .send(`${stmsg} you have 2h left to complete your match`)
              }
            }
          }

          else {
            if (now === 43200) {
              await (<Discord.TextChannel>client.channels.cache.get(channel.id))
                .send(`<@${all.first()?.mentions.users.array()[0].id}><@${all.first()?.mentions.users.array()[1].id}> you have 12h left to complete your match`)
            }

            else if (now === 86400) {
              await (<Discord.TextChannel>client.channels.cache.get(channel.id))
                .send(`<@${all.first()?.mentions.users.array()[0].id}><@${all.first()?.mentions.users.array()[1].id}> you have 24h left to complete your match`)
            }

            else if (now === 7200) {
              await (<Discord.TextChannel>client.channels.cache.get(channel.id))
                .send(`<@${all.first()?.mentions.users.array()[0].id}><@${all.first()?.mentions.users.array()[1].id}> you have 2h left to complete your match`)
            }

          }

          //     let match = await getMatch(channel.id)

          //     let stmsg:string = ""

          //     if(!match.p1.memedone) stmsg += `<@${match.p1.userid}>`
          //     if(!match.p2.memedone) stmsg += `<@${match.p2.userid}>`

          //     if(match.split){

          //       if(stmsg){

          //         if(now === 43200 ){
          //           await (<Discord.TextChannel>client.channels.cache.get(channel.id))
          //           .send(`${stmsg} you have 12h left to complete your match`)
          //         }

          //         else if(now === 86400 ){
          //           await (<Discord.TextChannel>client.channels.cache.get(channel.id))
          //           .send(`${stmsg} you have 24h left to complete your match`)
          //         }

          //         else if(now === 7200 ){
          //           await (<Discord.TextChannel>client.channels.cache.get(channel.id))
          //           .send(`${stmsg} you have 2h left to complete your match`)
          //         }

          //       }
          //     }
        }

        //   else{
        //     if(now === 43200 ){
        //       await (<Discord.TextChannel>client.channels.cache.get(channel.id))
        //       .send(`<@${all.first()?.mentions.users.array()[0].id}><@${all.first()?.mentions.users.array()[1].id}> you have 12h left to complete your match`)
        //     }

        //     else if(now === 86400 ){
        //       await (<Discord.TextChannel>client.channels.cache.get(channel.id))
        //       .send(`<@${all.first()?.mentions.users.array()[0].id}><@${all.first()?.mentions.users.array()[1].id}> you have 24h left to complete your match`)
        //     }

        //     else if(now === 7200 ){
        //       await (<Discord.TextChannel>client.channels.cache.get(channel.id))
        //       .send(`<@${all.first()?.mentions.users.array()[0].id}><@${all.first()?.mentions.users.array()[1].id}> you have 2h left to complete your match`)
        //     }

        //   }
      }
    }
    catch {
      continue
    }
  }
}

export async function autoreminders(client: Discord.Client) {

  //return; 
  //let time:string;
  //let t = 0;

  if (Math.floor((Date.now()) - parseInt(await (await getMatchlist()).qualurl)) < 165601 * 1000 && Math.floor((Date.now()) - parseInt(await (await getMatchlist()).qualurl)) > 165600 * 1000) {
    //time = "2"
    setTimeout(() => { console.log("World!"); }, 2000);
    await reminders(client, ["2"])
  }

  else if (Math.floor((Date.now()) - parseInt(await (await getMatchlist()).qualurl)) < 129601 * 1000 && Math.floor((Date.now()) - parseInt(await (await getMatchlist()).qualurl)) > 129600 * 1000) {
    await reminders(client, ["12"])

  }

  else if (Math.floor((Date.now()) - parseInt(await (await getMatchlist()).qualurl)) < 86401 * 1000 && Math.floor((Date.now()) - parseInt(await (await getMatchlist()).qualurl)) > 86400 * 1000) {
    await reminders(client, ["24"])
  }
}

export async function deletechannels(message: Discord.Message, args: string[]) {
  let catchannels = message!.guild!.channels.cache.array()!

  for (let channel of catchannels) {

    try {
      if (channel.parent && channel.parent!.name === args[0]) {
        await channel.delete()
      }

    } catch {
      continue
    }
  }

}


export async function updatesomething(message: Discord.Message) {
  let allusers = await getAllProfiles("wins")

  try {
    for (let u of allusers) {
      try {
        await updateProfile(u._id, "memesvoted", 0)
      }

      catch (err) {
        await message.channel.send("```" + err + "```")
      }

    }
  } catch (err) {
    message.channel.send("```" + err + "```")
  }

  await message.channel.send("Done")
}

export async function createrole(message: Discord.Message, args: string[]) {

  if (!args) return message.reply("you forgot to add command flags. `!createrole <name> <multiple | deafult is 1>`")

  let name = args[0]

  if (!args[0]) return message.reply("Please give a name!!!!")

  //let colour : "GREY" 

  let amount: number = typeof args[1] == "undefined" ? 1 : parseInt(args[1])

  if (amount === 1) {
    try {
      message.guild!.roles.create({
        data: {
          name: name,
          color: 'GREY',
        },
        reason: 'idfk',
      })
        .then(console.log)
        .catch(console.error);
    } catch (err) {
      message.channel.send("```" + err + "```")
      return message.reply(", there is an error! Ping blitz and show him the error.")
    }
  }

  else if (amount > 1 && amount <= 20) {
    for (let x = 0; x < amount; x++) {
      try {
        message.guild!.roles.create({
          data: {
            name: `${name}${x + 1}`,
            color: 'GREY',
          },
          reason: 'idfk',
        }).then(async r => {
          message.channel.send(`Role ${name}${x}: <@&${r.id}>`)
        })
      } catch (err) {
        message.channel.send("```" + err + "```")
        return message.reply(", there is an error! Ping blitz and show him the error.")
      }
    }
  }
}


export async function clearstats(message: Discord.Message) {

  let profiles = await getAllProfiles("memesvoted")

  for (let i = 0; i < profiles.length; i++) {
    await updateProfile(profiles[i]._id, "memesvoted", -(profiles[i].memesvoted))
  }

  await message.reply("Voting stats been cleared have been cleared")

  await clearmodstats(message)

}

export async function oldqualifierresultadd(channel: Discord.TextChannel, client: Discord.Client, msg1: string, msg2: string) {
  //let c = <Discord.TextChannel>await client.channels.fetch("722291182461386804")

  let m = await channel.messages.fetch(msg1)

  let em = m.embeds[0].fields

  em.sort(function (a, b) {
    //ratings.sort((a: modprofile, b: modprofile) => (b.modactions) - (a.modactions));
    return ((b.name.length) - (a.name.length));
    //Sort could be modified to, for example, sort on the age 
    // if the name is the same.
  });

  //let c1 = <Discord.TextChannel>await client.channels.fetch("722291182461386804")

  let m1 = await channel.messages.fetch(msg2)

  let em1 = m1.embeds[0].fields

  em1.sort(function (a, b) {
    //ratings.sort((a: modprofile, b: modprofile) => (b.modactions) - (a.modactions));
    return ((b.name.length) - (a.name.length));
    //Sort could be modified to, for example, sort on the age 
    // if the name is the same.
  });

  const fields = [];


  // for (let i = 0; i < em1.length; i++) {

  //   //parseInt(em[i].value[em[i].value.split(" ").findIndex(x => x === "Earned") + 1].substr(0, 2)) + parseInt(em1[i].value[em[i].value.split(" ").findIndex(x => x === "Earned") + 1].substr(0, 2))
  //   fields.push({
  //     name: `${em1[i].name.substr(0, em1[1].name.indexOf("|") - 1)}`,
  //     //value: `${match.votes[i].length > 0 ? `Came in with ${match.votes[i].length} vote(s)` : `Failed to submit meme`}`
  //     value: `${parseInt(`${em[i].value.toLowerCase().includes("earned") ? (em[i].value.split(" ")[5].substr(0, 2) + " ") : "0"}`) + parseInt(`${em1[i].value.toLowerCase().includes("earned") ? (em1[i].value.split(" ")[5].substr(0, 2) + " ") : "0"}`)} `,
  //   });
  // }

  let i = 0
  while (i < em.length) {

    for (let p = 0; p < em1.length; p++) {
      if (em[i].value.split(" ")[10] === em1[p].value.split(" ")[10]) {
        fields.push({
          name: `${em1[p].name.substr(0, em1[1].name.indexOf("|") - 1)}`,
          //value: `${match.votes[i].length > 0 ? `Came in with ${match.votes[i].length} vote(s)` : `Failed to submit meme`}`
          value: `${parseInt(`${em[i].value.toLowerCase().includes("earned") ? (em[i].value.split(" ")[5].substr(0, 2) + " ") : "0"}`) + parseInt(`${em1[p].value.toLowerCase().includes("earned") ? (em1[p].value.split(" ")[5].substr(0, 2) + " ") : "0"}`)} `,
        });

        i += 1

      }
    }
  }

  fields.sort(function (a, b) {
    //ratings.sort((a: modprofile, b: modprofile) => (b.modactions) - (a.modactions));
    return ((parseInt(b.value)) - (parseInt(a.value)));
    //Sort could be modified to, for example, sort on the age 
    // if the name is the same.
  });

  for (let v of fields) {
    v.value += " Points in total"
  }

  channel.send({
    embed: {
      title: `Final Results for ${channel.name}`,
      description: `Top two move on`,
      fields,
      color: "#d7be26",
      timestamp: new Date()
    }
  })

  await (await (<Discord.TextChannel>client.channels.cache.get("722291182461386804")))
    .send({
      embed: {
        title: `Final Results for Group ${channel.name}`,
        description: `Top two move on`,
        fields,
        color: "#d7be26",
        timestamp: new Date()
      }
    })

}

export async function qualifierresultadd(c: Discord.TextChannel, client: Discord.Client, msg1: string, msg2: string) {
  //let r = /\d+/g
  

  let m = await c.messages.fetch(msg1)

  let m2 = await c.messages.fetch(msg2)
  
  let em = m.embeds[0].fields
  
  let em2 = m2.embeds[0].fields

  for(let i = 0; i < em.length; i++){
    
    em[i].name = (em[i].value.split(/[^0-9.]+/g))[3]

    em[i].value = (em[i].value.split(/[^0-9.]+/g))[2]
  }

  for(let ii = 0; ii < em.length; ii++){

    em2[ii].name = (em2[ii].value.split(/[^0-9.]+/g))[3]
    em2[ii].value = (em2[ii].value.split(/[^0-9.]+/g))[2]
  }
  em.sort(function (a, b) {
    //ratings.sort((a: modprofile, b: modprofile) => (b.modactions) - (a.modactions));
    return (parseInt(b.name) - parseInt(a.name));
    //Sort could be modified to, for example, sort on the age 
    // if the name is the same.
  });

  em2.sort(function (a, b) {
    //ratings.sort((a: modprofile, b: modprofile) => (b.modactions) - (a.modactions));
    return (parseInt(b.name) - parseInt(a.name));
    //Sort could be modified to, for example, sort on the age 
    // if the name is the same.
  });

  let fields = em

  const em3 = [];

  for(let y = 0; y < em.length; y++){

    em3.push(
      {
        name:(await client.users.cache.get(em[y].name)!).username,
        value: `${parseInt(em[y].value) + parseInt(em2[y].value)} Points in Total`,
        inline:false
      }
    )
  }

  em3.sort((a, b) => b.value.length - a.value.length)


  fields = em3
  c.send({
    embed: {
      title: `Final Results for Group ${c.name}`,
      description: `Top two move on`,
      fields,
      color: "#d7be26",
      timestamp: new Date()
    }
  })

  await (await (<Discord.TextChannel>client.channels.cache.get("722291182461386804"))).send
  ({
    embed: {
      title: `Final Results for Group ${c.name}`,
      description: `Players with highest move on`,
      fields,
      color: "#d7be26",
      timestamp: new Date()
    }
  })
  
}

export async function resultadd(channel: Discord.TextChannel, client: Discord.Client, ids:string[]){
  let msgArr:Discord.Message[] = [];

  for(let i of ids){
      msgArr.push(await channel.messages.fetch(i))
  }


  let finalResults:Array<{
      name:string,
      value:number
  }> = []


  for(let msg of msgArr){
      let embed = msg.embeds[0]!

      for(let f of embed.fields){
          let key = `${f.value.match(/\d+/g)?.splice(1)[1]}`.toString()
          if(!finalResults.find(x => x.name === key)){
              finalResults.push({
                  name:key,
                  value: parseInt(f.value.match(/\d+/g)?.splice(1)[0]!)
              })
          }

          else{
              finalResults[finalResults.findIndex(x => x.name === key)].value += parseInt(f.value.match(/\d+/g)?.splice(1)[0]!)
          }
      }

  }
  
  finalResults.sort(function(a, b){
      return b.value - a.value
  })

  for(let f of finalResults){
      //@ts-ignore
      //Ik types are important, but sometimes you want to cheat 
      //and do this since it's much easier to work with lol
      f.value = `Got ${f.value} in total | UserID:${f.name}`
      f.name = (await client.users.fetch(f.name)).username

  }

  return {
      title: `Final Results for Group ${channel.name}`,
      description: `Players with highest move on`,
      fields:finalResults,
      color: "#d7be26",
      timestamp: new Date()
    }
}


export async function toHHMMSS(timestamp: number, howlong: number) {

  return new Date((howlong - (Math.floor(Date.now() / 1000) - timestamp)) * 1000).toISOString().substr(11, 8)
}

export async function toS(timestamp: string) {
  if (!timestamp) return null;

  var hms = timestamp.split(':');

  return (+hms[0]) * 60 * 60 + (+hms[1]) * 60 + (+hms[2] || 0);
}

export async function SeasonRestart(message: Discord.Message, client: Discord.Client){
  await dbSoftReset()
  // await deleteSignup()
  // await deleteQuallist()
  // await matchlistmaker()
  // await deleteQuallist()

  await message.reply("Season has been reset")

  await CycleRestart(message, client)
}

export async function CycleRestart(message: Discord.Message, client: Discord.Client){

  if(await (await getSignups()).open === false){
    await deleteSignup()
  }
  await deleteQuallist()
  await matchlistmaker()
  await clearstats(message)
  await startsignup(message, client)

  await message.reply("Season has been reset")
}

export async function saveDatatofile(message: Discord.Message){
  let u = await getAllProfiles("wins")

  let m = await getAllModProfiles("matchportionsstarted")

  let c = await getAllCockratings()

  let u2 = {
    "e":u
  }

  let m2 = {
    "e":m
  }

  let c2 = {
    "e":c
  }

  var json = JSON.stringify(u2);
  var json2 = JSON.stringify(m2);
  var json3 = JSON.stringify(c2);

  var fs = require('fs');

  //@ts-ignore
  let e = await fs.writeFile('user.json', json, 'utf8', function (err:Error) {
    if (err) return console.log(err);
  })

  //@ts-ignore
  let e2 = await fs.writeFile('mods.json', json2, 'utf8', function (err:Error) {
    if (err) return console.log(err);
  })

  //@ts-ignore
  let e3 = await fs.writeFile('cr.json', json3, 'utf8', function (err:Error) {
    if (err) return console.log(err);
  })

  const buffer = fs.readFileSync("./user.json");
  const attachment = new Discord.MessageAttachment(buffer, 'u.json');  
  
  const buffer2 = fs.readFileSync("./mods.json");
  const attachment2 = new Discord.MessageAttachment(buffer2, 'm.json');  
  
  const buffer3 = fs.readFileSync("./cr.json");
  const attachment3 = new Discord.MessageAttachment(buffer3, 'c.json');

  await message.channel.send(attachment)
  await message.channel.send(attachment2)
  await message.channel.send(attachment3)
}