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
exports.templatecheck = exports.themelistLb = exports.removeTheme = exports.addTheme = exports.approvetemplate = exports.template = void 0;
const Discord = __importStar(require("discord.js"));
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
        for (let i = 0; i < message.attachments.array().length; i++) {
            await channel.send(new Discord.MessageEmbed()
                .setTitle(`${message.author.username} has submitted a new template(s)`)
                .setDescription(`<@${message.author.id}>`)
                .setImage(message.attachments.array()[i].url)).then(async (message) => {
                await message.react('🏁');
                await message.react('🗡️');
            });
        }
        await message.reply(`Thank you for submitting templates. You will gain a maximum of ${message.attachments.array().length * 2} points if they are approved`);
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
        await db_1.updateThemedb({
            _id: "themelist",
            list: list
        });
        await message.reply("added theme.");
    }
}
exports.addTheme = addTheme;
async function removeTheme(message, client, args) {
    if (!args) {
        return message.reply("Please give a number.");
    }
    else {
        let obj = await db_1.getthemes();
        let list = obj.list;
        let word = list[parseInt(args[0]) - 1];
        list.splice(parseInt(args[0]) - 1, 1);
        console.log(list);
        await db_1.updateThemedb({
            _id: "themelist",
            list: list
        });
        await message.reply(`removed theme of ${word}.`);
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
            if (ratings[i])
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
async function templatecheckembed(page = 1, client, templist, themes = false) {
    page = page < 0 ? 0 : page - 1;
    if (page > templist.length) {
        page = 0;
    }
    if (themes === false) {
        return {
            title: `Template number ${page + 1}`,
            image: {
                url: `${templist[page]}`,
            },
            color: "#d7be26",
            timestamp: new Date()
        };
    }
    if (themes === true) {
        return {
            title: `Theme number ${page + 1}`,
            description: `${templist[page]}`,
            color: "#d7be26",
            timestamp: new Date()
        };
    }
}
async function templatecheck(message, client, args) {
    let page = typeof args[1] == "undefined" ? isNaN(parseInt(args[0])) ? 1 : parseInt(args[0]) : args[1];
    ;
    let ratings = await db_1.gettemplatedb();
    let removelinks = [];
    const m = (await message.channel.send({ embed: await templatecheckembed(page, client, ratings.list) }));
    await m.react("⬅");
    await m.react("➡");
    await m.react('🗡️');
    const backwards = m.createReactionCollector(utils_1.backwardsFilter, { time: 300000 });
    const forwards = m.createReactionCollector(utils_1.forwardsFilter, { time: 300000 });
    const remove = m.createReactionCollector(((reaction, user) => reaction.emoji.name === '🗡️' && !user.bot), { time: 300000 });
    backwards.on('collect', async () => {
        m.reactions.cache.forEach(reaction => reaction.users.remove(message.author.id));
        m.edit({ embed: await templatecheckembed(--page, client, ratings.list) });
    });
    forwards.on('collect', async () => {
        m.reactions.cache.forEach(reaction => reaction.users.remove(message.author.id));
        m.edit({ embed: await templatecheckembed(++page, client, ratings.list) });
    });
    remove.on('collect', async () => {
        var _a;
        m.reactions.cache.forEach(reaction => reaction.users.remove(message.author.id));
        removelinks.push((_a = m.embeds[0].image) === null || _a === void 0 ? void 0 : _a.url);
    });
    remove.on("end", async () => {
        await templatelinksremoved(removelinks);
        await message.reply("Finished");
    });
}
exports.templatecheck = templatecheck;
async function templatelinksremoved(list, themes = false) {
    let tempdb = [];
    tempdb = await (await db_1.gettemplatedb()).list;
    for (let x = 0; x < list.length; x++) {
        let e = tempdb.findIndex(i => i === list[x]);
        tempdb.splice(e, 1);
    }
    await db_1.updatetemplatedb(tempdb);
}
