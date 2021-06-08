import * as Discord from "discord.js";
export declare function template(message: Discord.Message, client: Discord.Client, args: string[]): Promise<Discord.Message | undefined>;
export declare function approvetemplate(message: Discord.Message, client: Discord.Client): Promise<Discord.Message | undefined>;
export declare function addTheme(message: Discord.Message, client: Discord.Client, args: string[]): Promise<Discord.Message | undefined>;
export declare function removeTheme(message: Discord.Message, client: Discord.Client, args: string[]): Promise<Discord.Message | undefined>;
export declare function themelistLb(message: Discord.Message, client: Discord.Client, args: string[]): Promise<void>;
export declare function ttemplatecheck(message: Discord.Message, client: Discord.Client, args: string[]): Promise<void>;
export declare function templatecheck(message: Discord.Message, client: Discord.Client, args: string[]): Promise<void>;
