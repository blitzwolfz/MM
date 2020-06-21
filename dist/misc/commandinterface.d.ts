import * as Discord from "discord.js";
export interface CommandStruct {
    help(): string;
    theCommand(command: string): boolean;
    runCommand(args: string[], message: Discord.Message, client: Discord.Client): Promise<any[]>;
}
