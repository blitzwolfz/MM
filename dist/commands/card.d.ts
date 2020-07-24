import * as Discord from "discord.js";
export declare function vs(message: Discord.Message, client: Discord.Client, users: string[]): Promise<Discord.Message | undefined>;
export declare function winner(client: Discord.Client, userid: string): Promise<Discord.MessageAttachment>;
export declare function grandwinner(client: Discord.Client, userid: string): Promise<Discord.MessageAttachment>;
