import { SlashCommandBuilder } from '@discordjs/builders';
import database from "../../databaseHandler.js"

export default {
	data: new SlashCommandBuilder()
		.setName('streak')
		.setDescription('return your current el wiwi praise streak'),
	async execute(interaction) {
		database.getUser(interaction.author.id).then((data) => {
            if(!data || Object.keys(data).length === 0){
                interaction.author.send("No Praises yet, start praising el wiwi in the daily-appreciation-el-wiwi channel. Man real talk wtf?..")
            }else{
                const last_praiseDate = new Date(data.last_praise);
                var today = new Date();   
                
                const isToday = last_praiseDate.getDate() === today.getDate() && last_praiseDate.getMonth() === today.getMonth() && last_praiseDate.getFullYear() === today.getFullYear();
                const praisesToday = isToday ? "You have praised el wiwi today" : "You have not praised el wiwi today";
                interaction.author.send(`You have a streak of ${data.streak}-day/s goob job. ${praisesToday}`);
            }
        })
	},
};
