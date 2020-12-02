import * as Discord from "discord.js";
export declare const approvefilter: (reaction: {
    emoji: {
        name: string;
    };
}, user: Discord.User) => boolean;
export declare const redofilter: (reaction: {
    emoji: {
        name: string;
    };
}, user: Discord.User) => boolean;
export declare const disapprovefilter: (reaction: {
    emoji: {
        name: string;
    };
}, user: Discord.User) => boolean;
export declare function getRandomTemplateList(client: Discord.Client): Promise<string[]>;
export declare function getRandomThemeList(client: Discord.Client): Promise<string[]>;
export declare function RandomTemplateFunc(message: Discord.Message, client: Discord.Client, _id: string, theme: boolean): Promise<void>;
