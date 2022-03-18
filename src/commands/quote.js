import { SlashCommandBuilder } from '@discordjs/builders';
import { getQuote } from "generate-quote";

export default {
	data: new SlashCommandBuilder()
		.setName('quote')
		.setDescription('sends random el wiwi quote'),
	async execute(interaction) {
		const quote = getQuote();
		console.log(quote);
		await interaction.reply(quote.text + " - el wiwi");
	},
};
