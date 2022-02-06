module.exports = {
	id: "localeReset",
	filter: "author",

	async execute(interaction, i18n) {
		const { client, message } = interaction;

		const Embed = message.embeds[0];

		if (client.locale.get(message) == "en")
			return interaction.reply({
				content: `Your locale is already default! You dont need to reset it.`,
				ephemeral: true,
			});

		client.locale.set(message).then((locale) => {
			Embed.fields[0] = {
				name: "Current Locale",
				value: "`" + locale + "`",
			};

			message.edit({
				embeds: [Embed],
			});
		});

		return interaction.reply({
			content: `Reset your guild locale to default!`,
			ephemeral: true,
		});
	},
};
