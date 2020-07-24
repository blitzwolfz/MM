
const Canvas = require('canvas');

import * as Discord from "discord.js"
const prefix = process.env.PREFIX!

// function applyText(canvas: any, text: string){
//     const ctx = canvas.getContext('2d');

//     // Declare a base size of the font
//     let fontSize = 70;

//     do {
//         // Assign the font to the context and decrement it so it can be measured again
//         ctx.font = `${fontSize -= 10}px sans-serif`;
//         // Compare pixel width of the text to the canvas minus the approximate avatar size
//     } while (ctx.measureText(text).width > canvas.width - 300);

//     // Return the result to use in the actual canvas
//     return ctx.font;
// };

export async function vs(message: Discord.Message, client: Discord.Client, users: string[]){
	//let users:string[] = []
	console.log(prefix)
    var args: Array<string> = message.content.slice(prefix.length).trim().split(/ +/g)
	console.log(args)
    if (args.length < 3) {
        return message.reply("invalid response. Command is `!vs @user1 @user2 `")
    }

    const canvas = Canvas.createCanvas(1917 , 1168);
	const ctx = canvas.getContext('2d');
		
	
	
    
    // console.log(args)

    // console.log(users)
    let user1 = (await client.users.fetch(users[0]))
	let user2 = (await client.users.fetch(users[1]))
	const avatar = await Canvas.loadImage(user1.displayAvatarURL({ format: 'png', size: 1024}));
    const avatar2 = await Canvas.loadImage(user2.displayAvatarURL({ format: 'png', size: 1024}));

	await ctx.drawImage(avatar, ((canvas.height/2)-602.5), 300-26, 740, 636);
	//await ctx.drawImage(avatar, (529), 300-26, 740, 636);

	//((canvas.width/2)+731)
	await ctx.drawImage(avatar2, ((canvas.width/2)+270), 300-26, 740, 636);
	//await ctx.drawImage(avatar2, (320), 300-26, 740, 636);

	await ctx.drawImage(await Canvas.loadImage("newbackground.png"), 0, 0, canvas.width, canvas.height);




    
	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.jpg');
	//await message.channel.send({ files: [attachment]})
	await message.channel.send(attachment)
}


export async function winner(client: Discord.Client, userid: string){
	let user = await client.users.fetch(userid)
	const avatar = await Canvas.loadImage(user.displayAvatarURL({ format: 'png', size: 512}));
	//console.log(avatar.data)

    const canvas = Canvas.createCanvas(1095, 597);
	const ctx = canvas.getContext('2d');
	//await ctx.drawImage(await Canvas.loadImage("winnercardnobackgroundwithname.png"), 0, 0, canvas.width, canvas.height);

	//await ctx.drawImage(avatar, 547.5, 298.5, 200, 200);
	await ctx.fill( "#FF0000")
	await ctx.save();
	await ctx.beginPath();
	await ctx.arc(1095/2, 597/2 - 70, 225, 0, Math.PI * 2, true);
	// ctx.fillStyle = "blue";
	// await ctx.fill();
	await ctx.closePath();
	await ctx.clip()
	await ctx.drawImage(avatar, 300+20, 26, 455 , 455);

	//await ctx.drawImage(avatar, 25, 25, 200, 200);
	
	await ctx.restore();
	
	

    
	await ctx.drawImage(await Canvas.loadImage("winnercardnobackgroundwithname.png"), 0, 0, canvas.width, canvas.height);

	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.jpg');
	//await message.channel.send({ files: [attachment]})
	return attachment


}

export async function grandwinner(client: Discord.Client, userid: string){
	let user = await client.users.fetch(userid)
	const avatar = await Canvas.loadImage(user.displayAvatarURL({ format: 'png', size: 512}));
	//console.log(avatar.data)

    const canvas = Canvas.createCanvas(1032, 648);
	const ctx = canvas.getContext('2d');
	//await ctx.drawImage(await Canvas.loadImage("winnercardnobackgroundwithname.png"), 0, 0, canvas.width, canvas.height);

	//await ctx.drawImage(avatar, 547.5, 298.5, 200, 200);
	await ctx.fill( "#FF0000")
	await ctx.save();
	await ctx.beginPath();
	await ctx.arc(1095/2, 597/2 - 70, 225, 0, Math.PI * 2, true);
	// ctx.fillStyle = "blue";
	// await ctx.fill();
	await ctx.closePath();
	await ctx.clip()
	await ctx.drawImage(avatar, 300+20, 15, 455 , 455);

	//await ctx.drawImage(avatar, 25, 25, 200, 200);
	
	await ctx.restore();
	
	

    
	await ctx.drawImage(await Canvas.loadImage("Tourneywinner.png"), 0, 0, canvas.width, canvas.height);

	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.jpg');
	//await message.channel.send({ files: [attachment]})
	return attachment


}
















// export async function p1(message: Discord.Message, client: Discord.Client, users: string[]){
//     //let users:string[] = []
//     var args: Array<string> = message.content.slice(prefix.length).trim().split(/ +/g)

//     if (args.length < 3) {
//         return message.reply("invalid response. Command is `.vs @user1 @user2 `")
//     }

//     const canvas = Canvas.createCanvas(700, 250);
//     const ctx = canvas.getContext('2d');
    
// 	ctx.drawImage(await Canvas.loadImage("firecard.jpg"), 0, 0, canvas.width, canvas.height);

// 	ctx.strokeStyle = '#74037b';
//     ctx.strokeRect(0, 0, canvas.width, canvas.height);

    
    
//     // console.log(args)

//     // console.log(users)
//     let user1 = (await client.users.fetch(users[0]))
//     let user2 = (await client.users.fetch(users[1]))

// 	// // Slightly smaller text placed above the member's display name
// 	// ctx.font = '28px sans-serif';
// 	// ctx.fillStyle = '#ffffff';
// 	// ctx.fillText('Welcome to the server,', canvas.width / 2.5, canvas.height / 3.5);

// 	// Add an exclamation point here and below
// 	ctx.font = await applyText(canvas, `VS`);
// 	ctx.fillStyle = '#ffffff';
// 	await ctx.fillText(`VS`, canvas.width / 2 - 35, canvas.height / 2 + 10);
// 	await ctx.save();
// 	await ctx.beginPath();
// 	await ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
// 	// ctx.fillStyle = "blue";
// 	// await ctx.fill();
// 	await ctx.closePath();
// 	await ctx.clip();

//     const avatar = await Canvas.loadImage(user1.displayAvatarURL({ format: 'png'}));
// 	const avatar2 = await Canvas.loadImage(user2.displayAvatarURL({ format: 'png'}));
// 	const up = await Canvas.loadImage("upvote.png");
//     const down = await Canvas.loadImage("downvote.png");
    
// 	await ctx.drawImage(avatar, 25, 25, 200, 200);
// 	await ctx.drawImage(up, 25, 25, 200, 200)
// 	await ctx.restore();

// 	//await ctx.save();
// 	await ctx.save();
// 	await ctx.beginPath();
// 	await ctx.arc(575, 125, 100, 0, 2 * Math.PI, true);
// 	// ctx.fillStyle = "red";
// 	// await ctx.fill();
//     await ctx.closePath();
// 	await ctx.clip();
	
// 	await ctx.drawImage(avatar2, 475, 25, 200, 200);
// 	await ctx.drawImage(down, 475, 25, 200, 200)
// 	await ctx.restore();
// 	//ctx.globalCompositeOperation='source-over';
    
// 	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

// 	await message.channel.send({ files: [attachment]})
// }
