// const { prefix } = require("../config");
// const guildPrefix = require("../modules/configuration/guildPrefix")

module.exports = {
	name: "guildDelete",
	// skip: true,
	async execute(guild, client) {
		client.guildSettings.delete(guild.id);
	},
};
