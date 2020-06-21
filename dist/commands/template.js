"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord = __importStar(require("discord.js"));
async function template(message, client) {
    let channel = client.channels.get("722291683030466621");
    if (message.attachments.size > 1) {
        return message.reply("You can't submit more than one image");
    }
    else if (message.attachments.size <= 0) {
        return message.reply("Your image was not submitted properly. Contact a mod");
    }
    else {
        await channel.send({
            embed: {
                description: `${message.author.username} has submitted a new template`,
                timestamp: new Date()
            }
        });
        await channel.send(new discord.Attachment(message.attachments.array()[0].url));
    }
}
exports.template = template;
