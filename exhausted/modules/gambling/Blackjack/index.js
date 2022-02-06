const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const Deck = require("./Deck");
const Hand = require("./Hand");
const { millify } = require("millify");

// let games = new Map();

module.exports = async (client, message, Player, ONCE, bet) => {
	// const already = games.get(message.author.id);

	// if (games.has(message.author.id) && already.cID == message.channel.id)
	// 	return message.reply({
	// 		content: "**[Error]** There is a blackjack game playing for you.",
	// 		components: [
	// 			{
	// 				type: 1,
	// 				components: [
	// 					{
	// 						type: 2,
	// 						style: 5,
	// 						label: "Forward",
	// 						// url: `https://discord.com/channels/${already.gID}/${already.cID}/${already.mID}`
	// 						url: already.mURL,
	// 					},
	// 				],
	// 			},
	// 		],
	// 	});

	try {
		const d = new Deck();
		d.shuffle();
		const dealer = new Hand();
		const p1 = new Hand();
		const string = millify(bet, {
			precision: 2,
		});

		p1.draw(d, 2);
		dealer.draw(d, 2);
		let p1hand = p1.cards
			.map((card) => {
				return "`" + card.toString() + "`";
			})
			.join(" | ");

		const deckEmbed = new MessageEmbed()
			.setColor("RANDOM")
			.setAuthor({
				name: client.user.tag,
				iconURL: client.user.displayAvatarURL({ dynamic: true }),
			})
			.setDescription("Xì dách")
			.setFooter({
				text: message.author.tag,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
			});

		const staybut = (state) =>
			new MessageButton()
				.setCustomId("stay")
				.setLabel("Stay")
				.setDisabled(state)
				.setStyle("DANGER");

		const hitbut = (state) =>
			new MessageButton()
				.setCustomId("hit")
				.setLabel("Hit")
				.setDisabled(state)
				.setStyle("SUCCESS");

		deckEmbed
			.addField(
				`?? on ${client.user.username}\'s hand`,
				`\`${dealer.cards[0].suit}${dealer.cards[0].value} | ${dealer.cards[1].suit}?\``,
				true
			)
			.addField(
				`${p1.point} on ${message.author.username}\'s hand`,
				p1hand,
				true
			);

		let bt1 = staybut(false);
		let bt2 = hitbut(false);

		if (p1.isBanban() || p1.isBlackjack()) {
			while (
				(!dealer.isStayable() || (dealer.point < p1.point && p1.isHitable())) &&
				dealer.isHitable()
			) {
				dealer.draw(d);
			}

			bt1 = staybut(true);
			bt2 = hitbut(true);

			let dealerhand = dealer.cards
				.map((card) => {
					return "`" + card.toString() + "`";
				})
				.join(" | ");

			deckEmbed.fields[0] = {
				name: `${dealer.point} on ${client.user.username}\'s hand`,
				value: dealerhand,
				inline: true,
			};
			deckEmbed.fields[1] = {
				name: `${p1.point} on ${message.author.username}\'s hand`,
				value: p1hand,
				inline: true,
			};

			if (
				dealer.isBusted() ||
				(dealer.point < p1.point && p1.point <= 21) ||
				(p1.is5D() && !dealer.is5D()) ||
				(p1.is5D() && dealer.is5D() && p1.point < dealer.point)
			) {
				deckEmbed.setTitle("WIN");
				await Player.owlet(bet);
				deckEmbed.description = `You won \`${string}\` owlets!`;
			} else if (
				dealer.point === p1.point ||
				(dealer.isBusted() && p1.isBusted())
			) {
				deckEmbed.setTitle("DRAW");
			} else {
				deckEmbed.setTitle("LOSE");
				await Player.owlet(-bet);
				deckEmbed.description = `You lose \`${string}\` owlets!`;
			}
		}

		if (!p1.isStayable()) {
			bt1 = staybut(true);
		}

		let row1 = new MessageActionRow().addComponents([bt1, bt2]);

		let msg = await message.reply({
			embeds: [deckEmbed],
			components: [row1],
			allowedMentions: {
				repliedUser: false,
			},
		});

		if (bt2.disabled == false)
			ONCE.set(message.author.id, {
				name: "blackjack",
				gID: msg.guild.id,
				cID: msg.channel.id,
				mID: msg.id,
				mURL: msg.url,
			});
		else return;

		const filter = (f) => f.user.id === message.author.id;

		const msgCol = msg.createMessageComponentCollector({
			filter,
			componentType: "BUTTON",
			time: 30000,
		});

		msgCol.on("collect", async (btn) => {
			if (p1.isBanban() || p1.is5D() || p1.isBlackjack()) return msgCol.stop();
			if (p1.cards.length < 5) {
				if (btn.customId === "hit") {
					p1.draw(d);
					if (p1.isStayable()) bt1 = staybut(false);
					if (
						p1.cards.length >= 5 ||
						p1.is21P() ||
						p1.isBusted() ||
						p1.is5D()
					) {
						return msgCol.stop();
					}

					msgCol.resetTimer();
					p1hand = p1.cards
						.map((card) => {
							return "`" + card.toString() + "`";
						})
						.join(" | ");
				} else if (btn.customId === "stay") {
					p1.stay();
					return msgCol.stop();
				}
			}

			deckEmbed.fields[0] = {
				name: `?? on ${client.user.username}\'s hand`,
				value: `\`${dealer.cards[0].suit}${dealer.cards[0].value} | ${dealer.cards[1].suit}?\``,
				inline: true,
			};
			deckEmbed.fields[1] = {
				name: `${p1.point} on ${message.author.username}\'s hand`,
				value: p1hand,
				inline: true,
			};

			row1 = new MessageActionRow().addComponents([bt1, bt2]);

			await btn.update({
				embeds: [deckEmbed],
				components: [row1],
			});
		});

		msgCol.on("end", async (collected, reason) => {
			ONCE.delete(message.author.id);
			if (reason === "time") {
				let dealerhand = dealer.cards
					.map((card) => {
						return "`" + card.toString() + "`";
					})
					.join(" | ");

				deckEmbed.fields[0] = {
					name: `${dealer.point} on ${client.user.username}\'s hand`,
					value: dealerhand,
					inline: true,
				};
				deckEmbed.fields[1] = {
					name: `${p1.point} on ${message.author.username}\'s hand`,
					value: p1hand,
					inline: true,
				};
				deckEmbed.setTitle("TIMEOUT");
				bt1 = staybut(true);
				bt2 = hitbut(true);
				row1 = new MessageActionRow().addComponents([bt1, bt2]);

				return msg.edit({
					embeds: [deckEmbed],
					components: [row1],
				});
			}

			while (
				(!dealer.isStayable() || (dealer.point < p1.point && p1.isHitable())) &&
				dealer.isHitable()
			) {
				dealer.draw(d);
			}

			let dealerhand = dealer.cards
				.map((card) => {
					return "`" + card.toString() + "`";
				})
				.join(" | ");

			p1hand = p1.cards
				.map((card) => {
					return "`" + card.toString() + "`";
				})
				.join(" | ");

			deckEmbed.fields[0] = {
				name: `${dealer.point} on ${client.user.username}\'s hand`,
				value: dealerhand,
				inline: true,
			};
			deckEmbed.fields[1] = {
				name: `${p1.point} on ${message.author.username}\'s hand`,
				value: p1hand,
				inline: true,
			};

			if (
				(dealer.isBusted() && !p1.isBusted()) ||
				(dealer.point < p1.point && p1.point <= 21) ||
				(p1.is5D() && !dealer.is5D()) ||
				(p1.is5D() && dealer.is5D() && p1.point > dealer.point)
			) {
				deckEmbed.setTitle("WIN 🎉");
				await Player.owlet(bet);
				deckEmbed.description = `You won \`${string}\` owlets!`;
			} else if (
				dealer.point === p1.point ||
				(dealer.isBusted() && p1.isBusted())
			) {
				deckEmbed.setTitle("DRAW");
			} else {
				deckEmbed.setTitle("LOSE :<");
				await Player.owlet(-bet);
				deckEmbed.description = `You lose \`${string}\` owlets!`;
			}

			bt1 = staybut(true);
			bt2 = hitbut(true);
			row1 = new MessageActionRow().addComponents([bt1, bt2]);

			msg.edit({
				embeds: [deckEmbed],
				components: [row1],
			});

			if (collected)
				return collected.map(async (btn) => {
					if (btn.replied === false)
						await btn.update({
							embeds: [deckEmbed],
							components: [row1],
						});
				});
		});
	} catch (error) {
		console.log("[BLACKJACK]: " + error.message);
	}
};
