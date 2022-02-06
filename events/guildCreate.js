const { prefix } = require("../config");
// const guildPrefix = require("../modules/configuration/guildPrefix")

module.exports = {
	name: "guildCreate",
	// skip: true,
	async execute(guild, client) {
		client.guildSettings.set(guild.id, {
			prefix: String(prefix).toLowerCase(),
			locale: "en"
		});
	},
};
