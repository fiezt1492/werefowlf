const Discord = require("discord.js");
// const guildPrefix = require("../../modules/configuration/guildPrefix");
module.exports = {
	name: "rps",
	description: "Play rock, paper, scissors",
	category: "fun",
	aliases: ["rockpaperscissors"],
	usage: "[choices / mention a user]",
	options: ["r", "p", "s", "@user"],
	cooldown: 5,
	args: true,
	ownerOnly: false,
	permissions: ["SEND_MESSAGES"],

	async execute(message, args, guildSettings) {
		const { client } = message;

		const opponent = await message.mentions.users.first();

		let selections = ["rock", "paper", "scissors", "r", "p", "s"];

		let choices = ["rock", "paper", "scissors"];

		if (!opponent) {
			let u = String(args.shift()).toLowerCase();

			if (selections.includes(u)) {
				if (selections.indexOf(u) > 2)
					u = selections[selections.indexOf(u) - 3];

				let c = choices[Math.floor(Math.random() * choices.length)];

				let result = RPS(u, c);
				switch (result) {
					case 0:
						return message.reply(
							`**[BOT]** choice: *${c}* \`=>\` **[RESULT]** TIE :/`
						);
					case 1:
						return message.reply(
							`**[BOT]** choice: *${c}* \`=>\` **[RESULT]** ${message.author.username} won!`
						);
					case 2:
						return message.reply(
							`**[BOT]** choice: *${c}* \`=>\` **[RESULT]** ${message.author.username} lose!`
						);
					default:
						return message.reply(`**[ERROR RPS]** Code: ${result}`);
				}
			} else {
				return message.reply(
					`**[ERROR]** Invalid input. Type \`${guildSettings.prefix}help ${this.name}\` for more infomation.`
				);
			}
		} else {
			if (opponent.id === message.author.id)
				return message.reply(`You can't play against yourself!`);

			buttonRPS(Discord, message, opponent, opponent.bot);
		}
	},
};

const RPS = (player1, player2) => {
	let selections = ["rock", "paper", "scissors", "r", "p", "s"];

	if (!selections.includes(player1) || !selections.includes(player2)) return -1;

	if (selections.includes(player1) && selections.indexOf(player1) > 2)
		player1 = selections[selections.indexOf(player1) - 3];
	if (selections.includes(player2) && selections.indexOf(player2) > 2)
		player2 = selections[selections.indexOf(player2) - 3];

	if (player1 === player2) return 0;

	if (
		(player1 == "rock" && player2 == "scissors") ||
		(player1 == "paper" && player2 == "rock") ||
		(player1 == "scissors" && player2 == "paper")
	)
		return 1;

	if (
		(player1 == "paper" && player2 == "scissors") ||
		(player1 == "rock" && player2 == "paper") ||
		(player1 == "scissors" && player2 == "rock")
	)
		return 2;

	return -2;
};

const buttonRPS = async (Discord, message, opponent, bot = false) => {
	const Embed = new Discord.MessageEmbed()
		.setAuthor({
			name: message.author.tag,
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
		})
		.setTitle(`${message.author.username} vs ${opponent.username}`)
		.setDescription(`**ROCK PAPER SCISSORS WAR!**`)
		.setColor("RANDOM")
		.setFooter({
			text: opponent.tag,
			iconURL: opponent.displayAvatarURL({ dynamic: true }),
		});

	const components = (state) => [
		new Discord.MessageActionRow().addComponents(
			new Discord.MessageButton()
				.setCustomId("rock")
				.setLabel("ROCK")
				.setEmoji("✊")
				.setDisabled(state)
				.setStyle("SECONDARY"),
			new Discord.MessageButton()
				.setCustomId("paper")
				.setLabel("PAPER")
				.setEmoji("✋")
				.setDisabled(state)
				.setStyle("SECONDARY"),
			new Discord.MessageButton()
				.setCustomId("scissors")
				.setLabel("SCISSORS")
				.setEmoji("✌")
				.setDisabled(state)
				.setStyle("SECONDARY")
		),

		new Discord.MessageActionRow().addComponents(
			new Discord.MessageButton()
				.setCustomId("rps-cancel")
				.setLabel("Cancel")
				.setDisabled(state)
				.setStyle("DANGER")
		),
	];

	const msg = await message.reply({
		content: `<@!${message.author.id}> **VS** <@!${opponent.id}>`,
		embeds: [Embed],
		components: components(false),
	});

	const filter = (i) =>
		i.user.id === message.author.id || i.user.id === opponent.id;

	const msgCol = msg.createMessageComponentCollector({
		filter,
		componentType: "BUTTON",
		time: 60000,
	});

	let game = new Map();

	msgCol.on("collect", async (interaction) => {
		// if (game.has(interaction.user.id))
		if (interaction.customId === "rps-cancel") return msgCol.stop("CANCEL");

		game.set(interaction.user.id, interaction.customId);

		if (bot === true) {
			let choices = ["rock", "paper", "scissors"];
			let choice = choices[Math.floor(Math.random() * choices.length)];
			game.set(opponent.id, choice);
		}

		if (game.size === 2) return msgCol.stop();
		// console.log(game);
		// console.log(interaction)
		await interaction.update({ components: components(false) });
	});

	msgCol.on("end", async (collected, reason) => {
		if (reason === "time")
			return msg.edit({
				embeds: [Embed.setTitle(`TIMEOUT`)],
				components: components(true),
			});

		if (reason === "CANCEL")
			return collected.map(async (btn) => {
				if (btn.replied === false)
					await btn.update({
						embeds: [Embed.setTitle(`Cancelled by ${btn.user.username}`)],
						components: components(true),
					});
			});

		let result = RPS(game.get(message.author.id), game.get(opponent.id));

		let title = ``;
		let description = `**${message.author.username}** chose \`${game.get(
			message.author.id
		)}\`\n**${opponent.username}** chose \`${game.get(opponent.id)}\``;

		switch (result) {
			case 0:
				title = `ITS TIED`;
				break;
			case 1:
				title = `${message.author.username} WON!`;
				break;
			case 2:
				title = `${opponent.username} WON!`;
				break;
			default:
				title = `SOMETHING WENT WRONG`;
		}

		return collected.map(async (btn) => {
			if (btn.replied === false)
				await btn.update({
					embeds: [Embed.setTitle(title).setDescription(description)],
					components: components(true),
				});
		});
	});
};
