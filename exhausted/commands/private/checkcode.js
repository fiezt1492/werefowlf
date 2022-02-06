const Discord = require("discord.js");

module.exports = {
	name: "checkcode",
	description: "",
	category: "private",
	aliases: [],
	usage: "",
	cooldown: 5,
	args: true,
	ownerOnly: true,
	once: false,
	permissions: ["SEND_MESSAGES"],

	async execute(message, args, guildSettings, Player, ONCE) {
		const { client } = message;

		const db = client.db.collection("giftcode");

		let input = String(args[0].toLowerCase());
		const code = await db.findOne({ name: input });

		if (!code) return message.react("❌");

		let prize = code.prize;
		let keysPrize = Object.keys(code.prize);

		let prizeField = [];

		for (let i in keysPrize) {
			prizeField.push(`**${keysPrize[i]}**: ${prize[keysPrize[i]]}`);
		}

		const Embed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setTitle(code.name)
			.addField(`Prize`, prizeField.join("\n"))
			.addField(`Remain`, `${code.remain}`)
			.addField(`Quote`, code.quote)
			.addField(
				`Claimed`,
				code.claimed.length <= 0
					? `None`
					: "`" + code.claimed.join("`, `") + "`"
			);

		return message.reply({
			embeds: [Embed],
		});
	},
};
