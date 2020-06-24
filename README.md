# Meme Mania Bot
[![Maintenance](https://img.shields.io/maintenance/yes/2020?style=for-the-badge)](https://GitHub.com/blitzwolfz/MM/graphs/commit-activity) [![GitHub issues](https://img.shields.io/github/issues/blitzwolfz/MM?style=for-the-badge)](https://GitHub.com/blitzwolfz/MM/issues/)


Hi! If you are reading this, then you found my a discord bot that I am working on. It's called Meme Mania.

The bot is as of now actively maintained and well be done till all edge cases are worked out. Once we reach this point and no new features are being worked on, the bot will not see active maintenance on the codebase but more so on the server side.  Of course you can always suggest new features and have your own implementation of how you think these features can be made. In terms of technology that's used, please look at the list below:

Requirements:

 - Typescript @3.9.5
 - NodeJS @ 13.6
 - NodeJS MongoDB Driver @3.5.9
 - Discord.JS v12.2
 - Node Canvas @ 2.6

A more detailed version of this can be found in the package.json file. To get a list of all the dependencies and any sub-dependencies they may have please look at package-lock.json.

# Files

In the next few paragraphs, I will explain all the necessary files you must have to run this bot.

## Firecard, .env file, and all non code files

As of now, I don't have a public env example file but however, this is where all the sensitive data is being stored. This includes the [discord bot token](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token) and [MongoDB url](https://docs.mongodb.com/guides/server/drivers/) needed to access the server.

 - [ ] example env available 
 
 The firecard is used to show a Player vs Player card before their regular matches. You can use any other image just note that there are image requirements that need to be followed. I can provide the image requirements but they are also in the code. You can do trial and error if you use.

## JSON Files
There are three very important JSON Files. Of which you need to have 2 of them, the [package.json](https://github.com/blitzwolfz/MM/blob/master/package.json) file and [tsconfig.json](https://github.com/blitzwolfz/MM/blob/master/tsconfig.json) file. The former provides the program with the information on all the dependencies used, and the latter is needed to have the compiled typescript code out be structured needed to run said bot. The package-lock.json file is auto generated I believe, but in any case it is provided in the [repo](https://github.com/blitzwolfz/MM/blob/master/package-lock.json)

## Rename a file

You can rename files as you see fit, just note that you will be responsible for changing all the equivalent references of the file's name you just changed.

## Delete a file

Don't delete any files unless I do it myself. Of course you are allowed to modify this program as you see fit just note, that if you do, I am not responsible for anything that happens.

# Synchronization
If you wish to run this bot with any features I make, then you should on the regular push all changes from [this branch](https://github.com/blitzwolfz/MM/tree/master) to your code. This branch will hold all the stable features of the bot. Of course if you want to try out new branches and their code, you are free to do so at your own risk. I will not provide any installation instructions on these branches unless stated otherwise.
 
# Hosting  

I'll provide instructions and some resources on how you can host this bot
