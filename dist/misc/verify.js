"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = exports.verify = void 0;
const db_1 = require("./db");
async function verify(message, client) {
    var _a, _b;
    var args = message.content.slice((process.env.PREFIX).length).trim().split(/ +/g);
    let form = await db_1.getVerify();
    if (!(message.member.roles.cache.has('730650583413030953'))) {
        return message.reply("You are already verified.");
    }
    if (args[0] === "verify") {
        if (form.users.includes(message.author.id)) {
            return message.reply("You have already been sent a verification code!.");
        }
        if (!args[1]) {
            return message.reply("Please supply reddit username.");
        }
        else {
            const snoowrap = require('snoowrap');
            let e = `${process.env.RTOKEN}`;
            let f = `${process.env.RSECRET}`;
            let g = `${process.env.RPASSWORD}`;
            console.log(typeof (e));
            console.log(typeof (f));
            console.log(typeof (g));
            const r = new snoowrap({
                userAgent: 'ryzen-bot by u/blitzwolfz',
                clientId: e,
                clientSecret: f,
                username: 'blitzwolfz',
                password: g
            });
            r.getUser(args[1]).fetch().then(async (userInfo) => {
                var _a;
                console.log(userInfo.name);
                console.log(userInfo.created_utc > (Math.floor(Date.now() / 100) - (30 * 24 * 60 * 60)));
                console.log(userInfo.verified);
                if (!(userInfo.created_utc < (Math.floor(Date.now() / 100) - (30 * 24 * 60 * 60)))) {
                    return message.author.send("Your account is not old enough. Please contact a mod if there is an issue.");
                }
                if (!userInfo.verified) {
                    return message.author.send("Your email address has not been verified!");
                }
                else {
                    let id = makeid(5);
                    form.codes.push(id);
                    form.users.push(message.author.id);
                    await db_1.updateVerify(form);
                    message.reply("Code has been sent to your reddit dm. Please do `!code <your code>` to verify! You only get one chance at it!");
                    await r.composeMessage({
                        to: `${args[1]}`,
                        subject: "your verification code",
                        text: `${id}`
                    });
                    return await ((_a = message.member) === null || _a === void 0 ? void 0 : _a.setNickname(userInfo.name));
                }
            });
        }
    }
    if (args[0] === "code") {
        if (!(message.member.roles.cache.has('730650583413030953'))) {
            return message.reply("You are already verified.");
        }
        if (args[1] === form.codes[form.users.indexOf(message.author.id)]) {
            await ((_a = message.member) === null || _a === void 0 ? void 0 : _a.roles.remove("730650583413030953"));
            await ((_b = message.member) === null || _b === void 0 ? void 0 : _b.roles.add("719941380503371897"));
            form.users.splice(form.users.indexOf(message.author.id), 1);
            form.codes.splice(form.users.indexOf(message.author.id), 1);
            await db_1.updateVerify(form);
            let ch = client.channels.cache.get(("722285800225505879"));
            ch.send(`A new contender entrered the arena of Meme Royale. Welcome <@${message.author.id}>`);
            return message.reply("You have been verified!");
        }
        if (args[1] !== form.codes[form.users.indexOf(message.author.id)] || !args[1]) {
            form.users.splice(form.users.indexOf(message.author.id), 1);
            form.codes.splice(form.users.indexOf(message.author.id), 1);
            await db_1.updateVerify(form);
            return message.reply("You did not enter code properly. Please restart by doing `!verify <reddit username>`");
        }
    }
}
exports.verify = verify;
async function test() {
    let form = {
        _id: 4,
        users: [],
        codes: []
    };
    await db_1.insertVerify(form);
}
exports.test = test;
function makeid(length) {
    let result = '';
    let characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
