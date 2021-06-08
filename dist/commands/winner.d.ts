import * as discord from "discord.js";
export declare function end(client: discord.Client, id: string): Promise<void>;
export declare function qualend(client: discord.Client, id: string): Promise<discord.Message | undefined>;
export declare function cancelmatch(message: discord.Message): Promise<discord.Message>;
