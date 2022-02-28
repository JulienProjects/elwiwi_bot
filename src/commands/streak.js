import { SlashCommandBuilder } from '@discordjs/builders';
import database from "../../databaseHandler.js"

export default {
	data: new SlashCommandBuilder()
		.setName('streak')
		.setDescription('return your current el wiwi praise streak'),
	async execute(interaction) {
        console.log(interaction, "HSHAHHAHA");
		database.getUser(interaction.author.id).then((data) => {
            if(!data || Object.keys(data).length === 0){
                interaction.author.send("No Praises yes, start praising el wiwi in the daily-appreciation-el-wiwi channel. Man real talk wtf")
            }else{
                interaction.author.send(`Your on streak ${data.streak} goob job`);
            }
        })
	},
};
