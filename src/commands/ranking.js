import { SlashCommandBuilder } from '@discordjs/builders';
import database from "../databaseHandler.js"

export default {
    data: new SlashCommandBuilder()
        .setName('ranking')
        .setDescription('top 10 streaks'),
    async execute(interaction) {
        const ranking = []
        database.getTopTen().then((data) => {
            let rankingText = 'Place - User - Streak \n';

            data.forEach((user, index) => {
                rankingText += `${index + 1} - ${user.username} - ${user.streak} \n`
            });

            interaction.reply(rankingText);
        })

    },
};
