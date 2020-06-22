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
exports.createrUser = exports.stats = void 0;
const discord = __importStar(require("discord.js"));
const db_1 = require("../misc/db");
async function stats(message, client) {
    var _a;
    let args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
    let user = await db_1.getProfile(args[1] ? (message.mentions.users.first().id) : message.author.id);
    console.log((_a = client.user) === null || _a === void 0 ? void 0 : _a.avatarURL({ format: 'png' }));
    console.log(user);
    if (!user) {
        return message.reply("That user profile does not exist! Please do `!create` to create your own user profile");
    }
    else if (user) {
        let UserEmbed = new discord.MessageEmbed()
            .setTitle(`${message.author.username}`)
            .setThumbnail(`${user.img}`)
            .setColor("#d7be26")
            .addFields({ name: 'Total wins', value: `${user.wins}` }, { name: 'Total loss', value: `${user.loss}` }, { name: 'Win/Loss Ratio', value: `${(user.WL) * 100}` });
        await message.channel.send(UserEmbed);
    }
}
exports.stats = stats;
async function createrUser(message) {
    let user = await db_1.getProfile(message.author.id);
    if (user) {
        return message.reply("That user profile does exist! Please do `!stats` to check the user profile");
    }
    else if (!user) {
        let NewUser = {
            _id: message.author.id,
            wins: 0,
            loss: 0,
            WL: 0,
            img: message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })
        };
        db_1.addProfile(NewUser);
        await message.channel.send(new discord.MessageEmbed()
            .setTitle(`${message.author.username}`)
            .setColor("#d7be26")
            .setThumbnail(`${message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })}`)
            .addFields({ name: 'Total wins', value: `${0}` }, { name: 'Total loss', value: `${0}` }, { name: 'Win/Loss Ratio', value: `${0}` }));
    }
}
exports.createrUser = createrUser;
