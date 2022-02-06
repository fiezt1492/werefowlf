const Discord = require("discord.js");

module.exports = {
	name: "ping",
	description: "Get bot's uptime and ping",
	category: "information",
	aliases: ["uptime"],
	usage: "",
	permissions: "SEND_MESSAGES",

	async execute(message, args, guildSettings) {
		const { client } = message;

		let totalSeconds = client.uptime / 1000;
		let days = Math.floor(totalSeconds / 86400);
		totalSeconds %= 86400;
		let hours = Math.floor(totalSeconds / 3600);
		totalSeconds %= 3600;
		let minutes = Math.floor(totalSeconds / 60);
		let seconds = Math.floor(totalSeconds % 60);
		let uptime = `${days > 0 ? `${days} day${days > 1 ? "s" : ""}, ` : ""}${
			hours > 0 ? `${hours} hour${hours > 1 ? "s" : ""}, ` : ""
		}${minutes > 0 ? `${minutes} minute${minutes > 1 ? "s" : ""}, ` : ""}${
			seconds > 0 ? `${seconds} second${seconds > 1 ? "s" : ""}` : ""
		}`;

		const Embed = new Discord.MessageEmbed()
			// .setTitle("🏓 Pong!")
			.setColor("RANDOM")
			.addField("Online", "```" + uptime + "```")
			.addField(
				"API Latency",
				"```" + Math.round(client.ws.ping) + "ms" + "```",
				true
			)
			.addField(
				"Client Latency",
				"```" +
					Math.round(Date.now() - message.createdTimestamp) +
					"ms" +
					"```",
				true
			)
			.setFooter({
				text: `${message.guild.name}'s Shard: #${message.guild.shardId}`,
			});
		return message.reply({
			embeds: [Embed],
			allowedMentions: {
				repliedUser: false,
			},
		});
	},
};
