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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.grandwinner = exports.winner = exports.vs = void 0;
const Canvas = require('canvas');
const Discord = __importStar(require("discord.js"));
const prefix = process.env.PREFIX;
async function vs(channelid, client, users) {
    console.log(prefix);
    let ch = await client.channels.fetch(channelid);
    const canvas = Canvas.createCanvas(1917, 1168);
    const ctx = canvas.getContext('2d');
    let user1 = (await client.users.fetch(users[0]));
    let user2 = (await client.users.fetch(users[1]));
    const avatar = await Canvas.loadImage(user1.displayAvatarURL({ format: 'png', size: 1024 }));
    const avatar2 = await Canvas.loadImage(user2.displayAvatarURL({ format: 'png', size: 1024 }));
    await ctx.drawImage(avatar, ((canvas.height / 2) - 602.5), 300 - 26, 740, 636);
    await ctx.drawImage(avatar2, ((canvas.width / 2) + 270), 300 - 26, 740, 636);
    await ctx.drawImage(await Canvas.loadImage("newbackground.png"), 0, 0, canvas.width, canvas.height);
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.jpg');
    await ch.send(attachment);
}
exports.vs = vs;
async function winner(client, userid) {
    let user = await client.users.fetch(userid);
    const avatar = await Canvas.loadImage(user.displayAvatarURL({ format: 'png', size: 512 }));
    const canvas = Canvas.createCanvas(1095, 597);
    const ctx = canvas.getContext('2d');
    await ctx.fill("#FF0000");
    await ctx.save();
    await ctx.beginPath();
    await ctx.arc(1095 / 2, 597 / 2 - 70, 225, 0, Math.PI * 2, true);
    await ctx.closePath();
    await ctx.clip();
    await ctx.drawImage(avatar, 300 + 20, 26, 455, 455);
    await ctx.restore();
    await ctx.drawImage(await Canvas.loadImage("winnercardnobackgroundwithname.png"), 0, 0, canvas.width, canvas.height);
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.jpg');
    return attachment;
}
exports.winner = winner;
async function grandwinner(client, userid) {
    let user = await client.users.fetch(userid);
    const avatar = await Canvas.loadImage(user.displayAvatarURL({ format: 'png', size: 512 }));
    const canvas = Canvas.createCanvas(1032, 648);
    const ctx = canvas.getContext('2d');
    await ctx.fill("#FF0000");
    await ctx.save();
    await ctx.beginPath();
    await ctx.arc(1032 / 2, 648 / 2 - 70, 225, 0, Math.PI * 2, true);
    await ctx.closePath();
    await ctx.clip();
    await ctx.drawImage(avatar, 220, 15, 550, 550);
    await ctx.restore();
    await ctx.drawImage(await Canvas.loadImage("Tourneywinner.png"), 0, 0, canvas.width, canvas.height);
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.jpg');
    return attachment;
}
exports.grandwinner = grandwinner;
