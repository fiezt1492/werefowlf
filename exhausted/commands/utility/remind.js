const Discord = require("discord.js");

module.exports = {
	name: "remind",
	description: "Remind you when you are online",
	category: "private",
	aliases: ["mind", "mindme", "remindme"],
	usage: "[note]",
	cooldown: 5,
	args: true,
	ownerOnly: true,
	permissions: ["SEND_MESSAGES"],

	async execute(message, args, guildSettings, Player) {
		const { client, guild } = message;
		const presence = guild.presences.cache.get(message.author.id);
        // console.log(presence)
		if (!presence || presence.status == "offline")
			return message.reply({
				content: `**[ERROR]** This command only serves online users. Please set your activity status to **Online** to use it.`,
			});

		args = args.join(" ");

		try {
			const db = client.db.collection("remind");

			const exist = await db.findOne({
				id: message.author.id,
			});

			if (!exist)
				await db.insertOne({
					id: message.author.id,
					args: [
						{
							guildId: message.guild.id,
							timestamp: Date.now(),
							content: args,
						},
					],
				});
			else {
				await db.updateOne(
					{
						id: message.author.id,
					},
					{
						$push: {
							args: {
								guildId: message.guild.id,
								timestamp: Date.now(),
								content: args,
							},
						},
					}
				);
			}
		} catch (e) {
			return message.reply({
				content: `**[ERROR]** ${e.message}`,
			});
		} finally {
			const Embed = new Discord.MessageEmbed()
				.setTitle("SUCCESS")
				.setColor("RANDOM")
				.setDescription(
					`> **Note**: When you are online or dnd or idle in next time, you will reveive this args in DM.`
				)
				.addField("Content", args);

			return message.reply({
				embeds: [Embed],
				allowedMentions: {
					repliedUser: false,
				},
			});
		}
	},
};
