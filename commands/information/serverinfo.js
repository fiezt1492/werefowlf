const Discord = require("discord.js");

module.exports = {
	name: "serverinfo",
	description: "Display guild's info",
	category: "information",
	aliases: ["guildinfo"],
	usage: "",
	cooldown: 5,
	args: false,
	ownerOnly: false,
	permissions: ["SEND_MESSAGES"],

	async execute(message, args, guildSettings) {
		const { client, guild } = message;
		// console.log(guild);
		const owner = await guild.members.fetch(guild.ownerId);

		const guildChannels = guild.channels.cache;
		const guildMembers = guild.members.cache;
		// console.log(guildMembers);
		const channels = {
			voice: guildChannels.filter((c) => c.type === "GUILD_VOICE").size,
			voiceL: guildChannels.filter(
				(c) =>
					c.type === "GUILD_VOICE" &&
					!c.permissionsFor(guild.roles.everyone).has(["CONNECT"])
			).size,
			text: guildChannels.filter((c) => c.type === "GUILD_TEXT").size,
			textL: guildChannels.filter(
				(c) =>
					c.type === "GUILD_TEXT" &&
					!c.permissionsFor(guild.roles.everyone).has(["SEND_MESSAGES"])
			).size,
		};

		const members = {
			user: guildMembers.filter((m) => m.user.bot !== true).size,
			bot: guildMembers.filter((m) => m.user.bot === true).size,
		};

		const Embed = new Discord.MessageEmbed()
			.setTitle(guild.name + "'s Informations")
			.setColor("RANDOM")
			// .setDescription(timeConverter(guild.joinedTimestamp))
			.setThumbnail(guild.iconURL({ size: 1024, dynamic: true }))
			.addField(
				"Owner",
				`\`\`\`${owner.user.tag}\`\`\``,
				true
			)
			.addField("Prefix", `\`\`\`${guildSettings.prefix}\`\`\``, true)
			.addField("Roles", "```" + guild.roles.cache.size + " roles```", true)
			.addField(
				guildChannels.size + " Channels",
				`\`\`\`Texts: ${channels.text} (${channels.textL} locked)\nVoices: ${channels.voice} (${channels.voiceL} locked)\`\`\``,
				true
			)
			.addField(
				guildMembers.size + " Members",
				`\`\`\`Users: ${members.user}\nBots: ${members.bot}\`\`\``,
				true
			)
			.addField(
				"Additional",
				`\`\`\`Created at: ${timeConverter(
					guild.joinedTimestamp
				)}\nVerification Level: ${guild.verificationLevel}\nBoost Level: ${
					guild.premiumTier
				}\nBoost Count: ${guild.premiumSubscriptionCount}\nPreferred Locale: ${
					guild.preferredLocale
				}\`\`\``
			)
			.setFooter({ text: `ID: ${guild.id}` })
			.setTimestamp(guild.joinedTimestamp);

		return message.reply({
			embeds: [Embed],
			allowedMentions: {
				repliedUser: false,
			},
		});
	},
};

function timeConverter(UNIX_timestamp) {
	var a = new Date(UNIX_timestamp);
	var months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];
	var year = a.getFullYear();
	var month = months[a.getMonth()];
	var date = a.getDate();
	var hour = a.getHours();
	var min = a.getMinutes();
	var sec = a.getSeconds();
	var time =
		month + " " + date + " " + year + " " + hour + ":" + min + ":" + sec;
	return time;
}
