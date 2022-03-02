import { SlashCommandBuilder } from '@discordjs/builders';
import database from "../../databaseHandler.js"

export default {
	data: new SlashCommandBuilder()
		.setName('place')
		.setDescription('return your current ranking position'),
	async execute(interaction) {
        const ranking = []
        database.getAll().then((data) => {
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
