import * as discord from "discord.js";
import { activematch, qualmatch } from "../misc/struct";
export declare function start(message: discord.Message, client: discord.Client): Promise<discord.Message | discord.Message[] | undefined>;
export declare function startqual(message: discord.Message, client: discord.Client): Promise<discord.Message | discord.Message[] | undefined>;
export declare function startmodqual(message: discord.Message): Promise<discord.Message | discord.Message[] | undefined>;
export declare function running(matches: activematch[], client: discord.Client): Promise<void>;
export declare function qualrunning(qualmatches: qualmatch[], client: discord.Client): Promise<void>;
export declare function splitqual(qualmatches: qualmatch[], client: discord.Client, message: discord.Message): Promise<void>;
