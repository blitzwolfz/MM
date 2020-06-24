import * as discord from "discord.js";
export declare function endmatch(message: discord.Message, client: discord.Client): Promise<void>;
export declare function end(client: discord.Client): Promise<void>;
export declare function qualend(client: discord.Client, id: string): Promise<discord.Message>;
