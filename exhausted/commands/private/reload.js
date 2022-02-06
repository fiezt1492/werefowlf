// "fs" declared is used in reloading command cache of the specified command.
const fs = require("fs");
const glob = require("glob");

module.exports = {
	name: "reload",
	description: "Reloads a command",
	category: "private",
	// args: true,
	ownerOnly: true,

	execute(message, args) {
		const { client } = message
		let commandName;
		if (!args[0]) {
			client.commands.sweep(() => true);

			glob(`${__dirname}/../**/*.js`, async (err, filePaths) => {
				if (err) return console.error(err);
				filePaths.forEach((file) => {
					delete require.cache[require.resolve(file)];

					const pull = require(file);

					if (pull.name) {
						console.log(`Reloading command ${pull.name}`);
						client.commands.set(pull.name, pull);
					}

					// if (pull.aliases && Array.isArray(pull.aliases)) {
					// 	pull.aliases.forEach((alias) => {
					// 		client.aliases.set(alias, pull.name);
					// 	});
					// }
				});
				console.log("[RELOAD] Reloaded all commands");
			});

			return message.reply("RELOADED ALL COMMANDS");
		} else {
			commandName = args[0].toLowerCase();
		}

		const command =
			message.client.commands.get(commandName) ||
			message.client.commands.find(
				(cmd) => cmd.aliases && cmd.aliases.includes(commandName)
			);

		// Command returns if there is no such command with the specific command name or alias.
		if (!command) {
			return message.channel.send({
				content: `There is no command with name or alias \`${commandName}\`, ${message.author}!`,
			});
		}

		const commandFolders = fs.readdirSync("./commands");

		const folderName = commandFolders.find((folder) =>
			fs.readdirSync(`./commands/${folder}`).includes(`${command.name}.js`)
		);

		// Deletes current cache of that specified command.

		delete require.cache[
			require.resolve(`../${folderName}/${command.name}.js`)
		];

		// Tries Registering command again with new code.

		try {
			const newCommand = require(`../${folderName}/${command.name}.js`);

			// Now registers the command in commands Collection. If it fails, the catch block will be executed.
			message.client.commands.set(newCommand.name, newCommand);

			// 🎉 Confirmation sent if reloading was successful!
			message.channel.send({
				content: `Command \`${newCommand.name}\` was reloaded!`,
			});
		} catch (error) {
			// Catch block executes if there is any error in your code. It logs the error in console and also sends back in discord GUI.

			console.error(error);
			message.channel.send({
				content: `There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``,
			});
		}
	},
};
