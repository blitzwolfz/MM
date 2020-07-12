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
        for (let i = 0; i < form.codes.length; i++) {
            if (form.codes[i][0] === message.author.id) {
                return message.reply("You already have been sent a code. to reset do `!code 2`");
            }
        }
        if (!args[1]) {
            return message.reply("Please supply reddit username.");
        }
        else {
            const snoowrap = require('snoowrap');
            let e = String(`${process.env.RTOKEN}`);
            let f = String(`${process.env.SECRET}`);
            let g = String(`${process.env.RPASSWORD}`);
            console.log(typeof (e));
            console.log(typeof (f));
            console.log(typeof (g));
            console.log(e);
            console.log((f));
            console.log((g));
            const r = new snoowrap({
                userAgent: 'memeroyaleverification by u/meme_royale',
                clientId: e,
                clientSecret: f,
                username: 'meme_royale',
                password: g,
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
                    form.codes.push([message.author.id, id]);
                    await db_1.updateVerify(form);
                    await message.reply("Code has been sent to your reddit dm. Please do `!code <your code>` to verify! You only get one chance at it!");
                    await r.composeMessage({
                        to: args[1],
                        subject: "your verification code",
                        text: id
                    }).catch(console.error());
                    return await ((_a = message.member) === null || _a === void 0 ? void 0 : _a.setNickname(userInfo.name));
                }
            }).catch();
        }
    }
    else if (args[0] === "code") {
        if (!(message.member.roles.cache.has('730650583413030953'))) {
            return message.reply("You are already verified.");
        }
        for (let i = 0; i < form.codes.length; i++) {
            if (form.codes[i][0] === message.author.id) {
                if (args[1] === form.codes[i][1]) {
                    await ((_a = message.member) === null || _a === void 0 ? void 0 : _a.roles.remove("730650583413030953"));
                    await ((_b = message.member) === null || _b === void 0 ? void 0 : _b.roles.add("719941380503371897"));
                    form.codes.splice(form.users.indexOf(message.author.id), 1);
                    await db_1.updateVerify(form);
                    let ch = client.channels.cache.get(("722285800225505879"));
                    ch.send(`A new contender entered the arena of Meme Royale. Welcome <@${message.author.id}>`);
                    return message.reply("You have been verified!");
                }
            }
        }
        form.codes.splice(form.users.indexOf(message.author.id), 1);
        await db_1.updateVerify(form);
        return message.reply("You did not enter code properly. Please restart by doing `!verify <reddit username>`");
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