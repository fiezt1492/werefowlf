// const i18n = require("../modules/util/i18n")
let already = new Set();

module.exports = {
	name: "interactionCreate",

	async execute(interaction) {
		// Deconstructed client from interaction object.
		const { client } = interaction;

		// Checks if the interaction is a button interaction (to prevent weird bugs)

		if (!interaction.isButton()) return;

		const command = client.buttonCommands.get(interaction.customId);

		// If the interaction is not a command in cache, return error message.
		// You can modify the error message at ./messages/defaultButtonError.js file!

		if (!command) {
			// await require("../messages/defaultButtonError").execute(interaction);
			return;
		}

		const guildSettings = await client.guildSettings.get(interaction.guildId);
		const i18n = client.i18n;
		i18n.setLocale(guildSettings.locale);

		// A try to execute the interaction.

		try {
			// console.log(interaction);
			if (command.filter.toLowerCase() === "author") {
				if (interaction.message) {
					if (interaction.message.interaction) {
						if (interaction.message.interaction.user.id !== interaction.user.id)
							return await interaction.reply({
								content: i18n.__("interactionCreate.author"),
								ephemeral: true,
							});
					}

					if (interaction.message.reference) {
						const guild = await client.guilds.fetch(
							interaction.message.reference.guildId
						);
						const channel = await guild.channels.fetch(
							interaction.message.reference.channelId
						);
						const message = await channel.messages.fetch(
							interaction.message.reference.messageId
						);

						if (message.author.id !== interaction.user.id)
							return await interaction.reply({
								content: i18n.__("interactionCreate.author"),
								ephemeral: true,
							});
					}
				}
			}

			if (command.already) {
				if (already.has(interaction.user.id))
					return await interaction.reply({
						content: `You have clicked this button. Please finish previous request.`,
						ephemeral: true,
					});
			}

			await command.execute(interaction, i18n, already);
			return;
		} catch (err) {
			console.error(err);
			await interaction.reply({
				content: i18n.__("common.error"),
				ephemeral: true,
			});
			return;
		}
	},
};
