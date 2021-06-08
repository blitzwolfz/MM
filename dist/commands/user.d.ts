import * as discord from "discord.js";
export declare function stats(message: discord.Message, client: discord.Client): Promise<discord.Message | undefined>;
export declare function createrUser(message: discord.Message): Promise<discord.Message | undefined>;
export declare function createAtUsermatch(User: discord.User): Promise<void>;
export declare function clearstats(message: discord.Message): Promise<void>;
