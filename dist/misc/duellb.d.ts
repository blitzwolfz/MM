import { Message, Client } from "discord.js";
export declare function duelLB(message: Message, client: Client, args: string[]): Promise<void>;
export declare function createDuelProfileatMatch(userId: string, guildid: string): Promise<void>;
export declare function duelprofilecreate(message: Message, client: Client, args: string[]): Promise<Message | undefined>;
export declare function duelstats(message: Message, client: Client, args: string[]): Promise<Message | undefined>;
