import dotenv from 'dotenv'
dotenv.config()

import { getQuote } from "generate-quote";
import { Client, Intents, Collection } from 'discord.js';
import  fs  from "fs"

import schedule from 'node-schedule';

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
})

client.on("message", (msg) => {
    if(msg.author.bot){
        return;
    }
    if(msg.content === "<:elwiwiright:915250236555923578>"){
        msg.reply("Yes Praise me <:elwiwiright:915250236555923578>");
    }else{
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
function dailyMessage(){
    const channel = client.channels.cache.find(channel => channel.name === "daily-appreciation-el-wiwi")

    if(channel){
        const quote = getQuote();
        console.log(quote);
        channel.send(quote.text + " - el wiwi");
    }
}

 schedule.scheduleJob('* * */12 * * *', function() {
   dailyMessage();
  });



client.login(process.env.BOT_TOKEN_ELWIWI);

