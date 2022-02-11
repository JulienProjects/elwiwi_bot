import dotenv from 'dotenv'
dotenv.config()

import  {getQuote} from "generate-quote";
import { Client, Intents } from 'discord.js';


const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });


client.on("ready", () => {
    console.log("Ready!", client.user.tag);
})

client.on("message", (msg) => {
    if(msg.content === ":elwiwiright:"){
        msg.reply("Yes Praise me :elwiwiright:");
    }
})

function dailyMessage(){
    const channel = client.channels.cache.find(channel => channel.name === "daily-appreciation-el-wiwi")

    if(channel){
        const quote = getQuote();
        console.log(quote);
        channel.send(quote.text + " - el wiwi");
    }
}


client.login(process.env.BOT_TOKEN_ELWIWI);

// setInterval(() => {
//     dailyMessage();
// }, 100000)
