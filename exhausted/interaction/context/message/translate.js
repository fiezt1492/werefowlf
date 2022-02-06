const Discord = require("discord.js");
const translate = require("translate-google");
const locale = require("../../../modules/misc/translate/locale");

module.exports = {
	data: {
		name: "Translate",
		type: 3,
	},

	async execute(interaction, message, i18n) {
		const { client } = interaction;

		if (!message.content || message.content.length === 0) {
			return await interaction.reply({
				content: `I will not translate a message without content.`,
				ephemeral: true,
			});
		}
		const { guild } = message;

		let langs = Object.keys(locale);

		let TO = guild.preferredLocale ? guild.preferredLocale : "en";

		if (TO == "en-US") TO = "en";

		if (!langs.includes(TO))
			return await interaction.reply({
				content: `This language is not supported`,
				ephemeral: true,
			});

		let description = await translate(message.content, {
			from: "auto",
			to: TO,
		});

		const Embed = new Discord.MessageEmbed()
			.setAuthor({
				name: message.author.tag,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				url: message.url,
			})
			.setDescription(description)
			.setColor("RANDOM")
			.setFooter({
				text: `Requested by ${interaction.user.tag}`,
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
			});

		await interaction.reply({
			embeds: [Embed],
			// components: components ,
			// ephemeral: true,
		});

		let chance = Math.random() * 101;

		if (chance < 10)
			await interaction.followUp({
				content: `> **Note**: *You can change language to translate by changing your guild preferred locale.*`,
			});
		return;
	},
};
