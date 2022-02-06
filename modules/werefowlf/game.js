// const { prefix } = require("../../config");
// const defaultPrefix = prefix;
// const i18n = require("../util/i18n");

module.exports = {
	get(message) {
        const { client } = message;
		const DB = client.db.collection("game");

        
		
	},

	async create(message) {
		try {
			const { client } = message;
			const DB = client.db.collection("game");
			await DB.updateOne(
				{
					gID: message.guild.id,
				},
				{
					$set: {
						locale: String(locale).toLowerCase(),
					},
				},
				{
					upsert: true,
				}
			);

			
		} catch (e) {
			console.log(e);
		}
	},

    async add(message, user) {

    }
};
