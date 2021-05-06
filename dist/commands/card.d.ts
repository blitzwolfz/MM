import * as Discord from "discord.js";
export declare function vs(channelid: Discord.TextChannel, client: Discord.Client, user1: Discord.User, user2: Discord.User): Promise<void>;
export declare function winner(client: Discord.Client, userid: string): Promise<Discord.MessageAttachment>;
export declare function grandwinner(client: Discord.Client, userid: string): Promise<Discord.MessageAttachment>;
