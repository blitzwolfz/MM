import * as discord from "discord.js";
import { activematch, qualmatch } from "../misc/struct";
export declare function endmatch(message: discord.Message, matches: activematch[], client: discord.Client): Promise<void>;
export declare function end(matches: activematch[], client: discord.Client): Promise<void>;
export declare function qualend(matches: qualmatch[], client: discord.Client, message: discord.Message): Promise<void>;
