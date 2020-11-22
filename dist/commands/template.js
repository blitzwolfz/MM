"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.themelistLb = exports.removeTheme = exports.addTheme = exports.approvetemplate = exports.template = void 0;
const db_1 = require("../misc/db");
const utils_1 = require("../misc/utils");
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
async function addTheme(message, client, args) {
    if (!args) {
        return message.reply("Please give a theme.");
    }
    else {
        let obj = await db_1.getthemes();
        console.log(obj);
        await message.channel.send(args.join(" "));
        let list = obj.list;
        console.log(list);
        list.push(args.join(" "));
        console.log(list);
        await db_1.updatedoc({
            _id: "themelist",
            list: list.sort()
        });
        await message.reply("added theme.");
    }
}
exports.addTheme = addTheme;
async function removeTheme(message, client, args) {
    if (!args) {
        return message.reply("Please give a theme.");
    }
    else {
        let obj = await db_1.getthemes();
        let list = obj.list;
        let index = list.findIndex(ele => ele === args.join(" "));
        list.splice(index, 1).sort();
        console.log(list);
        await db_1.updatedoc({
            _id: "themelist",
            list: list
        });
        await message.reply("removed theme.");
    }
}
exports.removeTheme = removeTheme;
async function themelistLb(message, client, args) {
    let page = parseInt(args[0]) || 1;
    let obj = (await (await db_1.getthemes()).list);
    const m = (await message.channel.send({ embed: await themelistEmbed(page, client, obj, message.author.id) }));
    await m.react("⬅");
    await m.react("➡");
    const backwards = m.createReactionCollector(utils_1.backwardsFilter, { time: 100000 });
    const forwards = m.createReactionCollector(utils_1.forwardsFilter, { time: 100000 });
    backwards.on('collect', async () => {
        m.reactions.cache.forEach(reaction => reaction.users.remove(message.author.id));
        m.edit({ embed: await themelistEmbed(--page, client, obj) });
    });
    forwards.on('collect', async () => {
        m.reactions.cache.forEach(reaction => reaction.users.remove(message.author.id));
        m.edit({ embed: await themelistEmbed(++page, client, obj) });
    });
}
exports.themelistLb = themelistLb;
async function themelistEmbed(page = 1, client, ratings, ...rest) {
    page = page < 1 ? 1 : page;
    const fields = [];
    let index = (0 + page - 1) * 10;
    for (let i = index; i < index + 10; i++) {
        try {
            fields.push({
                name: `Theme #${i + 1}`,
                value: `${ratings[i]}`
            });
        }
        catch {
            continue;
        }
    }
    return {
        title: `Theme List`,
        description: `Total amount of themes: ${ratings.length + 1}. You are on page ${page || 1} of ${Math.floor(ratings.length / 10) + 1}`,
        fields,
        color: "#d7be26",
        timestamp: new Date()
    };
}
