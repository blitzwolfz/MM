"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.p1 = exports.vs = void 0;
const Canvas = require('canvas');
const Discord = __importStar(require("discord.js"));
const prefix = process.env.PREFIX;
function applyText(canvas, text) {
    const ctx = canvas.getContext('2d');
    let fontSize = 70;
    do {
        ctx.font = `${fontSize -= 10}px sans-serif`;
    } while (ctx.measureText(text).width > canvas.width - 300);
    return ctx.font;
}
;
async function vs(message, client, users) {
    console.log(prefix);
    var args = message.content.slice(prefix.length).trim().split(/ +/g);
    console.log(args);
    if (args.length < 3) {
        return message.reply("invalid response. Command is `!vs @user1 @user2 `");
    }
    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(await Canvas.loadImage("firecard.jpg"), 0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#74037b';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    let user1 = (await client.users.fetch(users[0]));
    let user2 = (await client.users.fetch(users[1]));
    ctx.font = await applyText(canvas, `VS`);
    ctx.fillStyle = '#ffffff';
    await ctx.fillText(`VS`, canvas.width / 2 - 35, canvas.height / 2 + 10);
    await ctx.save();
    await ctx.beginPath();
    await ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    await ctx.closePath();
    await ctx.clip();
    const avatar = await Canvas.loadImage(user1.displayAvatarURL({ format: 'png' }));
    const avatar2 = await Canvas.loadImage(user2.displayAvatarURL({ format: 'png' }));
    await ctx.drawImage(avatar, 25, 25, 200, 200);
    await ctx.restore();
    await ctx.beginPath();
    await ctx.arc(575, 125, 100, 0, 2 * Math.PI, true);
    await ctx.closePath();
    await ctx.clip();
    await ctx.drawImage(avatar2, 475, 25, 200, 200);
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
    await message.channel.send(attachment);
}
exports.vs = vs;
async function p1(message, client, users) {
    var args = message.content.slice(prefix.length).trim().split(/ +/g);
    if (args.length < 3) {
        return message.reply("invalid response. Command is `.vs @user1 @user2 `");
    }
    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(await Canvas.loadImage("firecard.jpg"), 0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#74037b';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    let user1 = (await client.users.fetch(users[0]));
    let user2 = (await client.users.fetch(users[1]));
    ctx.font = await applyText(canvas, `VS`);
    ctx.fillStyle = '#ffffff';
    await ctx.fillText(`VS`, canvas.width / 2 - 35, canvas.height / 2 + 10);
    await ctx.save();
    await ctx.beginPath();
    await ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    await ctx.closePath();
    await ctx.clip();
    const avatar = await Canvas.loadImage(user1.displayAvatarURL({ format: 'png' }));
    const avatar2 = await Canvas.loadImage(user2.displayAvatarURL({ format: 'png' }));
    const up = await Canvas.loadImage("upvote.png");
    const down = await Canvas.loadImage("downvote.png");
    await ctx.drawImage(avatar, 25, 25, 200, 200);
    await ctx.drawImage(up, 25, 25, 200, 200);
    await ctx.restore();
    await ctx.save();
    await ctx.beginPath();
    await ctx.arc(575, 125, 100, 0, 2 * Math.PI, true);
    await ctx.closePath();
    await ctx.clip();
    await ctx.drawImage(avatar2, 475, 25, 200, 200);
    await ctx.drawImage(down, 475, 25, 200, 200);
    await ctx.restore();
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
    await message.channel.send({ files: [attachment] });
}
exports.p1 = p1;
