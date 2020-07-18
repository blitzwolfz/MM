"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModChallongeHelp = exports.ModSignupHelp = exports.UserHelp = exports.ModHelp = void 0;
const utils_1 = require("../misc/utils");
exports.ModHelp = {
    title: "Mod help menu",
    color: "#d7be26",
    fields: [
        {
            name: '`!start @user1 @user2 <template | theme>`',
            value: `If you pass the template flag, you must attach an image with the image or it won't send.\nIf you do theme flag, then write you theme after the flag`,
        },
        {
            name: '`!end`',
            value: `This will end any match in the channel which this command is used.\nIf you end a match before voting period, the stats of a user won't change.`,
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
            name: '`!splitqual @mention x 3`',
            value: `Creates a split qualifier. The memes will be sent once all the players have finised their portion.`,
        },
        {
            name: '`!startsplitqual @mention x 3`',
            value: `This is to start a split match for a user who is competing in qualifiers.`,
        },
        {
            name: '`!splitmatch`',
            value: `Creates a split regular match.\nThe memes will be sent once all the players have finised their portion.`,
        },
        {
            name: '`!startsplit @mention`',
            value: `This is to start the portion of match for a user who is competing in a regular split math.`,
        },
        {
            name: '`!qualend`',
            value: `Forces the ending of a qualifer regardless if a user completes their portion or not`,
        },
    ],
    timestamp: new Date()
};
exports.UserHelp = {
    title: "User help menu",
    color: "#d7be26",
    fields: [
        {
            name: '`!submit`',
            value: `Pass a image/gif with the message or it will not be submitted :)\nNote this command works regardless of split or unsplit match`,
        },
        {
            name: '`!qualsubmit`',
            value: `This is for qualifiers only.\nPasses a image/gif with the message or it will not be submitted :)`,
        },
        {
            name: '`!signup`',
            value: `To signup`
        },
        {
            name: '`!unsignup` or `!removesignup` or `!withdraw`',
            value: `To remove your signup`
        },
        {
            name: '`!template` or `!submittemplate`',
            value: `This will let you submit templates`,
        },
        {
            name: '`!stats`',
            value: `This will let you see your user stats`
        },
        {
            name: '`!create`',
            value: `This will let you create a profile.\nIf you participate in a match,\nan account will automatically be made.`
        },
        {
            name: '`!crlb`',
            value: `This will let you see the server's cock rating lb`
        },
        {
            name: 'Voting in qualifiers',
            value: `When voting in qualifiers, and you used up all 3 votes,\nclick on the ${utils_1.emojis[6]} to reset your votes`
        },
    ],
    timestamp: new Date()
};
exports.ModSignupHelp = {
    title: "Admin Signup help menu",
    color: "#d7be26",
    fields: [
        {
            name: '`!startsignup`',
            value: `Starts a signup. Any mod can start one, but only do so if other mods agree!\nIf there are errors, it will output it and ping me so I can fix it!`,
        },
        {
            name: '`!reopensignup`',
            value: `To reopen signup.`
        },
        {
            name: '`!viewsignup`',
            value: `Shows a list of the current signup list.`
        },
        {
            name: '`!closesignup`',
            value: `This is only closes signup.\nThis means, that users are no longer allowed to sign up.\nHowever, they can still remove signups! Also a record of the signup is sent:)`,
        },
        {
            name: '`!deletesignup`',
            value: `Be very careful on how you use this command!!!!.\nThis deletes the signup record.\nOnly use this when a new season starts!!`
        },
        {
            name: '`!challongehelp`',
            value: `Admin help for challonge`
        },
    ],
    timestamp: new Date()
};
exports.ModChallongeHelp = {
    title: "Admin Challonge help menu",
    color: "#d7be26",
    fields: [
        {
            name: '`!createqualbracket <challonge url>`',
            value: `Must close signups!! You must also provide a challonge url. Only need to do this once, as it saves it`,
        },
        {
            name: '`!createbracket <challonge url>`',
            value: `Must have the qual tournament finished. You must also provide a challonge url. Only need to do this once, as it saves it.`
        },
        {
            name: '`!channelcreate <number>`',
            value: `The tournament must be running on challonge. You have to provide a round number such round 1 or round 2`
        },
    ],
    timestamp: new Date()
};
