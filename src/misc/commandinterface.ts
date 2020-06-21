import * as Discord from "discord.js";

export interface CommandStruct {
    //Since each command is getting their own file and class, 
    //we can write a dedicated help message for them
    help(): string;

    //This is will tell the bot if what the user entered
    //Is the command
    theCommand(command: string):boolean;

    //Command will run if the user enters correct command
    //runCommand is also not returning anything so it won't matter
    runCommand(args: string [], message: Discord.Message, client: Discord.Client):Promise<any[]>;
}