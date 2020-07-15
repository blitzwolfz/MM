import * as discord from "discord.js";
export declare function polls(messageReaction: discord.MessageReaction, user: discord.User | discord.PartialUser, client: discord.Client): Promise<discord.Message | undefined>;
