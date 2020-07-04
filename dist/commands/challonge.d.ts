import * as Discord from "discord.js";
export declare function CreateChallongeQualBracket(message: Discord.Message, disclient: Discord.Client, args: string[]): Promise<Discord.Message | undefined>;
export declare function CreateChallongeMatchBracket(message: Discord.Message, disclient: Discord.Client, args: string[]): Promise<void>;
export declare function ChannelCreation(message: Discord.Message, disclient: Discord.Client, args: string[]): Promise<Discord.Message | undefined>;
export declare function declarequalwinner(message: Discord.Message, client: Discord.Client): Promise<Discord.Message | undefined>;
export declare function matchlistmaker(): Promise<void>;
