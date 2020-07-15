import * as Discord from "discord.js";
export declare function CreateChallongeQualBracket(message: Discord.Message, disclient: Discord.Client, args: string[]): Promise<Discord.Message | undefined>;
export declare function CreateChallongeMatchBracket(message: Discord.Message, disclient: Discord.Client, args: string[]): Promise<void>;
export declare function ChannelCreation(message: Discord.Message, disclient: Discord.Client, args: string[]): Promise<Discord.Message | undefined>;
export declare function CreateQualGroups(message: Discord.Message, args: string[]): Promise<Discord.Message | undefined>;
export declare function quallistEmbed(message: Discord.Message, client: Discord.Client, args: string[]): Promise<Discord.Message | {
    title: string;
    description: string;
    fields: {
        name: string;
        value: string;
    }[];
    color: string;
    timestamp: Date;
}>;
export declare function GroupSearch(message: Discord.Message, client: Discord.Client, args: string[]): Promise<Discord.Message>;
export declare function declarequalwinner(message: Discord.Message, client: Discord.Client): Promise<Discord.Message | undefined>;
export declare function matchlistmaker(): Promise<void>;
