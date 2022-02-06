// const Discord = require("discord.js");
// const config = require("../../config");
// const guildPrefix = require("../../modules/configuration/guildPrefix");
const Discord = require("discord.js");

module.exports = {
	name: "settings",
	description: "Change guild settings",
	category: "configuration",
	aliases: [],
	// usage: "[options]",
	cooldown: 5,
	// options: ["reset", "set", "get"],
	// args: true,
	once: true,
	ownerOnly: false,
	guildOwner: true,
	permissions: ["ADMINISTRATOR"],

	async execute(message, args, guildSettings, Player, ONCE, i18n) {
		const { client } = message;
		const Embed = new Discord.MessageEmbed()
			.setTitle("Guild Settings Panel")
			.setDescription(
				`With this Settings Panel, you will able to config your server settings in just one command!`
			)
			.setColor("RANDOM")
			.setAuthor({
				name: message.guild.name,
				iconURL: message.guild.iconURL(),
			});
		// .addField("Prefix", await guildPrefix.get(message));

		const components = (state) => [
			new Discord.MessageActionRow().addComponents(
				new Discord.MessageButton()
					.setCustomId("prefixpanel")
					.setDisabled(state)
					.setLabel("Prefix")
					.setStyle("PRIMARY"),
				new Discord.MessageButton()
					.setCustomId("localepanel")
					.setDisabled(state)
					.setLabel("Locale/Language")
					.setStyle("PRIMARY"),
				new Discord.MessageButton()
					.setCustomId("cancel")
					.setDisabled(state)
					.setLabel("Cancel")
					.setStyle("DANGER")
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

		const filter = (i) => i.user.id === message.author.id;

		const msgCol = msg.createMessageComponentCollector({
			filter,
			componentType: "BUTTON",
			time: 60000,
		});

		msgCol.on("collect", (i) => {
			if (i.customId === "cancel") return msgCol.stop();
			// console.log(i)
			// i.update()
			msgCol.resetTimer();
			// console.log(msgCol)
		});

		msgCol.on("end", (collected, reason) => {
			ONCE.delete(message.author.id);
			if (reason === "time")
				msg.edit({ components: client.disableComponent(msg) });

			// if (collected)
			// 	return collected.map(async (btn) => {
			// 		if (btn.replied === false)
			// 			await btn.update({
			// 				components: client.disableComponent(msg.components),
			// 			});
			// 	});
		});
	},
};
