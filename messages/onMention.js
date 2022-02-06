// const { prefix } = require("../config.js");
const guildPrefix = require("../modules/configuration/guildPrefix");

module.exports = {
	async execute(message, i18n) {
		return message.reply(
			i18n.__mf("onMention.reply", {
				prefix: message.client.prefix.get(message),
			})
		);
	},
};
