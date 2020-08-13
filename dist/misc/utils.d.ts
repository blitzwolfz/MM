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
