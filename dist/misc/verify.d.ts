import * as Discord from "discord.js";
export declare function verify(message: Discord.Message, client: Discord.Client): Promise<Discord.Message | undefined>;
export declare function test(): Promise<void>;
export declare function manuallyverify(message: Discord.Message, client: Discord.Client, args: string[]): Promise<void>;
