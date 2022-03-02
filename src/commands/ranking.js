import { SlashCommandBuilder } from '@discordjs/builders';
import database from "../../databaseHandler.js"

export default {
	data: new SlashCommandBuilder()
		.setName('ranking')
		.setDescription('top 5 streaks'),
	async execute(interaction) {
        const ranking = []
        database.getAll().then((data) => {
            var len = data.length;
    
            for (var i = 0; i < len ; i++) {
                for(var j = 0 ; j < len - i - 1; j++){ 
                    if (data[j].streak > data[j + 1].streak) {
                        var temp = data[j];
                        data[j] = data[j+1];
                        data[j + 1] = temp;
                    }
                }
            }
            data = data.reverse();

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
