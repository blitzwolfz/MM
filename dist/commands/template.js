"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.approvetemplate = exports.template = void 0;
const db_1 = require("../misc/db");
async function template(message, client) {
    let channel = client.channels.cache.get("722291683030466621");
    if (message.attachments.size > 10) {
        return message.reply("You can't submit more than ten images");
    }
    else if (message.attachments.size <= 0) {
        return message.reply("Your image was not submitted properly. Contact a mod");
    }
    else {
        await channel.send({
            embed: {
                description: `${message.author.username} has submitted a new template(s)`,
                color: "#d7be26",
                timestamp: new Date()
            }
        });
        for (let i = 0; i < message.attachments.array().length; i++) {
            await channel.send(`Template link is: ${message.attachments.array()[i].url}`);
        }
        db_1.updateProfile(message.author.id, "points", (message.attachments.array().length * 2));
        await message.reply(`Thank you for submitting templates. You gained ${message.attachments.array().length * 2} points`);
    }
}
exports.template = template;
async function approvetemplate(message, client) {
    let channel = client.channels.cache.get("724827952390340648");
    if (message.attachments.size > 10) {
        return message.reply("You can't submit more than ten images");
    }
    else if (message.attachments.size <= 0) {
        return message.reply("Your image was not submitted properly. Contact blitz");
    }
    else {
        await channel.send({
            embed: {
                description: `${message.author.username} has approved a new template(s)`,
                color: "#d7be26",
                timestamp: new Date()
            }
        });
        for (let i = 0; i < message.attachments.array().length; i++) {
            await channel.send(`Approved link is: ${message.attachments.array()[i].url}`);
        }
    }
}
exports.approvetemplate = approvetemplate;
