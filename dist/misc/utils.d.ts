import * as Discord from "discord.js";
export declare function getUser(mention: string): Promise<string | undefined>;
export declare let emojis: string[];
export declare function hasthreevotes(arr: Array<Array<string>>, search: string): boolean;
export declare function removethreevotes(arr: Array<Array<string>>, search: string): string[][];
export declare const backwardsFilter: (reaction: {
    emoji: {
        name: string;
    };
}, user: Discord.User) => boolean;
export declare const forwardsFilter: (reaction: {
    emoji: {
        name: string;
    };
}, user: Discord.User) => boolean;
export declare function indexOf2d(arr: any[][], item: any, searchpos: number, returnpos: number): any;
export declare function dateBuilder(): string;
export declare function reminders(message: Discord.Message, client: Discord.Client, args: string[]): Promise<void>;
export declare function deletechannels(message: Discord.Message, args: string[]): Promise<void>;
export declare function updatesomething(message: Discord.Message): Promise<void>;
export declare function createrole(message: Discord.Message, args: string[]): Promise<Discord.Message | undefined>;
export declare function clearstats(message: Discord.Message): Promise<void>;
