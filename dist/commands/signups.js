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
exports.viewsignup = exports.reopensignup = exports.closesignup = exports.removesignup = exports.signup = exports.startsignup = void 0;
const Discord = __importStar(require("discord.js"));
const db_1 = require("../misc/db");
async function startsignup(message, client) {
    if (message.member.roles.cache.has('724818272922501190')
        || message.member.roles.cache.has('724818272922501190')
        || message.member.roles.cache.has('724832462286356590')) {
        let newsignup = {
            _id: 1,
            open: true,
            users: [],
        };
        try {
            if (!await db_1.getSignups()) {
                await db_1.insertSignups(newsignup);
                let em = new Discord.MessageEmbed()
                    .setDescription("Match signups have started!"
                    + "\nPlease use the command `!signup`"
                    + "\nIf you wish to remove your signup use `!unsignup`"
                    + "\nOf course if you have problems contact mods!")
                    .setColor("#d7be26")
                    .setTimestamp();
                let channel = await client.channels.fetch("722284266108747880");
                channel.send(em);
            }
            else {
                return message.reply("A signup is already active!");
            }
        }
        catch (err) {
            message.channel.send("```" + err + "```");
            return message.reply(", there is an error! Ping blitz and show him the error.");
        }
    }
    else {
        await (await client.users.fetch(message.author.id)).send("You aren't allowed to use that command!");
    }
}
exports.startsignup = startsignup;
async function signup(message) {
    let signup = await db_1.getSignups();
    if (message.channel.type !== "dm") {
        return message.reply(",you have to signup in bot DM.");
    }
    else if (signup.users.includes(message.author.id)) {
        return message.reply("You already signed up!");
    }
    else if (!signup) {
        return message.reply(", signups haven't opened yet. Contact mod if there is an issue.");
    }
    else if (signup.open === false) {
        return message.reply(", signups are now closed! Contact mod if there is an issue.");
    }
    else {
        signup.users.push(message.author.id);
        await db_1.updateSignup(signup);
        return message.reply("You have been signed up!");
    }
}
exports.signup = signup;
async function removesignup(message) {
    let signup = await db_1.getSignups();
    if (message.channel.type !== "dm") {
        return;
    }
    else if (!signup.users.includes(message.author.id)) {
        return message.reply("You are not signed up!");
    }
    else {
        signup.users.splice(signup.users.indexOf(message.author.id), 1);
        console.log(signup.users);
        await db_1.updateSignup(signup);
        return message.reply("Your signup has been removed!");
    }
}
exports.removesignup = removesignup;
async function closesignup(message, client) {
    if (message.member.roles.cache.has('724818272922501190')
        || message.member.roles.cache.has('724818272922501190')
        || message.member.roles.cache.has('724832462286356590')) {
        try {
            let signup = await db_1.getSignups();
            if (signup.open) {
                let fields = [];
                for (let i = 0; i < signup.users.length; i++) {
                    fields.push({
                        name: `${await (await client.users.fetch(signup.users[i])).username}`,
                        value: `Userid is: ${signup.users[i]}`,
                    });
                }
                let channel = await client.channels.fetch("722291588922867772");
                let channel2 = await client.channels.fetch("722284266108747880");
                channel.send({
                    embed: {
                        title: `Signup list`,
                        fields,
                        color: "#d7be26",
                        timestamp: new Date()
                    }
                });
                let em = new Discord.MessageEmbed()
                    .setDescription("Match signups have now closed!"
                    + "\nIf you wish to remove your signup "
                    + "\nor if you have problems contact mods!")
                    .setColor("#d7be26")
                    .setTimestamp();
                signup.open = false;
                await db_1.updateSignup(signup);
                return channel2.send(em);
            }
            else {
                return message.reply(", signups are closed!");
            }
        }
        catch (err) {
            message.channel.send("```" + err + "```");
            return message.reply(", there is an error! Ping blitz and show him the error.");
        }
    }
    else {
        await (await client.users.fetch(message.author.id)).send("You aren't allowed to use that command!");
    }
}
exports.closesignup = closesignup;
async function reopensignup(message, client) {
    if (message.member.roles.cache.has('724818272922501190')
        || message.member.roles.cache.has('724818272922501190')
        || message.member.roles.cache.has('724832462286356590')) {
        try {
            let signup = await db_1.getSignups();
            if (!signup.open) {
                signup.open = true;
                await db_1.updateSignup(signup);
                let channel2 = await client.channels.fetch("722284266108747880");
                let em = new Discord.MessageEmbed()
                    .setDescription("Match signups have reopened!!"
                    + "\nIf you wish to signup use `!signup`"
                    + "\nIf you wish to remove your signup use `!removesignup`"
                    + "\nOf course if you have problems contact mods!")
                    .setColor("#d7be26")
                    .setTimestamp();
                return channel2.send(em);
            }
            else {
                return message.reply(", signups are already open!");
            }
        }
        catch (err) {
            message.channel.send("```" + err + "```");
            return message.reply(", there is an error! Ping blitz and show him the error.");
        }
    }
    else {
        await (await client.users.fetch(message.author.id)).send("You aren't allowed to use that command!");
    }
}
exports.reopensignup = reopensignup;
async function viewsignup(message, client) {
    if (message.member.roles.cache.has('724818272922501190')
        || message.member.roles.cache.has('724818272922501190')
        || message.member.roles.cache.has('724832462286356590')) {
        try {
            let signup = await db_1.getSignups();
            if (signup.users) {
                let fields = [];
                for (let i = 0; i < signup.users.length; i++) {
                    fields.push({
                        name: `${await (await client.users.fetch(signup.users[i])).username}`,
                        value: `Userid is: ${signup.users[i]}`,
                    });
                }
                return message.channel.send({
                    embed: {
                        title: `Current Signup list`,
                        fields,
                        color: "#d7be26",
                        timestamp: new Date()
                    }
                });
            }
            else {
                return message.reply(", none signed up.");
            }
        }
        catch (err) {
            message.channel.send("```" + err + "```");
            return message.reply(", there is an error! Ping blitz and show him the error.");
        }
    }
    else {
        await (await client.users.fetch(message.author.id)).send("You aren't allowed to use that command!");
    }
}
exports.viewsignup = viewsignup;
