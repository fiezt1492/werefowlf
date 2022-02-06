const Discord = require("discord.js");
const { millify } = require("millify");
const stringTable = require("string-table");

module.exports = {
	name: "leaderboard",
	description: "Show your guild top players",
	category: "economy",
	aliases: ["top", "leaderboards"],
	usage: "",
	cooldown: 10,
	args: false,
	ownerOnly: false,
	permissions: ["SEND_MESSAGES"],

	async execute(message, args, guildSettings, Player) {
        const msg = await message.reply({
            content: `Please wait, im doing stuffs...`
        })
		const { client, guild } = message;
		const collection = new Discord.Collection();
		await Promise.all(
			guild.members.cache.map(async (member) => {
				if (member.user.bot) return;
				const id = member.id;
				const b = await client.bal(id);
				if (b === null) return;
				const bal = b.owlet + b.bank;
				return b !== 0
					? collection.set(id, {
							id,
							bal,
					  })
					: null;
			})
		);

		const data = collection.sort((a, b) => b.bal - a.bal);
		// console.log(data);

		const keys = collection.map((v) => v.id);

		const array = data.first(10).map((v, i) => {
			const bal = millify(v.bal);
			return {
				top: String(i + 1).padStart(2, 0),
				owlets: bal,
				players: client.users.cache.get(v.id).tag,
			};
		});

		const table = stringTable.create(array, {
			capitalizeHeaders: true,
			formatters: {
				top: function (value, header) {
					return `#${value}`;
				},
			},
		});

		const Embed = new Discord.MessageEmbed()
			.setTitle(`${guild.name}'s Top ${array.length}`)
			.setColor("RANDOM")
			.setDescription("```" + table + "```")
			.setFooter({
				text:
					`${message.author.tag} • #` + (keys.indexOf(message.author.id) + 1),
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
			});

		return msg.edit({
            content: null,
			embeds: [Embed],
			allowedMentions: {
				repliedUser: false,
			},
		});
	},
};
