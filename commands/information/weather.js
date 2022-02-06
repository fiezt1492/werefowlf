const Discord = require("discord.js");
// const fetch = require("node-fetch");
const weather = require("weather-js");

module.exports = {
	name: "weather",
	description: "Get weather forecast in ascii",
	category: "information",
	aliases: [],
	usage: "<location>",
	permissions: "SEND_MESSAGES",

	async execute(message, args, guildSettings) {
		// const { client } = message;
		let location = args.length ? args.join(" ") : "700000";

		let embed = new Discord.MessageEmbed()
			.setTitle("RESULT")
			.setColor("RANDOM");

		weather.find({ search: location, degreeType: "C" }, function (err, result) {
			if (err) return message.reply(err);

			if (result.size < 1 || !result || result.size == 0)
				return message.reply("Not found");
			// let json = JSON.stringify(result, null, 2);

			// console.log(json);
			// console.log(result);
			try {
				result.map((c) =>
					embed.addField(
						`${c.location.name}`,
						`${c.current.skytext} ${c.current.temperature}°${c.location.degreetype}`
					)
				);
				if (embed.fields.length == 0) return message.reply("Not found");
				message.reply({
					embeds: [embed],
					allowedMentions: {
						repliedUser: false,
					},
				});
			} catch (err) {
				return message.reply("Unable to get data");
			}
		});

		// return message.channel.send({ embeds: [embed] });
	},
};
