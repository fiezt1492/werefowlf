// const Discord = require("discord.js");
const config = require("../../config");
const guildPrefix = require("../../modules/configuration/guildPrefix")

module.exports = {
	name: "prefix",
	description: "Change server prefix",
	category: "configuration",
	aliases: [],
	usage: "[options]",
	cooldown: 5,
	options: ["reset", "set", "get"],
	args: true,
	ownerOnly: false,
	guildOwner: true,
	permissions: ["ADMINISTRATOR"],
	guildOnly: true,

	async execute(message, args) {
		let option = String(args.shift())
		switch (option) {
			case "set":
				if (!args.length || !args[0])
					return message.reply(`Missing prefix to \`set\`.`);
				if (args[0].length > 5)
					return message.reply(
						`Prefix length limitation is **5**. Please make it shorter.`
					);
				try {
					await guildPrefix.set(message,args[0])
					return message.reply(
						`Your guild prefix has been set to \`${await guildPrefix.get(message)}\``
					);
				} catch (error) {
					console.log(error);
					return message.reply(`**[ERROR]** ${error.message}`);
				}
			case "get":
				return message.reply(
					`Your current guild prefix is \`${await guildPrefix.get(message)}\``
				);
			case "reset":
				try {
					await guildPrefix.set(message)
					return message.reply(
						`Your guild prefix has been reset to \`${config.prefix.toLowerCase()}\``
					);
				} catch (error) {
					console.log(error);
					return message.reply(`**[ERROR]** ${error.message}`);
				}
			default:
				return message.reply(
					`**[ERROR]** Invalid \`${option}\` option.\nType \`${await guildPrefix.get(message)}${this.name}\` to know how to use this.`
				);
		}
	},
};
