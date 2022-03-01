import dotenv from 'dotenv'
dotenv.config()

import { getQuote } from "generate-quote";
import { Client, Intents, Collection } from 'discord.js';
import  fs  from "fs"
import database from "../databaseHandler.js"

const prefix = '-e';
const elwiwiCode = "<:elwiwi:865180324942184479>";
const elwiwiRightCode = "<:elwiwiright:915250236555923578>"
const praiseChannelId = '865990341932220456';
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
    client.user.setActivity("type -ehelp for help | See my Source Code here: https://github.com/JulienProjects/elwiwi_bot"); 
})

client.on("message", (msg) => {
    if(msg.author.bot){
        return;
    }
    //console.log(msg);
    let messageString = msg.content.trim();
    while(messageString.indexOf(elwiwiCode) > -1 || messageString.indexOf(elwiwiRightCode) > -1){
        if(messageString.indexOf(elwiwiCode) > -1){
            const idx = messageString.indexOf(elwiwiCode);
            messageString = messageString.substring(0, idx) + messageString.substring(idx + elwiwiCode.length, messageString.length);
        }else {
            const idx = messageString.indexOf(elwiwiRightCode);
            messageString = messageString.substring(0, idx) + messageString.substring(idx + elwiwiRightCode.length, messageString.length);
        }; 
    }

    if((messageString.length === 0 || messageString.length === 1) && msg.channelId === praiseChannelId){
        const userId = msg.author.id;
        const userName =  msg.author.username
        //console.log(msg);
        database.getUser(userId).then((user) => {
            if(!user){
                const date = new Date().toString();
                //user existietr noch nicht
                database.createNewUser(userId, userName, date).then((data) => {
                    console.log(data, userName);
                })
            }else{   
                const last_praiseDate = new Date(user.last_praise)                     
                var today = new Date();   
                
                const isToday = last_praiseDate.getDate() === today.getDate() && last_praiseDate.getMonth() === today.getMonth() && last_praiseDate.getFullYear() === today.getFullYear();

                //neuer Tag
                if(!isToday){
                    today.setDate(today.getDate() -1);
                    if(today.getDate() === last_praiseDate.getDate()) {
                        //Den nächsten kompletten Tag zeit
                        console.log("neuer praise (still old streak)", user.streak)
                        database.setUserData(userId,new Date().toString(), user.streak + 1)
                        if((user.streak + 1) % 5 === 0){
                            msg.channel.send(`${userName} is on day ${user.streak + 1} praising el wiwi`);
                        }
                    }else {
                        //älter als 24 === streak vorbei
                        console.log("älter als 24", userName)
                        database.setUserData(userId,new Date().toString(), 1)
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

