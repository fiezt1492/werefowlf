const { prefix } = require("../config.js");
const defaultPrefix = prefix;

module.exports = {
	name: "ready",
	once: true,

	async execute(client) {
		// client.user.setPresence({})
		const rDB = client.db.collection("restart");
		const gDB = client.db.collection("guildSettings");

		const restarted = await rDB.findOne({ uID: "445102575314927617" });

		if (restarted) {
			const channel = await client.channels.fetch(restarted.cID);
			const m = await channel.messages.fetch(restarted.mID);
			m.edit("Restarted!").then(rDB.deleteOne({ uID: "445102575314927617" }));
			console.log("[RESTART] RESTARTED THE BOT");
		}

		try {
			client.user.setPresence({
				status: "online",
				afk: false,
				activities: [
					{
						name: `${defaultPrefix}help | Ma cho'`,
						type: 0,
					},
				],
			});

			const guilds = await client.guilds.cache.map((guild) => guild.id);

			guilds.forEach(async (id) => {
				const guild = await gDB.findOne(
					{
						gID: id,
					},
					{
						prefix: 1,
						locale: 1,
					}
				);

				client.guildSettings.set(id, {
					prefix: guild
						? guild.prefix
							? guild.prefix
							: defaultPrefix
						: defaultPrefix,
					locale: guild ? (guild.locale ? guild.locale : "en") : "en",
				});

				if (guilds.indexOf(id) === guilds.length - 1) {
					client.ready = true;
				}
			});
		} catch (error) {
			console.log(error);

			client.user.setPresence({
				status: "idle",
				afk: false,
				activities: [
					{
						name: `${defaultPrefix}help | Error`,
						type: 0,
					},
				],
			});
		}

		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};
