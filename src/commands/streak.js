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
                interaction.author.send("No Praises yet, start praising el wiwi in the daily-appreciation-el-wiwi channel. Man real talk wtf?..")
            }else{
                const last_praiseDate = new Date(data.last_praise);
                var today = new Date();   
                
                const isToday = last_praiseDate.getDate() === today.getDate() && last_praiseDate.getMonth() === today.getMonth() && last_praiseDate.getFullYear() === today.getFullYear();
                const praisesToday = isToday ? "You did your Praise Today" : "You still need to Praise for Today";
                interaction.author.send(`Your on streak ${data.streak} goob job. ${praisesToday}`);
            }
        })
	},
};
