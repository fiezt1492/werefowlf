const Discord = require("discord.js");

module.exports = {
	data: {
		name: "Avatar",
		type: 2, // 2 is for user context menus
	},

	async execute(interaction, member, i18n) {
		const { client } = interaction;

		const user = member.user;
		const Embed = new Discord.MessageEmbed()
			.setAuthor({
				name: user.username + "#" + user.discriminator + "'s avatar",
			})
			.setImage(user.displayAvatarURL({ dynamic: true, size: 256 }));

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
			allowedMentions: {
				repliedUser: false,
			},
			// ephemeral: true
		});
		return;
	},
};
