import { SlashCommandBuilder } from '@discordjs/builders';

export default {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('play a game'),
	async execute(interaction, args, client) {
        if(args.length === 0){
            interaction.reply("first parameter missing");
        }else{
           const game = args[0];
           if(!game){
            interaction.reply("first Parameter missing");
            return;
           }
           
           const gameFile = await import(`../games/${game}.js`);
           if(!gameFile){
            interaction.reply("game not found");
            return;
           }
            
           gameFile.default.startGame(interaction, args, client);
        }
	},
};
