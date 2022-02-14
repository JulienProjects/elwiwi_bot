import { SlashCommandBuilder } from '@discordjs/builders';
import  fs  from "fs"
import dotenv from 'dotenv'
dotenv.config()

export default {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('sends help information'),
	async execute(interaction) {
        const commandFiles = fs.readdirSync('./src/commands/').filter(file => file.endsWith('.js'));
        let commandStr = [];
         for (const cmd of commandFiles) { 
            const command = await import(`./${cmd}`);

            let str = command.default.data.name.toString();
            commandStr.push(`-e${str} - ${command.default.data.description}`)
        }
        interaction.author.send(commandStr.join(",\n"))
	},
};
