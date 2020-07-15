import * as Discord from "discord.js";
import { getVerify, updateVerify, insertVerify } from "./db";
import { verificationform } from "./struct";




export async function verify(message: Discord.Message, client: Discord.Client){
    var args: Array<string> = message.content.slice((process.env.PREFIX!).length).trim().split(/ +/g)

    let form = await getVerify()

    // if(message.channel.type !== "dm"){
    //     return message.reply("You can't verify here.")
    // }

    if(!(message.member!.roles.cache.has('730650583413030953'))){
        return message.reply("You are already verified.")
    }

    if(args[0] === "verify"){
        for(let i = 0; i < form.codes.length; i++){
            if (form.codes[i][0] === message.author.id){
                return message.reply("You already have been sent a code. to reset do `!code 2`")
            }
        }

        if(!args[1]){
            return message.reply("Please supply reddit username.")
        }

        else{
            //let name = ""

            const snoowrap = require('snoowrap');

            let e = String(`${process.env.RTOKEN}`)
            let f = String(`${process.env.SECRET}`)
            let g = String(`${process.env.RPASSWORD}`)

            console.log(typeof(e))
            console.log(typeof(f))
            console.log(typeof(g))
            console.log(e)
            console.log((f))
            console.log((g))

            const r = new snoowrap({
                userAgent: 'memeroyaleverification by u/meme_royale',
                clientId: e,
                clientSecret: f,
                username: 'meme_royale',
                password: g,
            })
            
            
            r.getUser(args[1]).fetch().then(async (userInfo: any) => {
                console.log(userInfo.name);
                console.log(userInfo.created_utc > (Math.floor(Date.now()/100) - (30*24*60*60)));
                console.log(userInfo.verified)




                if(!(userInfo.created_utc < (Math.floor(Date.now()/100) - (30*24*60*60)))){
                    return message.author.send("Your account is not old enough. Please contact a mod if there is an issue.")
                }

                if(!userInfo.verified){
                    return message.author.send("Your email address has not been verified!")
                }

                else{
                    let id = makeid(5)

                    //message.author.send(`Please type \`!code\` and your verification code, \`${id}\` in the verification channel`)
        
                    form.codes.push([message.author.id, id])
                    //form.users.push(message.author.id)
        
                    
        
                    await updateVerify(form)
        
                    await message.reply("Code has been sent to your reddit dm. Please do `!code <your code>` to verify! You only get one chance at it!")

                    await r.composeMessage({
                        to: args[1],
                        subject: "your verification code",
                        text: id
                    }).catch(
                        console.error()
                    )
                    
                    return await message.member?.setNickname(userInfo.name)
                }
                
            }).catch()

        }
    }

    else if(args[0] === "code"){

        if(!(message.member!.roles.cache.has('730650583413030953'))){
            return message.reply("You are already verified.")
        }

        for(let i = 0; i < form.codes.length; i++){
            if (form.codes[i][0] === message.author.id){
                if (args[1] === form.codes[i][1]){
                    await message.member?.roles.remove("730650583413030953")

                    await message.member?.roles.add("719941380503371897")

                    await message.author.send("Remember to check #info, #annoucements, #rules, and to signup for both vote pings and signup pings in #roles! Enjoy your stay.")      
                    
        
                    //form.users.splice(form.users.indexOf(message.author.id), 1)
                    form.codes.splice(form.users.indexOf(message.author.id), 1)
        
                    await updateVerify(form)
        
                    let ch = <Discord.TextChannel>client.channels.cache.get(("722285800225505879"))
        
                    ch.send(`A new contender entered the arena of Meme Royale. Welcome <@${message.author.id}>`)
                    
                    return message.reply("You have been verified!")
                }
            }
        }

        form.codes.splice(form.users.indexOf(message.author.id), 1)

        await updateVerify(form)

        return message.reply("You did not enter code properly. Please restart by doing `!verify <reddit username>`")


        // if(args[1] !== form.codes[form.users.indexOf(message.author.id)] || !args[1]){

        //     form.users.splice(form.users.indexOf(message.author.id), 1)

        // }
    }
}


export async function test(){

    let form:verificationform = {
        _id: 4,
        users: [],
        codes: []
    }

    await insertVerify(form)
    
}



function makeid(length: number) {
    let result           = '';
    let characters       = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }