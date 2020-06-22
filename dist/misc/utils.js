"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = void 0;
async function getUser(mention) {
    const matches = mention.match(/^<@!?(\d+)>$/);
    if (!matches)
        return;
    const id = matches[1];
    return id;
}
exports.getUser = getUser;
