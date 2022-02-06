const Discord = require("discord.js");
// const { collection } = require("../../databases/mongo");
const { millify } = require("millify");

module.exports = {
	name: "daily",
	description: "Get daily reward",
	category: "economy",
	aliases: [""],
	usage: "",
	cooldown: 3,
	// mongoCD: 24 * 60 * 60,
	args: false,
	ownerOnly: false,
	permissions: ["SEND_MESSAGES"],

	async execute(message, args, guildSettings, Player) {
		const { client } = message;

		const mongoCD = await Player.cooldownsGet(this.name);
		if (mongoCD) {
			if (Date.now() - mongoCD.timestamps < mongoCD.duration) {
				return message.reply({
					content: `You can use \`${this.name}\` command <t:${Math.floor(
						(mongoCD.timestamps + mongoCD.duration) / 1000
					)}:R>`,
				});
			} else await Player.cooldownsPull(this.name);
		}

		const Embed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setTitle("GET YOUR DAILY REWARD BY CLICK ON THE ABOVE BUTTON!");

		const components = (state) => [
			new Discord.MessageActionRow().addComponents(
				new Discord.MessageButton()
					.setCustomId("dailyreward")
					.setDisabled(state)
					.setLabel("REWARD")
					.setStyle("SUCCESS")
			),
		];

		const msg = await message.reply({
			embeds: [Embed],
			components: components(false),
			allowedMentions: {
				repliedUser: false,
			},
		});

		const filter = (interaction) => interaction.user.id === message.author.id;

		const msgCol = msg.createMessageComponentCollector({
			filter,
			componentType: "BUTTON",
			time: 60000,
		});

		msgCol.on("collect", () => {
			return msgCol.stop();
		});

		msgCol.on("end", async (collected, reason) => {
			if (reason === "time") {
				Embed.color = "RED";
				return msg.edit({
					embeds: [Embed],
					components: components(true),
				});
			}

			const chance = Math.round(Math.random() * 99) + 1;
			let random;
			if (chance < 1) random = Math.round(Math.random() * 9999) + 1;
			else random = Math.round(Math.random() * 999) + 1;
			// console.log(random);
			const string = millify(random);
			await Player.cooldownsPush(this.name, 24 * 60 * 60 * 1000);
			await Player.owlet(random);
			Embed.title = "SUCCESS!";
			Embed.color = "GREEN";
			Embed.setDescription(`You received \`${string}\` owlets!`);

			if (collected)
				return collected.map(async (btn) => {
					if (btn.replied === false)
						await btn.update({
							embeds: [Embed],
							components: components(true),
						});
				});
		});
	},
};
