import { SlashCommandBuilder } from '@discordjs/builders';
import database from "../../databaseHandler.js"

export default {
	data: new SlashCommandBuilder()
		.setName('place')
		.setDescription('return your current ranking position'),
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

            let foundUser = {}
          
            data.forEach((user, index) => {
               if(user.name === interaction.author.id){
                foundUser = {...user, ...{index: index + 1}};
               }
            });

            interaction.reply(`You’re number ${foundUser.index} with a streak of ${foundUser.streak}`);
        })
		
	},
};
