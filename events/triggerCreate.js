const { token, client_id, test_guild_id } = require("../config");

module.exports = {
	name: "messageCreate",
	skip: true,

	async execute(message) {

		const { client, guild, channel, content, author } = message;

		const args = message.content.split(/ +/);

		// Checks if the trigger author is a bot. Comment this line if you want to reply to bots as well.

		if (message.author.bot) return;

		// Checking ALL triggers using every function and breaking out if a trigger was found.

		let check;

		await message.client.triggers.every(async (trigger) => {
			if (check == 1) return false;
			await trigger.name.every(async (name) => {
				if (check == 1) return false;

				// If validated, it will try to execute the trigger.

				if (message.content.includes(name)) {
					try {
						if (trigger.testguild)
							if (guild.id != test_guild_id)
								return;

						trigger.execute(message, args);
					} catch (error) {
						// If checks fail, reply back!

						console.error(error);
						message.reply({
							content: "there was an error trying to execute that trigger!",
						});
					}

					check = 1;
					return false;
				}
			});
		});
	},
};
