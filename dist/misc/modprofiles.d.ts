import * as Discord from "discord.js";
export declare function createmodprofile(message: Discord.Message): Promise<Discord.Message | undefined>;
export declare function viewmodprofile(message: Discord.Message, client: Discord.Client, args: string[]): Promise<Discord.Message | undefined>;
export declare function modLB(message: Discord.Message, client: Discord.Client, args: string[]): Promise<Discord.Message | undefined>;
export declare function clearmodstats(message: Discord.Message): Promise<void>;
