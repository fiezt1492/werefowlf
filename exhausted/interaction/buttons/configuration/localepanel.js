// const config = require("../../../config");
// const guildPrefix = require("../../../modules/configuration/guildPrefix");
const Discord = require("discord.js");
// const disableComponent = require("../../../modules/util/disableComponent");

module.exports = {
	id: "localepanel",
	filter: "author",

	async execute(interaction, i18n) {
		const { client } = interaction;
		const guildSettings = await client.guildSettings.get(interaction.guildId);

		const Embed = new Discord.MessageEmbed()
			.setTitle("Guild Locale")
			.setColor("RANDOM")
			.setAuthor({
				name: interaction.message.guild.name,
				iconURL: interaction.message.guild.iconURL(),
			})
			.addField("Current Locale", "`" + guildSettings.locale + "`")
			.addField("Supported Locales", "`" + i18n.getLocales().join("`, `") + "`")
			.setDescription(
				`\`Set\` button -> set new guild locale in **Supported Locales**\n\`Reset\` button -> reset your current guild locale to default locale: \`en\``
			);

		const components = (state) => [
			new Discord.MessageActionRow().addComponents(
				new Discord.MessageButton()
					.setCustomId("localeSet")
					.setDisabled(state)
					.setLabel("Set")
					.setStyle("PRIMARY"),
				new Discord.MessageButton()
					.setCustomId("localeReset")
					.setDisabled(state)
					.setLabel("Reset")
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
		return;
	},
};
