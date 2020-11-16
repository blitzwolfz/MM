import * as Discord from "discord.js"
import { getMatch, getAllProfiles, updateProfile, getQual } from "./db";
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


export function hasthreevotes(arr:Array<Array<string>>, search:string) {
  let x = 0;
  arr.some((row:Array<string>) => {
    if (row.includes(search)) x++;
  });

  if(x >= 2){
    return true;
  }
  return false;
  
}

export function removethreevotes(arr:Array<Array<string>>, search:string){
  for (let i = 0; i < arr.length; i++){
    for(let x = 0; x < arr[i].length; x++){
      if(arr[i][x] === search){
        arr[i].splice(x, 1) 
      }
    }
  }

  return arr;
}

export const backwardsFilter = (reaction: { emoji: { name: string; }; }, user: Discord.User) => reaction.emoji.name === '⬅' && !user.bot;
export const forwardsFilter = (reaction: { emoji: { name: string; }; }, user: Discord.User) => reaction.emoji.name === '➡'  && !user.bot;

export function indexOf2d (arr:any[][], item:any, searchpos: number, returnpos: number) {

  for (let i = 0; i < arr.length; i++){
    console.log(arr[i][searchpos])
    console.log(arr[i][returnpos])
    
    if(arr[i][searchpos] == item){
      
      console.log(arr[i][returnpos])
      
      return arr[i][returnpos]
    }
  }

  return -1
}


export function dateBuilder () {
  let d = new Date();
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let day = days[d.getDay()];
  let date = d.getDate();
  console.log(d.getMonth())
  let month = months[d.getMonth()];
  let year = d.getFullYear();
  return `${day}, ${month} ${date} ${year}`;
}


export async function reminders(message: Discord.Message, client:Discord.Client, args:string[]) {
  let catchannels = message!.guild!.channels.cache.array()!

  let pp = 0

  for(let channel of catchannels){

    try{
      if(channel.parent && channel.parent!.name === "matches"){
        if (await getMatch(channel.id)) {
          let match = await getMatch(channel.id)
  
          if(match.split){
            if(!match.p1.memedone && !match.p2.memedone){
              await (<Discord.TextChannel>client.channels.cache.get(channel.id))
              .send(`<@${match.p1.userid}>and <@${match.p2.userid}> you have ${args[0]}h left to complete your match`)
            }
            
            else if(match.p1.memedone){
              await (<Discord.TextChannel>client.channels.cache.get(channel.id))
              .send(`<@${match.p2.userid}>you have ${args[0]}h left to complete your match`)
            }
    
            else if(match.p2.memedone){
              await (<Discord.TextChannel>client.channels.cache.get(channel.id))
              .send(`<@${match.p1.userid}>you have ${args[0]}h left to complete your match`)
            }
          }
        }
  
        else{
          let all = (await (<Discord.TextChannel>await client.channels.fetch(channel.id)!)
          .messages.fetch({limit:100}))

          console.log(`The length is: ${all.array().length}`)

          if(all.array().length === 1){
            let m = all.last()!
  
            await m.channel
            .send(`<@&${m.mentions.roles.first()!.id}> and <@&${m.mentions.roles.array()[1]!.id}>, you have ${args[0]}h left to complete your match`)
          }

        }
      }

      else if(channel.parent && channel.parent!.name === "qualifiers"){
        if (await getQual(channel.id) && !args[2]) {
          let match = await getQual(channel.id)

          let s = ""

          for (let i = 0; i < match.players.length; i++){
            if(!match.playersdone.includes(match.players[i].userid)){
              s += `<@${match.players[i].userid}>`
            }
          }

          
          await (<Discord.TextChannel>client.channels.cache.get(channel.id))
          .send(`${s} you have ${args[0]}h left to complete portion ${args[1]}`)

        }
  
        if(args[2] === "start"){
          let all = (await (<Discord.TextChannel>await client.channels.fetch(channel.id)!)
          .messages.fetch({limit:100}))

          console.log(`The length is: ${all.array().length}`)

          let m = all.last()!

          let s = ""

          for(let e = 0; e < m.mentions.users.array().length; e++){
            s += `<@${m.mentions.users.array()[e].id}>`
          }
  
          await m.channel
          .send(`<@${s}>, you have ${args[0]}h left to complete portion ${args[1]}`)

        }
      }
    } catch {
      continue
    }

    pp += 1;

  }
  await message.channel.send(`<@${message.author.id}> gets ${pp} good boy points`)
}

export async function deletechannels(message: Discord.Message, args:string[]) {
  let catchannels = message!.guild!.channels.cache.array()!

  for(let channel of catchannels){

    try{
      if(channel.parent && channel.parent!.name === args[0]){
        await channel.delete()
      }
    
    }  catch {
      continue
    }

  }


}


export async function updatesomething(message:Discord.Message){
  let allusers = await getAllProfiles("wins")

  try{
    for(let u of allusers){
      try{
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

export async function createrole(message: Discord.Message, args: string[]){

  if(!args) return message.reply("you forgot to add command flags. `!createrole <name> <multiple | deafult is 1>`")

  let name = args[0]

  if(!args[0]) return message.reply("Please give a name!!!!")

  //let colour : "GREY" 

  let amount: number = typeof args[1] == "undefined" ? 1 : parseInt(args[1])

  if(amount === 1){
    try{
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

  else if (amount > 1 && amount <= 20){
    for(let x = 0; x < amount; x++){
      try{
        message.guild!.roles.create({
          data: {
            name: `${name}${x+1}`,
            color: 'GREY',
          },
          reason: 'idfk',
        }).then(async r =>{
          message.channel.send(`Role ${name}${x}: <@&${r.id}>`)
        })
      } catch (err) {
        message.channel.send("```" + err + "```")
        return message.reply(", there is an error! Ping blitz and show him the error.")
      }
    }
  }
}


export async function clearstats(message: Discord.Message){

  let profiles = await getAllProfiles("memesvoted")

  for(let i = 0; i < profiles.length; i++){
    await updateProfile(profiles[i]._id, "memesvoted", -(profiles[i].memesvoted))
  }

  await message.reply("Voting stats been cleared have been cleared")

  await clearmodstats(message)

}

