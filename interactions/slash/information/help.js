// Deconstructed the constants we need in this file.

const {
	MessageEmbed,
	MessageButton,
	MessageActionRow,
	MessageSelectMenu,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
// const { prefix } = require("../../../config");

module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription(
			"List all commands of bot or info about a specific command."
		)
		.addStringOption((option) =>
			option
				.setName("command")
				.setDescription("The specific command to see the info of.")
				.setRequired(false)
		),
	once: true,

	async execute(interaction, ONCE, i18n) {
		const { client } = interaction;
		const { commands } = client;
		// const slashCommands = client.slashCommands;
		const prefix = client.guildSettings
			.get(interaction.guildId)
			.prefix.toLowerCase();
		const string = interaction.options.getString("command");

		if (!string) {
			const formatString = (str) =>
				`${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;
			let categories = [...new Set(commands.map((cmd) => cmd.category))];

			categories = categories.filter((cate) => cate !== "private");

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
				.setFooter({ text: `Select one of these categories below` });

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
									value: cmd.category.toLowerCase(),
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

			// Replies to the interaction!

			await interaction.reply({
				embeds: [helpEmbed],
				components: components(false),
			});

			const msg = await interaction.fetchReply();
			// console.log(msg)

			ONCE.set(interaction.user.id, {
				name: this.data.name,
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
				ONCE.delete(interaction.user.id);
			});
		} else {
			const command =
				commands.get(string.toLowerCase()) ||
				commands.find(
					(c) => c.aliases && c.aliases.includes(string.toLowerCase())
				);

			if (!command || command.ownerOnly || command.category == "private") {
				return interaction.reply({
					content: "That's not a valid command!",
					ephemeral: true,
				});
			}

			let commandEmbed = new MessageEmbed()
				.setColor("RANDOM")
				.setDescription(
					`Find information on the command provided.\nMandatory arguments \`[]\`, optional arguments \`<>\`.`
				)
				.setTitle(command.name);

			if (command.description)
				commandEmbed.addField("Description", `${command.description}`);

			if (command.aliases && command.aliases.length > 0)
				commandEmbed
					.addField(
						i18n.__("help.commandEmbed.fieldAliases"),
						`\`${command.aliases.join(", ")}\``,
						true
					)
					.addField(
						i18n.__("help.commandEmbed.fieldCooldown"),
						`${command.cooldown || 3} second(s)`,
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

			return interaction.reply({ embeds: [commandEmbed] });
		}
	},
};
