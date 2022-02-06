const Discord = require("discord.js");
const getUserBannerUrl = require("../../../modules/info/getUserBannerUrl");

module.exports = {
	data: {
		name: "Banner",
		type: 3,
	},

	async execute(interaction, message, i18n) {
		const { client } = interaction;

		const user = await client.users.fetch(message.author.id);
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
			// components: [ROW] ,
			// ephemeral: true
		});
		return;
	},
};
