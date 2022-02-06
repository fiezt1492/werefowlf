const Discord = require("discord.js");

module.exports = {
	name: "link",
	description: "Send bot invitation",
	category: "information",
	aliases: ["vote", "invite", "links"],
	usage: "",
	cooldown: 1,
	args: false,
	ownerOnly: false,
	permissions: ["SEND_MESSAGES"],

	async execute(message, args, guildSettings) {
		// const { client } = message;
		let components = new Discord.MessageActionRow().addComponents(
			new Discord.MessageButton()
				.setLabel("Invite me")
				.setStyle("LINK")
				.setURL(
					`https://discord.com/api/oauth2/authorize?client_id=853623967180259369&permissions=8&scope=applications.commands%20bot`
				),
			new Discord.MessageButton()
				.setLabel("Vote me")
				.setStyle("LINK")
				.setURL(`https://top.gg/bot/853623967180259369/vote`)
		);

		if (message.guild.id === "830110554604961824")
			components.addComponents(
				new Discord.MessageButton()
					.setLabel("Vote this server")
					.setStyle("LINK")
					.setURL(`https://top.gg/servers/830110554604961824/vote`)
			);
		return message.reply({
			content: `Here you go.`,
			components: [components],
			allowedMentions: {
				repliedUser: false,
			},
		});
	},
};
