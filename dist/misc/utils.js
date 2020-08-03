"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexOf2d = exports.forwardsFilter = exports.backwardsFilter = exports.removethreevotes = exports.hasthreevotes = exports.emojis = exports.getUser = void 0;
async function getUser(mention) {
    const matches = mention.match(/^<@!?(\d+)>$/);
    if (!matches)
        return;
    const id = matches[1];
    return id;
}
exports.getUser = getUser;
exports.emojis = [
    "1️⃣",
    "2️⃣",
    "3️⃣",
    "4️⃣",
    "5️⃣",
    "6️⃣",
    "♻️",
    "✅",
    "❌"
];
function hasthreevotes(arr, search) {
    let x = 0;
    arr.some((row) => {
        if (row.includes(search))
            x++;
    });
    if (x >= 2) {
        return true;
    }
    return false;
}
exports.hasthreevotes = hasthreevotes;
function removethreevotes(arr, search) {
    for (let i = 0; i < arr.length; i++) {
        for (let x = 0; x < arr[i].length; x++) {
            if (arr[i][x] === search) {
                arr[i].splice(x, 1);
            }
        }
    }
    return arr;
}
exports.removethreevotes = removethreevotes;
exports.backwardsFilter = (reaction, user) => reaction.emoji.name === '⬅' && !user.bot;
exports.forwardsFilter = (reaction, user) => reaction.emoji.name === '➡' && !user.bot;
function indexOf2d(arr, item, searchpos, returnpos) {
    for (let i = 0; i < arr.length; i++) {
        console.log(arr[i][searchpos]);
        console.log(arr[i][returnpos]);
        if (arr[i][searchpos] == item) {
            console.log(arr[i][returnpos]);
            return arr[i][returnpos];
        }
    }
    return -1;
}
exports.indexOf2d = indexOf2d;
