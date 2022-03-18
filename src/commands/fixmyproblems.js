import { SlashCommandBuilder } from '@discordjs/builders';

export default {
    data: new SlashCommandBuilder()
        .setName('fixmyproblems')
        .setDescription('fixes all your problems'),
    async execute(interaction) {
        await interaction.reply("KEKW i cant help here");
    },
};
