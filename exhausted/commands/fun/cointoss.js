const Discord = require("discord.js");

module.exports = {
	name: "cointoss",
	description: "Toss a coin",
	category: "fun",
	aliases: ["ct", "coinflip", "flipcoin", "tosscoin", "cf"],
	usage: "",
	cooldown: 5,
	args: false,
	ownerOnly: false,
	permissions: ["SEND_MESSAGES"],

	async execute(message, args, guildSettings) {
		// const { client } = message;
		coin = ["Head", "Tail"];

		let c = coin[Math.floor(Math.random() * coin.length)];

		if (c === "Head") {
			var i = "https://media4.giphy.com/media/gK6L3woXfEALy3cmHV/giphy.gif";
		} else {
			var i = "http://i.imgur.com/IcigPaK.gif";
		}

		const Embed = new Discord.MessageEmbed()
			.setTitle(c)
			.setImage(i)
			.setColor("RANDOM");
		// .setTimestamp()

		return message.reply({
			embeds: [Embed],
			allowedMentions: {
				repliedUser: false,
			},
		});
	},
};
