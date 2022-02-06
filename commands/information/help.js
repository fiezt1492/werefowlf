// const { prefix } = require("./../../config");
const {
	MessageEmbed,
	MessageActionRow,
	MessageSelectMenu,
	MessageButton,
} = require("discord.js");
// const i18n = require("../../modules/util/i18n");

module.exports = {
	name: "help",
	description: "List all commands of bot or info about a specific command.",
	aliases: ["commands"],
	category: "information",
	usage: "<command name>",
	once: true,
	cooldown: 5,

	async execute(message, args, guildSettings, ONCE, i18n) {
		const { commands } = message.client;
		// const slashCommands = message.client.slashCommands;
		const prefix = guildSettings.prefix;

		if (!args.length) {
			const formatString = (str) =>
				`${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

			let categories = [
				...new Set(
					commands
						.filter((cmd) => cmd.category !== "private")
						.map((cmd) => cmd.category)
				),
			];

			const commandsList = categories.map((cate) => {
				const getCommands = commands
					.filter((cmd) => cmd.category === cate)
					.map((cmd) => {
						return {
							name: cmd.name || null,
							aliases: cmd.aliases || null,
							description: cmd.description || null,
							usage: cmd.usage || null,
						};
					});

				return {
					category: cate,
					commands: getCommands,
				};
			});

			// const slashHelpEmbed = new MessageEmbed()
			// 	.setColor("RANDOM")
			// 	.setTitle("List of all my slash commands")
			// 	.setDescription(
			// 		"`" + slashCommands.map((command) => command.data.name).join("`, `") + "`"
			// 	);

			let helpEmbed = new MessageEmbed()
				.setColor("RANDOM")
				.setURL(process.env.URL)
				.setTitle(i18n.__("help.helpEmbed.title"))
				.setDescription(
					i18n.__mf("help.helpEmbed.description", {
						prefix: prefix,
					})
				)
				.addField(
					i18n.__("help.helpEmbed.field0.title"),
					"**[Youtube](https://www.youtube.com/channel/UCEG5sgFKieaUuHsu5VG-kBg)** | **[Discord](https://discord.io/owlvernyte+)** | **[Facebook](https://www.facebook.com/owlvernyte)**"
				)
				.addField(
					i18n.__("help.helpEmbed.field1.title"),
					`**[Playerduo](https://playerduo.com/owlvernyte)** | **[buymeacoffee](https://buymeacoffee.com/fiezt)**`
				)
				.setFooter({ text: i18n.__("help.helpEmbed.footer") });

			const components = (state) => [
				new MessageActionRow().addComponents(
					new MessageSelectMenu()
						.setCustomId("helpPanel")
						.setPlaceholder(i18n.__("help.components.placeholder"))
						.setDisabled(state)
						.addOptions({
							label: i18n.__("help.components.home.label"),
							value: "home",
							description: i18n.__("help.components.home.description"),
						})
						.addOptions({
							label: i18n.__("help.components.slash.label"),
							value: "slashCommandPanel",
							description: i18n.__("help.components.slash.description"),
						})
						.addOptions(
							commandsList.map((cmd) => {
								return {
									label: formatString(cmd.category),
									value: cmd.category,
									description: i18n.__mf(
										"help.components.category.description",
										{ category: formatString(cmd.category) }
									),
								};
							})
						)
				),
				new MessageActionRow().addComponents(
					new MessageButton()
						.setStyle("LINK")
						.setURL("https://top.gg/bot/853623967180259369/invite")
						.setLabel(i18n.__("help.components.invite")),
					new MessageButton()
						.setStyle("LINK")
						.setURL("https://top.gg/bot/853623967180259369/vote")
						.setLabel(i18n.__("help.components.vote")),
					new MessageButton()
						.setStyle("LINK")
						.setURL("https://discord.io/owlvernyte")
						.setLabel(i18n.__("help.components.supportserver"))
				),
			];

			const msg = await message.reply({
				embeds: [helpEmbed],
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

			const msgCol = msg.createMessageComponentCollector({
				componentType: "SELECT_MENU",
				time: 60000,
			});

			msgCol.on("collect", () => {
				msgCol.resetTimer();
			});

			msgCol.on("end", () => {
				msg.edit({ components: components(true) });
				ONCE.delete(message.author.id);
			});
		} else {
			const command =
				commands.get(args.join(" ").toLowerCase()) ||
				commands.find(
					(c) => c.aliases && c.aliases.includes(args.join(" ").toLowerCase())
				);

			if (!command || command.ownerOnly || command.category === "private") {
				return message.reply({
					content: i18n.__("help.invalid"),
				});
			}

			let commandEmbed = new MessageEmbed()
				.setColor("RANDOM")
				.setDescription(i18n.__("help.commandEmbed.description"))
				.setTitle(command.name);

			if (command.description)
				commandEmbed.addField(
					i18n.__("help.commandEmbed.fieldDescription"),
					`${command.description}`
				);

			if (command.aliases && command.aliases.length > 0)
				commandEmbed
					.addField(
						i18n.__("help.commandEmbed.fieldAliases"),
						`\`${command.aliases.join(", ")}\``,
						true
					)
					.addField(
						i18n.__("help.commandEmbed.fieldCooldown"),
						`${command.cooldown || 3}s`,
						true
					);
			if (command.usage)
				commandEmbed.addField(
					i18n.__("help.commandEmbed.fieldUsage"),
					`\`${prefix}${command.name} ${command.usage}\``,
					true
				);
			else
				commandEmbed.addField(
					i18n.__("help.commandEmbed.fieldUsage"),
					`\`${prefix}${command.name}\``,
					true
				);

			return message.reply({
				embeds: [commandEmbed],
				allowedMentions: {
					repliedUser: false,
				},
			});
		}
	},
};
