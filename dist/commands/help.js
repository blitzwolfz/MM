"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModChallongeHelp = exports.ModSignupHelp = exports.UserHelp = exports.ModHelp = void 0;
const utils_1 = require("../misc/utils");
exports.ModHelp = {
    title: "Mod help menu",
    color: "#d7be26",
    fields: [
        {
            name: '`!start @user1 @user2`',
            value: `Template is randomly picked. You have to approve in <#722616679280148504>`,
        },
        {
            name: '`!end`',
            value: `This will end any match in the channel which this command is used.\nIf you end a match before voting period, the stats of a user won't change.`,
        },
        {
            name: '`!qualend`',
            value: `Forces the ending of a qualifer regardless if a user completes their portion or not`,
        },
        {
            name: '`!cancelmatch`',
            value: `Will cancel a match, and delete it from the db. This doesn't end a match, just cancels it`,
        },
        {
            name: '`!s`',
            value: `This a utility command that should force the bot to display the polls.`,
        },
        {
            name: '`!startqual @mention x <3-5>`',
            value: `Starts a regular qualifier.\nMatch runs like a normal match where they have 30 mins to make a meme.\nJust like regular matches you can pass temp and theme flags`,
        },
        {
            name: '`!splitqual @mention x <3-5>`',
            value: `Creates a split qualifier. The memes will be sent once all the players have finised their portion.`,
        },
        {
            name: '`!startsplitqual @mention`',
            value: `This is to start a split match for a user who is competing in qualifiers.`,
        },
        {
            name: '`!splitmatch @mention x 2`',
            value: `Creates a split regular match.\nThe memes will be sent once all the players have finised their portion.`,
        },
        {
            name: '`!startsplit @mention`',
            value: `This is to start the portion of match for a user who is competing in a regular split math.`,
        },
        {
            name: '`!search`',
            value: `Will search for a user's qualifier channel`,
        },
        {
            name: '`!declarequalwinner`',
            value: `Use this to declare a qualifier winner`,
        },
        {
            name: '`!removequalwinner`',
            value: `Use this to remove a qualifier winner`,
        },
        {
            name: '`!settheme`',
            value: `Use this to set a theme for a qualifier match`,
        },
        {
            name: '`!reload`',
            value: `Use this to set polling for any type of match`,
        },
        {
            name: '`!matchlistmaker`',
            value: `Use this when right after starting a new tournament.`
        }
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
    color: "RED",
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
    color: "RED",
    fields: [
        {
            name: '`!createbracket <challonge url>`',
            value: `Must have the qual tournament finished.\n` +
                `You must also provide a challonge url.\n` +
                `Only need to do this once, as it saves it.`
        },
        {
            name: '`!channelcreate <round number> <hours>`',
            value: `You need to provide a round number for which round's channel you want to create.\n` +
                `You provide a hour number for however long the match lasts.`
        },
        {
            name: '`!qualchannelcreate <hours>`',
            value: `You provide a hour number for however long the match lasts.`
        },
        {
            name: '`!deletechannels <category>`',
            value: `This command deletes all the channels in a category.`
        },
    ],
    timestamp: new Date()
};
