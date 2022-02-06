const Discord = require("discord.js");

module.exports = {
	data: {
		name: "Avatar",
		type: 3, // 3 is for message context menus
	},

	async execute(interaction, message, i18n) {
		const { client } = interaction;

		const user = await client.users.fetch(message.author.id);

		const Embed = new Discord.MessageEmbed()
			.setAuthor({
				name: user.username + "#" + user.discriminator + "'s avatar",
			})
			.setImage(
				`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`
			);

		const JPG = new Discord.MessageButton()
			.setStyle("LINK")
			.setLabel("JPG")
			.setURL(
				`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpg`
			);

		const PNG = new Discord.MessageButton()
			.setStyle("LINK")
			.setLabel("PNG")
			.setURL(
				`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
			);

		const WEBP = new Discord.MessageButton()
			.setStyle("LINK")
			.setLabel("WEBP")
			.setURL(
				`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`
			);

		const ROW = new Discord.MessageActionRow().addComponents([WEBP, PNG, JPG]);

		await interaction.reply({
			embeds: [Embed],
			components: [ROW],
			// ephemeral: true
		});
		return;
	},
};
