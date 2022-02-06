const Discord = require("discord.js");

module.exports = {
	name: "avatar",

	/** You need to uncomment below properties if you need them. */
	description: "Get user avatar",
	category: "information",
	usage: "<mention>",
	permissions: "SEND_MESSAGES",

	async execute(message, args, guildSettings) {
		const { client } = message;
		const user =
			message.mentions.users.first() ||
			(await client.users.fetch(message.author.id));

		const Embed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setAuthor({
				name: user.username + "#" + user.discriminator + "'s avatar",
			})
			.setImage(user.displayAvatarURL({ dynamic: true }));

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

		return message.reply({
			embeds: [Embed],
			components: [ROW],
			allowedMentions: {
				repliedUser: false,
			},
		});
	},
};
