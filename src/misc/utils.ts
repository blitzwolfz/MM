import * as Discord from "discord.js"

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