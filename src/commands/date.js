import { SlashCommandBuilder } from '@discordjs/builders';

export default {
    data: new SlashCommandBuilder()
        .setName('date')
        .setDescription('return el wiwis current Date'),
    async execute(interaction) {
        const date = new Date();
        await interaction.reply(`Date: ${date}`);
    },
};
