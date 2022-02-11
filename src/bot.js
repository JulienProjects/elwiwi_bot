import dotenv from 'dotenv'
dotenv.config()

import  {getQuote} from "generate-quote";
import { Client, Intents } from 'discord.js';

import { CronJob } from 'cron';

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });


client.on("ready", () => {
    console.log("Ready!", client.user.tag);
})

client.on("message", (msg) => {
    if(msg.content === "<:elwiwiright:915250236555923578>"){
        msg.reply("Yes Praise me <:elwiwiright:915250236555923578>");
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

var job = new CronJob('* * */12 * * *', function() {
   dailyMessage();
  }, null, true, 'America/Los_Angeles');



client.login(process.env.BOT_TOKEN_ELWIWI);

job.start();
