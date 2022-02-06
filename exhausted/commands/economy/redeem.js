const Discord = require("discord.js");

module.exports = {
	name: "redeem",
	description: "redeem a giftcode",
	category: "economy",
	aliases: [],
	usage: "[giftcode]",
	cooldown: 5,
	args: true,
	ownerOnly: false,
	once: false,
	permissions: ["SEND_MESSAGES"],

	async execute(message, args, guildSettings, Player, ONCE) {
		const { client } = message;
		const db = client.db.collection("giftcode");

		const input = String(args.join(""));
		const code = await db.findOne({ name: input });
		if (!code)
			return message.reply({
				content: `Wrong giftcode!`,
			});

		if (!code.remain || code.remain === 0)
			return message.reply({
				content: `Out of giftcode!`,
			});

		if (code.claimed.includes(message.author.id))
			return message.reply({
				content: `You had already redeemed this code!`,
			});

		let o = code.prize.owlet || 10;

		await Player.owlet(o);

		await db.updateOne(
			{
				name: input,
			},
			{
				$push: {
					claimed: message.author.id,
				},
				$inc: {
					remain: -1,
				},
			}
		);

		const Embed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setAuthor({
				name: message.author.tag,
			})
			.setTitle(code.quote.toUpperCase())
			.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
			.setDescription(
				`**${message.author.username}** is redeeming giftcode. There ${
					o > 1 ? "are" : "is"
				} **${o.toLocaleString()} owlet${
					o > 1 ? "s" : ""
				}**.\n**${o.toLocaleString()} owlet${o > 1 ? "s" : ""}** ha${
					o > 1 ? "ve" : "s"
				} been given into **${message.author.username}**'s inventory.`
			);

		return message.reply({
			embeds: [Embed],
			allowedMentions: {
				repliedUser: false,
			},
		});
	},
};
