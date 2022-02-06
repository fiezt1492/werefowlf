const Discord = require("discord.js");

module.exports = {
	name: "addcode",
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

		if (code)
			return message.reply({
				content: "Code Existed",
			});

		let owlet, remain, quote;

		if (message.content.includes("--") && args.length >= 3) {
			owlet = Number(args[args.indexOf("--o") + 1]);
			remain = Number(args[args.indexOf("--r") + 1]);
			quote = String(args[args.indexOf("--q") + 1]);
		}

		if (isNaN(owlet)) owlet = 1;
		if (isNaN(remain)) remain = 1;
		if (!isNaN(quote)) quote = input;

		await db.insertOne({
			name: input,
			prize: {
				owlet: owlet ? owlet : 1,
				items: [],
			},
			remain: remain ? remain : 1,
			quote: quote ? quote : input,
			claimed: [],
		});

		return message.react("✅");
	},
};
