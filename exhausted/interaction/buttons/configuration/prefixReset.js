const config = require("../../../config");

module.exports = {
	id: "prefixReset",
	filter: "author",

	async execute(interaction) {
		const { client, message } = interaction;

		const Embed = message.embeds[0];

		if (client.prefix.get(message) === config.prefix)
			return interaction.reply({
				content: `Your prefix is already default! You dont need to reset it.`,
				ephemeral: true,
			});

		client.prefix.set(message).then((prefix) => {
			Embed.fields[0] = {
				name: "Current Prefix",
				value: prefix,
			};

			message.edit({
				embeds: [Embed],
			});
		});

		return interaction.reply({
			content: `Reset your guild prefix to default!`,
			ephemeral: true,
		});
	},
};
