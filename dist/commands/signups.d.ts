import * as Discord from "discord.js";
export declare function startsignup(message: Discord.Message, client: Discord.Client): Promise<Discord.Message | undefined>;
export declare function signup(message: Discord.Message): Promise<Discord.Message | undefined>;
export declare function removesignup(message: Discord.Message): Promise<Discord.Message | undefined>;
export declare function closesignup(message: Discord.Message, client: Discord.Client): Promise<Discord.Message | undefined>;
export declare function reopensignup(message: Discord.Message, client: Discord.Client): Promise<Discord.Message | undefined>;
