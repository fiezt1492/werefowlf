const Discord = require("discord.js");
const stringTable = require("string-table");

module.exports = {
	name: "shards",

	/** You need to uncomment below properties if you need them. */
	description: "Watching shards informations",
	category: "information",
	aliases: ["shard", "stat", "stats"],
	usage: "",
	permissions: "SEND_MESSAGES",

	async execute(message, args, guildSettings) {
		const { client } = message;

		// let shards = await client.ws.shards
		let array = [];

		let shards = await client.shard.broadcastEval((client) => {
			// console.log(client)
			return [
				client.shard.ids,
				client.ws.status,
				client.ws.ping,
				client.users.cache.size,
				client.guilds.cache.size,
				(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1) +
					"/" +
					(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(1) +
					"MB",
			];
		});

		shards.forEach((s) => {
			return array.push({
				id: s[0],
				status: s[1],
				ping: s[2],
				users: s[3],
				guilds: s[4],
				memory: s[5],
			});
		});

		// let a = shards.map(s => {})

		let des = stringTable.create(array, {
			// headers: ['ID', 'STATUS', 'PING'],
			capitalizeHeaders: true,
			formatters: {
				id: function (value, header) {
					return `#${value}`;
				},
				status: function (value, header) {
					return shardStatus(value);
				},
			},
		});

		// console.log(values)

		const embed = new Discord.MessageEmbed()
			.setTitle("SHARDS")
			.setColor("RANDOM")
			.setDescription("```" + des + "```")
			.setFooter({
				text: `${message.guild.name}'s Shard: #${message.guild.shardId} | Guild ID: ${message.guild.id}`,
			})
			.setTimestamp();

		return message.reply({
			embeds: [embed],
			allowedMentions: {
				repliedUser: false,
			},
		});
	},
};

function shardStatus(value) {
	value = Number(value);
	if (isNaN(value))
		return console.error(`[SHARD STATUS CONVERTER]: Input is not a integer`);
	switch (value) {
		case 0:
			return `READY`;
		case 1:
			return `CONNECTING`;
		case 2:
			return `RECONNECTING`;
		case 3:
			return `IDLE`;
		case 4:
			return `NEARLY`;
		case 5:
			return `DISCONNECTED`;
		case 6:
			return `WAITING_FOR_GUILDS`;
		case 7:
			return `IDENTIFYING`;
		case 8:
			return `RESUMING`;
		default:
			return `UNKNOWN`;
	}
}
