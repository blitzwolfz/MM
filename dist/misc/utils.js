"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removethreevotes = exports.hasthreevotes = exports.emojis = exports.getUser = void 0;
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
];
function hasthreevotes(arr, search) {
    let x = 0;
    arr.some((row) => {
        if (row.includes(search))
            x++;
    });
    return x++;
}
exports.hasthreevotes = hasthreevotes;
function removethreevotes(arr, search) {
    arr.some((row) => {
        if (row.includes(search)) {
            row.pop();
        }
    });
    return arr;
}
exports.removethreevotes = removethreevotes;
