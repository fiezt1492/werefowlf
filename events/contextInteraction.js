// const i18n = require("../modules/util/i18n")
module.exports = {
	name: "interactionCreate",

	execute: async (interaction) => {
		// Deconstructed client from interaction object.
		const { client } = interaction;

		// Checks if the interaction is a button interaction (to prevent weird bugs)

		if (!interaction.isContextMenu()) return;

		/**********************************************************************/

		const guildSettings = await client.guildSettings.get(interaction.guildId);
		const i18n = client.i18n;
		i18n.setLocale(guildSettings.locale);

		// Checks if the interaction target was a user

		if (interaction.targetType === "USER") {
			const command = client.contextCommands.get(
				"USER " + interaction.commandName
			);
			const guild = await client.guilds.cache.get(interaction.guildId);
			const member = await guild.members.cache.get(interaction.targetId);

			// A try to execute the interaction.

			try {
				await command.execute(interaction, member, i18n);
				return;
			} catch (err) {
				console.error(err);
				await interaction.reply({
					content: i18n.__("common.error"),
					ephemeral: true,
				});
				return;
			}
		}
		// Checks if the interaction target was a user
		else if (interaction.targetType === "MESSAGE") {
			const command = client.contextCommands.get(
				"MESSAGE " + interaction.commandName
			);
			const guild = await client.guilds.cache.get(interaction.guildId);
			const channel = await guild.channels.cache.get(interaction.channelId);
			const message = await channel.messages.fetch(interaction.targetId);

			// A try to execute the interaction.

			try {
				if (command.filter) {
					if (command.filter.toLowerCase() === "author") {
						if (message.interaction) {
							if (message.interaction.user.id !== interaction.user.id)
								return await interaction.reply({
									content: i18n.__("interactionCreate.author"),
									ephemeral: true,
								});
						}

						if (message.reference) {
							const guildRef = await client.guilds.fetch(
								message.reference.guildId
							);
							const channelRef = await guildRef.channels.fetch(
								message.reference.channelId
							);
							const msgRef = await channelRef.messages.fetch(
								message.reference.messageId
							);

							if (msgRef.author.id !== interaction.user.id)
								return await interaction.reply({
									content: i18n.__("interactionCreate.author"),
									ephemeral: true,
								});
						}
					}
				}

				await command.execute(interaction, message, i18n);
				return;
			} catch (err) {
				console.error(err);
				await interaction.reply({
					content: i18n.__("common.error"),
					ephemeral: true,
				});
				return;
			}
		}

		// Practically not possible, but we are still caching the bug.
		// Possible Fix is a restart!
		else {
			return console.log(
				"Something weird happening in context menu. Received a context menu of unknown type."
			);
		}
	},
};
