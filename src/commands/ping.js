import { SlashCommandBuilder } from '@discordjs/builders';

export default {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Test if active'),
	async execute(interaction) {
		await interaction.reply('Im here, dont worry!');
	},
};
