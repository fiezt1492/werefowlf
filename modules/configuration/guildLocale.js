// const { prefix } = require("../../config");
// const defaultPrefix = prefix;
const i18n = require("../util/i18n");

module.exports = {
	get(message) {
		return String(
			message.client.guildSettings.get(message.guild.id).locale.toLowerCase()
		);
	},

	async set(message, locale = "en") {
		if (!isNaN(locale) || typeof locale !== "string") return -1;
		const locales = i18n.getLocales();
		if (!locales.includes(locale)) return -1;
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
						locale: String(locale).toLowerCase(),
					},
				},
				{
					upsert: true,
				}
			);

			let guildSettings = await client.guildSettings.get(message.guild.id);

			guildSettings.locale = String(locale).toLowerCase();

			client.guildSettings.set(message.guild.id, guildSettings);

			return await client.guildSettings.get(message.guild.id).locale
		} catch (e) {
			console.log(e);
		}
	},
};
