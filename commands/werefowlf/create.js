const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = {
	name: "create",
	description: "",
	category: "werefowlf",
	aliases: ["host"],
	usage: "",
	cooldown: 5,
	args: false,
	ownerOnly: false,
	once: true,
	permissions: ["SEND_MESSAGES"],

	async execute(message, args, guildSettings, ONCE, i18n) {
		const { client } = message;

		const Embed = new MessageEmbed()
			.setColor("RANDOM")
			.setTitle("WEREWOWLF LOBBY")
			.setAuthor({
				name: "Host: " + message.author.tag,
			})
			.addField("In Lobby", "0");

		const components = (state) => [
			new MessageActionRow().addComponents(
				new MessageButton()
					.setStyle("PRIMARY")
					.setCustomId("join")
					.setDisabled(state)
					.setLabel("Join")
			),
			new MessageActionRow().addComponents(
				new MessageButton()
					.setStyle("DANGER")
					.setCustomId("cancel")
					.setDisabled(state)
					.setLabel("Cancel")
			),
		];

		const msg = await message.reply({
			embeds: [Embed],
			components: components(false),
			allowedMentions: {
				repliedUser: false,
			},
		});

		ONCE.set(message.author.id, {
			name: this.name,
			gID: msg.guild.id,
			cID: msg.channel.id,
			mID: msg.id,
			mURL: msg.url,
		});

		const db = await client.db.collection("game");
		

		const msgCol = msg.createMessageComponentCollector({
			componentType: "BUTTON",
			time: 60000,
		});

		msgCol.on("collect", (i) => {
			if (i.customId === "cancel") {


				return msgCol.stop();
			}

			msgCol.resetTimer();
		});

		msgCol.on("end", (collected, reason) => {
			// msg.edit({ components: components(true) });
			ONCE.delete(message.author.id);
			// if (reason === "time")
			// 	msg.edit({ components: client.disableComponent(msg) });
		});
	},
};
