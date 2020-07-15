import * as discord from "discord.js";
import { qualmatch } from "../misc/struct";
export declare function qualrunn(match: qualmatch, channelid: string, client: discord.Client): Promise<discord.Message | undefined>;
