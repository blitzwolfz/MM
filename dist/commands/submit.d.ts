import * as Discord from "discord.js";
export declare function ssubmit(message: Discord.Message, client: Discord.Client): Promise<Discord.Message | undefined>;
export declare function submit(message: Discord.Message, client: Discord.Client, args: string[]): Promise<Discord.Message | undefined>;
export declare function qualsubmit(message: Discord.Message, client: Discord.Client): Promise<Discord.Message | undefined>;
export declare function modsubmit(message: Discord.Message, client: Discord.Client, args: string[]): Promise<Discord.Message | undefined>;
export declare function modqualsubmit(message: Discord.Message, client: Discord.Client, args: string[]): Promise<void>;
