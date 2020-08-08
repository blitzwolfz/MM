import * as Discord from "discord.js"
import { emojis } from "./utils";
import { randomtempstruct } from "./struct";
import { inserttempStruct } from "./db";


export const approvefilter = (reaction: { emoji: { name: string; }; }, user: Discord.User) => reaction.emoji.name === emojis[7] && !user.bot;
export const redofilter = (reaction: { emoji: { name: string; }; }, user: Discord.User) => reaction.emoji.name === '🌀' && !user.bot;
export const disapprovefilter = (reaction: { emoji: { name: string; }; }, user: Discord.User) => reaction.emoji.name === emojis[8] && !user.bot;


export async function getRandomTemplateList(client: Discord.Client): Promise<string[]>{

  var templatelist:string[] = []
  let lastmsg:string[] = []
  console.time("start")
  
  await (<Discord.TextChannel>client.channels.cache.get("724827952390340648")).messages.fetch({ limit: 100 }).then(async msg => {
    console.log(msg.map(async m => {
      // console.log(m.url)
      // await message.reply(m.id)
      await (<Discord.TextChannel>client.channels.cache.get("724827952390340648")).messages.fetch(m.id).then(async (m2: Discord.Message) => {
        if (m2.attachments.size >= 1) {
          // console.log(m2.attachments.array()[0].url)
          for(let x = 0; x < m2.attachments.array().length; x++){
            if(!m2.attachments.array()[x].url.includes("gif") || !m2.attachments.array()[0].url.includes("mp4")){
              templatelist.push(m2.attachments.array()[x].url)
            }
          }
          lastmsg.push(m2.id)
          // await message.reply(m2.attachments.array()[0].url)
        }
      })
    }));
  })

  for(let i = 0; i < 4; i++){
    await (<Discord.TextChannel>client.channels.cache.get("724827952390340648")).messages.fetch({ before:lastmsg[0], limit:100 }).then(async msg => {
      msg.map(async m => {
        // console.log(m.url)
        // await message.reply(m.id)
        await (<Discord.TextChannel>client.channels.cache.get("724827952390340648")).messages.fetch(m.id).then(async (m2: Discord.Message) => {
          if (m2.attachments.size >= 1) {
            // console.log(m2.attachments.array()[0].url)
            for(let x = 0; x < m2.attachments.array().length; x++){
              if(!m2.attachments.array()[x].url.includes("gif") || !m2.attachments.array()[0].url.includes("mp4")){
                templatelist.push(m2.attachments.array()[x].url)
              }
            }
            lastmsg[0] = (m2.id)
            // await message.reply(m2.attachments.array()[0].url)
          }
        })
      });
    })
  }

  let set = await new Set(templatelist)

  templatelist = []

  templatelist = Array.from(set)

  return templatelist
  //await message.reply(`\`\`\`${templatelist}\`\`\``)
}

export function RandomTemplate(){

}


async function RandomTemplateEmbed(random: string, id:string){

  let embed = new Discord.MessageEmbed()
    .setTitle("Random template")
    .setDescription(`<#${id}>`)
    .setImage(random)
    .setColor("#d7be26")
    .setTimestamp()
  
  return embed
}


export async function RandomTemplateFunc(message: Discord.Message, client: Discord.Client, _id:string){

    let templatelist = await getRandomTemplateList(client)
    let random:string = templatelist[Math.floor(Math.random() * (((templatelist.length - 1) - 1) - 1) + 1)];

    let tempstruct :randomtempstruct = {
      _id: message.channel.id,
      found: false,
      url: random,
      messageid: "",
      time:Math.floor(Date.now()/1000)
    }

    
    await (<Discord.TextChannel>client.channels.cache.get("722616679280148504")).send(await RandomTemplateEmbed(random, message.channel.id)).then(async message => {
      await message.react(emojis[7])
      await message.react('❌')
      await message.react('🌀')
      tempstruct.messageid = message.id
    })

    await inserttempStruct(tempstruct);
  
}



// export async function RandomTemplateFunc(message: Discord.Message, client: Discord.Client): Promise<string> {

//     let templatelist = await getRandomTemplateList(message, client)
//     let random = templatelist[Math.floor(Math.random() * (((templatelist.length - 1) - 1) - 1) + 1)]

//     //let guild = client.guilds.cache.get("719406444109103117")
//     let time = Math.floor(Date.now()/1000)

//     const m = <Discord.Message>(await message.channel.send({ embed: await RandomTemplateEmbed(random) }));
//     await m.react(emojis[7])
//     await m.react('🌀')

//     const approve = await m.createReactionCollector(approvefilter, { time: 100000 });
//     const redo = await m.createReactionCollector(redofilter, { time: 100000 });


//     await approve.on("collect", async () => {
//       await m.reactions.cache.forEach(async (reaction) => {
//         await reaction.users.remove(message.author.id);
//         return Promise.resolve(random)
//         //await message.reply(`reacted`)
//       });
//       //m.edit({ embed: await ratingslistEmbed(++page, client, ratings) });
//     });

//     await redo.on("collect", async () => {
//       await m.reactions.cache.forEach((reaction) =>
//         reaction.users.remove(message.author.id)
//       );
//       await m.edit({ embed: await getRandomTemplateList(message, client) });
//       random =
//         templatelist[
//           Math.floor(Math.random() * (templatelist.length - 1 - 1 - 1) + 1)
//         ];

//       let embed = new Discord.MessageEmbed() //For discord v11 Change to new Discord.RichEmbed()
//         .setImage(random);

//       m.edit(embed);
//     })

// }