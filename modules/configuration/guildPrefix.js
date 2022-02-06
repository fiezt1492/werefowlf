const { prefix } = require("../../config");
const defaultPrefix = prefix;

module.exports = {
	get(message) {
		return String(
			message.client.guildSettings.get(message.guild.id).prefix.toLowerCase()
		);
	},

	async set(message, prefix = defaultPrefix) {
		if (prefix.length >= 5 || prefix.length <= 0) return -1;
		try {
			const { client } = message;
			const DB = client.db.collection("guildSettings");
			await DB.updateOne(
				{
					gID: message.guild.id,
				},
				{
					$set: {
						// gID: message.guild.id,
						prefix: String(prefix).toLowerCase(),
					},
				},
				{
					upsert: true,
				}
			);

			let guildSettings = await client.guildSettings.get(message.guild.id);

			guildSettings.prefix = String(prefix).toLowerCase();

			client.guildSettings.set(message.guild.id, guildSettings);

			return await client.guildSettings.get(message.guild.id).prefix
		} catch (e) {
			console.log(e);
		}
	},
};
