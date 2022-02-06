const Discord = require("discord.js");

module.exports = {
	data: {
		name: "Rock Paper Scissors",
		type: 2, // 2 is for user context menus
	},

	async execute(interaction, member, i18n) {
		const { client } = interaction;

		// console.log(interaction);
		const opponent = member.user;

		if (opponent.id === interaction.user.id)
			return interaction.reply({
				content: `You can't play against yourself!`,
				ephemeral: true,
			});

		const Embed = new Discord.MessageEmbed()
			.setAuthor({
				name: interaction.user.tag,
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
			})
			.setTitle(`${interaction.user.username} vs ${opponent.username}`)
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

		await interaction.reply({
			content: `<@!${interaction.user.id}> **VS** <@!${opponent.id}>`,
			embeds: [Embed],
			components: components(false),
		});

		const msg = await interaction.fetchReply();

		const filter = (i) =>
			i.user.id === interaction.user.id || i.user.id === opponent.id;

		const msgCol = msg.createMessageComponentCollector({
			filter,
			componentType: "BUTTON",
			time: 60000,
		});

		let game = new Map();

		msgCol.on("collect", async (i) => {
			if (i.customId === "rps-cancel") return msgCol.stop("CANCEL");

			game.set(i.user.id, i.customId);

			if (opponent.bot === true) {
				let choices = ["rock", "paper", "scissors"];
				let choice = choices[Math.floor(Math.random() * choices.length)];
				game.set(opponent.id, choice);
			}

			if (game.size === 2) return msgCol.stop();

			await i.update({ components: components(false) });
		});

		msgCol.on("end", async (collected, reason) => {
			if (reason === "time")
				return interaction.editReply({
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

			let result = RPS(game.get(interaction.user.id), game.get(opponent.id));

			let title = ``;
			let description = `**${interaction.user.username}** chose \`${game.get(
				interaction.user.id
			)}\`\n**${opponent.username}** chose \`${game.get(opponent.id)}\``;

			switch (result) {
				case 0:
					title = `ITS TIED`;
					break;
				case 1:
					title = `${interaction.user.username} WON!`;
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

		// interaction.editReply({
		// 	embeds: [Embed],
		// 	components: components(true),
		// })
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
