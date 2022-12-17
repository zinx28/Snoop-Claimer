const { glob } = require("glob");
const { promisify } = require("util");
const { ActivityType } = require('discord.js');
const fs = require("fs")
const globPromise = promisify(glob);
module.exports = async (client, token) => {
	fs.readdir("./events/", (err, files) => {
		require(`../events/${files}`)(client)
	})


	// Slash Commands
	

	const arrayOfSlashCommands = [];

	fs.readdir("./SlashCommands/", (err, files) => {
		files.forEach((f, i) => {
			fs.readdir(`./SlashCommands/${f}`, (err, files1) => {
				files1.forEach((v, z) => {
					console.log(v)
					const file = require(`../SlashCommands/${f}/${v}`);
					if (!file?.name) return;
					client.slashCommands.set(file.name, file);

					if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
					arrayOfSlashCommands.push(file);
				})
			})
		})
	})
	
	client.on("ready", async () => {
		// Register for a single guild
		console.log(arrayOfSlashCommands)
		console.log('Cloud Guff Clamier Is online!');
		client.user.setPresence({ activities: [{ name: "Claiming Guff", type: ActivityType.Playing }] })
		await client.guilds.cache.get("1037461554456690788").commands.set(arrayOfSlashCommands);

		// all servers 
		// await client.application.commands.set(arrayOfSlashCommands);
	});

	


}