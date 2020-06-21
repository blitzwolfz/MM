import * as Discord from "discord.js";
import { activematch, qualmatch } from "../misc/struct";
export declare function submit(message: Discord.Message, matches: activematch[], client: Discord.Client): Promise<Discord.Message | Discord.Message[] | undefined>;
export declare function qualsubmit(message: Discord.Message, matches: qualmatch[], client: Discord.Client): Promise<Discord.Message | Discord.Message[] | undefined>;
