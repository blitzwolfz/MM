import * as Discord from "discord.js";
export declare function vs(channelid: string, client: Discord.Client, users: string[]): Promise<void>;
export declare function winner(client: Discord.Client, userid: string): Promise<Discord.MessageAttachment>;
export declare function grandwinner(client: Discord.Client, userid: string): Promise<Discord.MessageAttachment>;
