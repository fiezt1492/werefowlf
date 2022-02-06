// Declares constants (destructured) to be used in this file.

const { Collection } = require("discord.js");
const { owner } = require("../config");
// const mongo = require("../databases/mongo");
// const Players = require("../modules/economy/players");
const Discord = require("discord.js");
const ONCE = new Map();

// Prefix regex, we will use to match in mention prefix.

const escapeRegex = (string) => {
	return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

module.exports = {
	name: "messageCreate",

	async execute(message) {
		// Declares const to be used.

		const { client, guild, channel, content, author } = message;

		// Checks if the bot is mentioned in the message all alone and triggers onMention trigger.
		// You can change the behavior as per your liking at ./messages/onMention.js
		if (!client.ready) return;

		if (client.user.presence.status !== "online") return;

		if (message.author.bot || message.channel.type === "dm") return;

		// require("../modules/util/message")(message)

		// const checkPrefix = (
		// 	await require("../modules/configuration/guildPrefix").get(message)
		// ).toLowerCase();

		const guildSettings = await client.guildSettings.get(guild.id);
		// const checkPrefix = prefix
		// console.log(guildSettings)
		const prefix = guildSettings.prefix;

		const i18n = client.i18n
		i18n.setLocale(guildSettings.locale);

		if (
			message.content == `<@${client.user.id}>` ||
			message.content == `<@!${client.user.id}>`
		) {
			require("../messages/onMention").execute(message, i18n);
			return;
		}

		const prefixRegex = new RegExp(
			`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`
		);

		// Checks if message content in lower case starts with bot's mention.

		if (!prefixRegex.test(content.toLowerCase())) return;

		const [matchedPrefix] = content.toLowerCase().match(prefixRegex);

		const args = content.slice(matchedPrefix.length).trim().split(/ +/);

		const commandName = args.shift().toLowerCase();

		// Check if mesage does not starts with prefix, or message author is bot. If yes, return.

		if (!message.content.startsWith(matchedPrefix) || message.author.bot)
			return;

		const command =
			client.commands.get(commandName) ||
			client.commands.find(
				(cmd) => cmd.aliases && cmd.aliases.includes(commandName)
			);

		// It it's not a command, return :)

		if (!command) return;

		if (command.once === true) {
			if (ONCE.has(author.id)) {
				const commandOnce = ONCE.get(author.id);

				const onceEmbed = new Discord.MessageEmbed()
					.setTitle(i18n.__("ONCE.title"))
					.setColor("RED")
					.setDescription(
						i18n.__mf("ONCE.description", {
							command: commandOnce.name,
						})
						// `You need to finish your previous \`${commandOnce.name}\` command first!`
					);

				return message.reply({
					// content: `**[Error]** You need to finish your previous \`${command.name}\` command first!`,
					embeds: [onceEmbed],
					components: [
						{
							type: 1,
							components: [
								{
									type: 2,
									style: 5,
									label: i18n.__mf("ONCE.label", {
										command: commandOnce.name,
									}),
									// `Forward to "${commandOnce.name}" command`,
									// url: `https://discord.com/channels/${already.gID}/${already.cID}/${already.mID}`
									url: commandOnce.mURL,
								},
							],
						},
					],
				});
			}
		}

		if (command.ownerOnly && message.author.id !== owner) {
			return;
		}

		if (command.maintain) {
			return message.reply({
				content: i18n.__("messageCreate.maintain"),
				// "This command is currently under maintenance. Please wait until we completely fixed it.",
			});
		}

		// Author perms property

		if (command.permissions) {
			const authorPerms = message.channel.permissionsFor(message.author);
			if (!authorPerms || !authorPerms.has(command.permissions)) {
				return message.reply({
					content: i18n.__("messageCreate.permissions"),
					// "You can not do this!"
				});
			}
		}

		if (command.guildOwner === true) {
			if (author.id !== guild.ownerId)
				return message.reply(
					i18n.__("messageCreate.guildOwner")
					// "This command is only for guild owner."
				);
		}

		// Args missing

		if (command.args && !args.length) {
			let reply = i18n.__("messageCreate.args");
			// `You didn't provide any arguments!`;

			if (command.usage) {
				reply += i18n.__mf("messageCreate.usage", {
					prefix: prefix,
					command: command.name,
					usage: command.usage,
				});
				// `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
			}

			if (command.options && command.options.length > 0) {
				let options = command.options
					.map((o) => `${prefix}${command.name} ${o.toLowerCase()}`)
					.join("\n");

				reply += i18n.__("messageCreate.options", {
					options: options,
				});
				// `\n\`\`\`Usage:\n${options}\`\`\``;
			}

			return message.reply({ content: reply });
		}
		// else if (
		// 	command.args &&
		// 	args.length &&
		// 	command.options &&
		// 	command.options.length > 0
		// ) {
		// 	let options = command.options
		// 		.map((o) => `${prefix}${command.name} ${o.toLowerCase()}`)
		// 		.join("\n");
		// 	let reply = `Wrong input option.\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\`\n\`\`\`Usage:\n${options}\`\`\``;
		// 	if (!command.options.includes(args[0]))
		// 		return message.reply({ content: reply });
		// }

		// Cooldowns

		const { cooldowns } = client;

		if (!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 1) * 1000;

		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

			if (now < expirationTime) {
				// const timeLeft = (expirationTime - now) / 1000;
				return message.reply({
					content: i18n.__mf("common.cooldown", {
						command: command.name,
						time: Math.floor(expirationTime / 1000),
					}),
					// `You can use \`${command.name}\` command <t:${Math.floor(
					// 	expirationTime / 1000
					// )}:R>`,
				});
			}
		}

		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

		// Rest your creativity is below.

		// execute the final command. Put everything above this.
		try {
			command.execute(message, args, guildSettings, ONCE, i18n);
		} catch (error) {
			console.error(error);
			message.reply({
				content: i18n.__("common.error"),
			});
		}
	},
};
