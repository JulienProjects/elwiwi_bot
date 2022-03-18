import { SlashCommandBuilder } from '@discordjs/builders';

export default {
	data: new SlashCommandBuilder()
		.setName('meme')
		.setDescription('sends random elwiwi meme'),
	async execute(interaction) {
		const num = Math.floor(Math.random() * 10).toString()
		//const imagecook = new MessageAttachment('https://cdn.discordapp.com/attachments/587243063932354560/861940902359728128/gurucooking_long.png');
		await interaction.reply({ files: [`./src/images/${num}.jpg`] });
	},
};
