import dotenv from 'dotenv'
dotenv.config()

import { getQuote } from "generate-quote";
import { Client, Intents, Collection } from 'discord.js';
import  fs  from "fs"
import database from "../databaseHandler.js"

const prefix = '-e';

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

//commands anwenden
client.commands = new Collection();

const commandFiles = fs.readdirSync('./src/commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = await import(`../src/commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.default.data.name, command.default);
}

client.on("ready", () => {
    console.log("Ready!", client.user.tag);
    client.user.setActivity("type -ehelp for help"); 
})

client.on("message", (msg) => {
    if(msg.author.bot){
        return;
    }
    if(msg.content === "<:elwiwiright:915250236555923578>" && msg.channelId === '865990341932220456'){
        const userId = msg.author.id;
        const userName =  msg.author.username
        //console.log(msg);
        database.getUser(userId).then((user) => {
            if(!user){
                const date = new Date().toString();
                //user existietr noch nicht
                database.createNewUser(userId, userName, date).then((data) => {
                    console.log(data);
                })
            }else{
                const twentyFourHrInMs = 24 * 60 * 60 * 1000;
                const twentyFourHoursAgo = Date.now() - twentyFourHrInMs;
                const last_praiseDate = new Date(user.last_praise)

                if(last_praiseDate < twentyFourHoursAgo){
                    //älter als 24 === streak vorbei
                    console.log("älter als 24")
                    database.setUserData(userId,new Date().toString(), 1)
                }else{
                    var today = new Date();
                    const isToday = last_praiseDate.getDate() === today.getDate() && last_praiseDate.getMonth() === today.getMonth() && last_praiseDate.getFullYear() === today.getFullYear();

                    if(!isToday) {
                        console.log("neuer praise", user.streak)
                        //Immer nur ein Tag
                        database.setUserData(userId,new Date().toString(), user.streak + 1)
                        if((user.streak + 1) % 5 === 0){
                            msg.reply(`Current streak: ${user.streak + 1}. el wiwi is proud`);
                        }
                    }
                }
            }
        });
    } else{
        if(!msg.content.startsWith(prefix)) {
            return;
        }
      
        const args = msg.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();
        console.log(command);
        commandFiles.forEach((file) => {
            if(file.substring(0, file.length - 3) === command){
                client.commands.get(command).execute(msg, args);
            }
        })
    }
})


//daily-appreciation-el-wiwi
// function dailyMessage(){
//     const channel = client.channels.cache.find(channel => channel.name === "daily-appreciation-el-wiwi")

//     if(channel){
//         const quote = getQuote();
//         console.log(quote);
//         channel.send(quote.text + " - el wiwi");
//     }
// }



client.login(process.env.BOT_TOKEN_ELWIWI);

