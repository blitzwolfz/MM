import * as discord from "discord.js";
export declare function start(message: discord.Message, client: discord.Client): Promise<discord.Message | undefined>;
export declare function startqual(message: discord.Message, client: discord.Client): Promise<discord.Message | undefined>;
export declare function startmodqual(message: discord.Message, client: discord.Client): Promise<discord.Message | undefined>;
export declare function running(client: discord.Client): Promise<void>;
export declare function qualrunning(client: discord.Client): Promise<void>;
export declare function splitqual(client: discord.Client, message: discord.Message, ...userid: string[]): Promise<void>;
export declare function splitregular(message: discord.Message, client: discord.Client, ...userid: string[]): Promise<void>;
export declare function startregularsplit(message: discord.Message, client: discord.Client): Promise<discord.Message | undefined>;
export declare function reload(message: discord.Message, client: discord.Client): Promise<void | discord.Message>;
export declare function matchstats(message: discord.Message, client: discord.Client): Promise<discord.Message | undefined>;
export declare function qualstats(message: discord.Message, client: discord.Client): Promise<discord.Message | undefined>;
export declare function forfeit(message: discord.Message): Promise<discord.Message | undefined>;
