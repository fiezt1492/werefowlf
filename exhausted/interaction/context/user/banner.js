const Discord = require("discord.js");
const getUserBannerUrl = require("../../../modules/info/getUserBannerUrl");

module.exports = {
	data: {
		name: "Banner",
		type: 2, // 2 is for user context menus
	},

	async execute(interaction, member, i18n) {
		const { client } = interaction;

		const user = member.user;
		const banner = await getUserBannerUrl(client, user.id);

		if (!banner)
			return await interaction.reply({
				content: `**[ERROR]** <@!${user.id}> does not have a banner`,
				ephemeral: true,
			});

		const Embed = new Discord.MessageEmbed()
			.setAuthor({
				name: user.username + "#" + user.discriminator + "'s banner",
				iconURL: user.displayAvatarURL({ dynamic: true }),
			})
			.setImage(banner);

		await interaction.reply({
			embeds: [Embed],
			allowedMentions: {
				repliedUser: false,
			},
			// components: [ROW] ,
			// ephemeral: true
		});
		return;
	},
};
