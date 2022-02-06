const Discord = require("discord.js");
const Players = require("../../modules/economy/players");
const { millify } = require("millify");

module.exports = {
	name: "give",
	description: "give money to some body",
	category: "economy",
	aliases: ["pay"],
	usage: "[mention a user] [owlet]",
	cooldown: 30,
	args: true,
	ownerOnly: false,
	permissions: ["SEND_MESSAGES"],

	async execute(message, args, guildSettings, Player) {
		const { client } = message;

		const member = message.mentions.members.first();

		if (!member)
			return message.reply({
				content: `You didn't mention anyone!`,
			});

		args = args.filter((e) => !(e.startsWith(`<@`) && e.endsWith(`>`)));

		// console.log(args)

		const amount = Number(args.shift());

		if (isNaN(amount) || amount <= 0)
			return message.reply({
				content: `Please provide a positive number!`,
			});

		const player = await Player.get();

		if (amount > player.owlet)
			return message.reply({
				content: `You dont have enough owlet!`,
			});

		const Target = new Players(member.id);
		await Target.set();

		await Player.owlet(-amount);
		await Target.owlet(amount);

		const string = millify(amount, {
			precision: 2,
		});

		return message.reply({
			content: `Successfully ${this.name} \`${string}\` owlets to ${member}!`,
		});
	},
};
