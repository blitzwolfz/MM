"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModHelp = {
    title: "Mod help menu",
    fields: [
        {
            name: '`!start @user1 @user2 <template | theme>`',
            value: `If you pass the template flag, you must attach an image with the image or it won't send.\nIf you do theme flag, then write you theme after the flag`,
        },
        {
            name: '`!end`',
            value: `This will end any match in the channel which this command is used`,
        },
        {
            name: '`!s`',
            value: `This a utility command that should force the bot to display the polls.`,
        },
        {
            name: '`!startqual`',
            value: `Starts a regular qualifier.\nMatch runs like a normal match where they have 30 mins to make a meme.\nJust like regular matches you can pass temp and theme flags`,
        },
        {
            name: '`!startmodqual`',
            value: `Creates a split qualifier. The memes will be sent once all the players have finised their portion.`,
        },
        {
            name: '`!startsplit @mention`',
            value: `This is to start a split match for a user who is competing in qualifiers.`,
        },
        {
            name: '`!qualend`',
            value: `Forces the ending of a qualifer regardless if a user completes their portion or not`,
        },
    ],
    timestamp: new Date()
};
exports.UserHelp = {
    title: "Mod help menu",
    fields: [
        {
            name: '`!submit`',
            value: `Pass a image/gif with the message or it will not be submitted :)`,
        },
        {
            name: '`!qualsubmit`',
            value: `This is for qualifiers only.\nPasses a image/gif with the message or it will not be submitted :)`,
        },
        {
            name: '`!template` or `!submittemplate`',
            value: `This will let you submit templates`,
        },
    ],
    timestamp: new Date()
};
