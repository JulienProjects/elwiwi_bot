import { SlashCommandBuilder } from '@discordjs/builders';
import  fs  from "fs"

export default {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('play a game, available games: -egames'),
	async execute(interaction, args, client) {
        const game = args[0];
        if(!game){
            interaction.reply("First Parameter missing (should be a Game Name, see -egames) ");
            return;
        }

        if (!fs.existsSync(`./src/games/${game}.js`)) {
            //check if game exists
            interaction.reply("Game not found (see -egames)");
            return;
          }
        const gameFile = await import(`../games/${game}.js`);
    
        gameFile.default.startGame(interaction, args, client);
	}
};
