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
exports.createAtUsermatch = exports.createrUser = exports.stats = void 0;
const discord = __importStar(require("discord.js"));
const db_1 = require("../misc/db");
async function stats(message, client) {
    let args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
    let user = await db_1.getProfile(args[1] ? (message.mentions.users.first().id) : message.author.id);
    let imgurl = args[1] ? (client.users.cache.get(message.mentions.users.first().id).displayAvatarURL()) : message.author.displayAvatarURL();
    let name = args[1] ? (client.users.cache.get(message.mentions.users.first().id).username) : message.author.username;
    if (!user) {
        return message.reply("That user profile does not exist! Please do `!create` to create your own user profile");
    }
    else if (user) {
        if (imgurl !== user.img || name !== user.name) {
            user.img = imgurl;
            user.name = name;
            await db_1.updateProfile(user._id, "name", name);
        }
        let wr = 0;
        if (user.loss === 0 && user.wins === 0)
            wr = 0;
        else if (user.loss === 0)
            wr = 100;
        else if (user.wins === 0)
            wr = 0;
        else {
            wr = Math.floor(user.wins / (user.wins + user.loss)) * 100;
        }
        let UserEmbed = new discord.MessageEmbed()
            .setTitle(`${user.name}`)
            .setThumbnail(user.img)
            .setColor("#d7be26")
            .addFields({ name: 'Total points', value: `${user.points}` }, { name: 'Total wins', value: `${user.wins}` }, { name: 'Total loss', value: `${user.loss}` }, { name: 'Total matches', value: `${user.wins + user.loss}` }, { name: 'Win Rate', value: `${wr}%` });
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
            name: message.author.username,
            memesvoted: 0,
            points: 0,
            wins: 0,
            loss: 0,
            img: message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })
        };
        db_1.addProfile(NewUser);
        await message.channel.send(new discord.MessageEmbed()
            .setTitle(`${message.author.username}`)
            .setColor("#d7be26")
            .setThumbnail(`${message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })}`)
            .addFields({ name: 'Total points', value: `${0}` }, { name: 'Total wins', value: `${0}` }, { name: 'Total loss', value: `${0}` }, { name: 'Total matches', value: `${0} W/L` }, { name: 'Win Rate', value: `${0}%` }));
    }
}
exports.createrUser = createrUser;
async function createAtUsermatch(User) {
    let newuser = await db_1.getProfile(User.id);
    if (newuser) {
        return;
    }
    else if (!newuser) {
        let NewUser = {
            _id: User.id,
            name: User.username,
            memesvoted: 0,
            points: 0,
            wins: 0,
            loss: 0,
            img: User.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })
        };
        console.log("Added a new user profile");
        await db_1.addProfile(NewUser);
    }
}
exports.createAtUsermatch = createAtUsermatch;
