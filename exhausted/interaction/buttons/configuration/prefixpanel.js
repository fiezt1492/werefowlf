const config = require("../../../config");
const Discord = require("discord.js");

module.exports = {
	id: "prefixpanel",
	filter: "author",

	async execute(interaction) {
		const { client } = interaction;

		const Embed = new Discord.MessageEmbed()
			.setAuthor({
				name: interaction.message.guild.name,
				iconURL: interaction.message.guild.iconURL(),
			})
			.setTitle("Guild Prefix")
			.setColor("RANDOM")
			.addField("Current Prefix", client.prefix.get(interaction.message))
			.setDescription(
				`\`Set\` button -> set new guild prefix\n\`Reset\` button -> reset your current guild prefix to default prefix: \`${config.prefix}\``
			);

		const components = (state) => [
			new Discord.MessageActionRow().addComponents(
				new Discord.MessageButton()
					.setCustomId("prefixSet")
					.setLabel("Set")
					.setDisabled(state)
					.setStyle("PRIMARY"),
				new Discord.MessageButton()
					.setCustomId("prefixReset")
					.setLabel("Reset")
					.setDisabled(state)
					.setStyle("SECONDARY")
			),

			new Discord.MessageActionRow().addComponents(
				new Discord.MessageButton()
					.setCustomId("settings")
					.setDisabled(state)
					.setLabel("Settings Panel")
					.setStyle("SECONDARY"),
				new Discord.MessageButton()
					.setCustomId("cancel")
					.setDisabled(state)
					.setLabel("Cancel")
					.setStyle("DANGER")
			),
		];

		await interaction.update({
			embeds: [Embed],
			components: components(false),
		});
	},
};
