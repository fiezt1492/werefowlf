// const Discord = require("discord.js");

module.exports = {
	name: "pick",
	description: "pick a things from provided",
	category: "fun",
	aliases: ["choose"],
	usage: `[things to pick/choices then seperate them with comma ","]`,
	permissions: "SEND_MESSAGES",
	args: true,

	async execute(message, args, guildSettings) {
		// const { client } = message;
		let choices = args.join(" ").split(/\s*,+\s*/);

		if (choices.includes(""))
			return message.reply(
				`**[ERROR]** Null character are not allowed here. (Separate your options with \`,\`)`
			);
		const rs = choices[Math.floor(Math.random() * choices.length)];

		// const Embed = new Discord.MessageEmbed()
		// 	.setTitle("RESULT")
		// 	.setColor("RANDOM")
		// 	.setDescription(rs)
		// 	.setFooter(`Requested by ${message.author.tag}`)
		// 	.setTimestamp();

		return message.reply({
			content: `I chose \`${rs}\`.`,
			allowedMentions: {
				repliedUser: false,
			},
		});
	},
};
