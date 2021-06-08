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
export declare function reminders(client: Discord.Client, args: string[]): Promise<void>;
export declare function aaautoreminders(client: Discord.Client): Promise<void>;
export declare function delay(message: Discord.Message, client: Discord.Client, args: string[]): Promise<Discord.Message>;
export declare function aautoreminders(client: Discord.Client, ...st: string[]): Promise<void>;
export declare function autoreminders(client: Discord.Client): Promise<void>;
export declare function deletechannels(message: Discord.Message, args: string[]): Promise<void>;
export declare function updatesomething(message: Discord.Message): Promise<void>;
export declare function createrole(message: Discord.Message, args: string[]): Promise<Discord.Message | undefined>;
export declare function clearstats(message: Discord.Message): Promise<void>;
export declare function oldqualifierresultadd(channel: Discord.TextChannel, client: Discord.Client, msg1: string, msg2: string): Promise<void>;
export declare function qualifierresultadd(c: Discord.TextChannel, client: Discord.Client, msg1: string, msg2: string): Promise<void>;
export declare function resultadd(channel: Discord.TextChannel, client: Discord.Client, ids: string[]): Promise<{
    title: string;
    description: string;
    fields: {
        name: string;
        value: number;
    }[];
    color: string;
    timestamp: Date;
}>;
export declare function toHHMMSS(timestamp: number, howlong: number): Promise<string>;
export declare function toS(timestamp: string): Promise<number | null>;
export declare function SeasonRestart(message: Discord.Message, client: Discord.Client): Promise<void>;
export declare function CycleRestart(message: Discord.Message, client: Discord.Client): Promise<void>;
export declare function saveDatatofile(message: Discord.Message): Promise<void>;
