import { SlashCommandBuilder } from '@discordjs/builders';
import database from "../../databaseHandler.js"

export default {
	data: new SlashCommandBuilder()
		.setName('ranking')
		.setDescription('top 5 streaks'),
	async execute(interaction) {
        const ranking = []
        database.getAll().then((data) => {
            let rankingText = 'Place - User - Streak \n';

            data.forEach((user, index) => {
                if(index <= 4){
                    rankingText += `${index + 1} - ${user.username} - ${user.streak} \n`
                }
            });

            interaction.reply(rankingText);
        })
		
	},
};
