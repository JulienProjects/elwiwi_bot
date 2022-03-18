import { SlashCommandBuilder } from '@discordjs/builders';
import fs from "fs"

export default {
    data: new SlashCommandBuilder()
        .setName('games')
        .setDescription('returns all availables games'),
    async execute(interaction) {
        const gameFiles = fs.readdirSync('./src/games/').filter(file => file.endsWith('.js'));
        let gamesString = [];
        for (const game of gameFiles) {
            const gameFile = await import(`../games/${game}`);
            gamesString.push(`${game.substring(0, game.length - 3)} - ${gameFile.default.desc}`)
        }
        interaction.author.send(`Available Games: \n${gamesString.join(",\n")}`)
    },
};
