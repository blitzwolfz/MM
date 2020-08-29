import * as Discord from "discord.js";
export declare function startsignup(message: Discord.Message, client: Discord.Client): Promise<Discord.Message | undefined>;
export declare function signup(message: Discord.Message, client: Discord.Client): Promise<Discord.Message>;
export declare function removesignup(message: Discord.Message): Promise<Discord.Message | undefined>;
export declare function closesignup(message: Discord.Message, client: Discord.Client): Promise<Discord.Message | undefined>;
export declare function reopensignup(message: Discord.Message, client: Discord.Client): Promise<Discord.Message | undefined>;
export declare function viewsignup(message: Discord.Message, client: Discord.Client): Promise<Discord.Message | undefined>;
export declare function activeOffers(message: Discord.Message, client: Discord.Client, args: string[]): Promise<void>;
export declare function matchlistEmbed(message: Discord.Message, client: Discord.Client): Promise<void>;
