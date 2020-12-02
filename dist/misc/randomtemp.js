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
exports.RandomTemplateFunc = exports.getRandomThemeList = exports.getRandomTemplateList = exports.disapprovefilter = exports.redofilter = exports.approvefilter = void 0;
const Discord = __importStar(require("discord.js"));
const utils_1 = require("./utils");
const db_1 = require("./db");
exports.approvefilter = (reaction, user) => reaction.emoji.name === utils_1.emojis[7] && !user.bot;
exports.redofilter = (reaction, user) => reaction.emoji.name === '🌀' && !user.bot;
exports.disapprovefilter = (reaction, user) => reaction.emoji.name === utils_1.emojis[8] && !user.bot;
async function getRandomTemplateList(client) {
    return await (await db_1.gettemplatedb()).list;
}
exports.getRandomTemplateList = getRandomTemplateList;
async function getRandomThemeList(client) {
    let e = await db_1.getthemes();
    return await e.list;
}
exports.getRandomThemeList = getRandomThemeList;
async function RandomTemplateEmbed(random, id, istheme) {
    if (istheme === true) {
        let embed = new Discord.MessageEmbed()
            .setTitle("Random template")
            .setDescription(`<#${id}>\nTheme is: ${random}`)
            .setColor("#d7be26")
            .setTimestamp();
        return embed;
    }
    else {
        let embed = new Discord.MessageEmbed()
            .setTitle("Random template")
            .setDescription(`<#${id}>`)
            .setImage(random)
            .setColor("#d7be26")
            .setTimestamp();
        return embed;
    }
}
async function RandomTemplateFunc(message, client, _id, theme) {
    let tempstruct = {
        _id: _id,
        found: false,
        istheme: false,
        url: "",
        messageid: "",
        time: Math.floor(Date.now() / 1000)
    };
    if (theme === true) {
        let themelist = await getRandomThemeList(client);
        let random = themelist[Math.floor(Math.random() * themelist.length)];
        tempstruct.url = random;
        tempstruct.istheme = true;
        await client.channels.cache.get("722616679280148504").send(`<@${message.author.id}>`, await RandomTemplateEmbed(random, message.channel.id, true)).then(async (message) => {
            await message.react(utils_1.emojis[7]);
            await message.react('❌');
            await message.react('🌀');
            tempstruct.messageid = message.id;
        });
    }
    else {
        let templatelist = await getRandomTemplateList(client);
        let random = templatelist[Math.floor(Math.random() * templatelist.length)];
        tempstruct.url = random;
        await client.channels.cache.get("722616679280148504").send(`<@${message.author.id}>`, await RandomTemplateEmbed(random, message.channel.id, false)).then(async (message) => {
            await message.react(utils_1.emojis[7]);
            await message.react('❌');
            await message.react('🌀');
            tempstruct.messageid = message.id;
        });
    }
    await db_1.inserttempStruct(tempstruct);
}
exports.RandomTemplateFunc = RandomTemplateFunc;
