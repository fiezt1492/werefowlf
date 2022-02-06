module.exports = {
	name: "restart",
	description: "Restart the bot",
	category: "private",
	// args: true,
	ownerOnly: true,

	async execute(message, args) {
		const { client } = message;
		const rDB = client.db.collection("restart");
		const m = await message.channel.send("Restarting...");

		const restarted = await rDB.findOne({ uID: message.author.id });

		if (restarted) {
			await rDB.updateOne({
				uID: message.author.id,
				cID: m.channel.id,
				mID: m.id,
			});
		} else {
			await rDB.insertOne({
				uID: message.author.id,
				cID: m.channel.id,
				mID: m.id,
			});
		}
		console.log("[RESTART] THE BOT IS RESTARTING");
		process.exit();
	},
};
