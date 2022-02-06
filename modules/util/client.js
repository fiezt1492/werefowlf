// const Players = require("../economy/players");
const Discord = require("discord.js");

module.exports = (client) => {
	client.sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

	client.number = (input) =>
		input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

	client.getUserFromMention = (args) => {
		var mention, id, matches;
		args.forEach((element, index) => {
			if (index > 0 && id) return;
			matches = element.match(/^<@!?(\d+)>$/);
			if (!matches) return;
			return (id = matches[1]);
		});
		if (!id) return;
		return client.users.fetch(id);
	};

	// client.bal = async (id) => {
	// 	const Player = new Players(id);
	// 	const player = await Player.get();
	// 	if (!player) return null;
	// 	const bal = {
	// 		owlet: player.owlet,
	// 		nyteGem: player.nyteGem,
	// 		bank: player.bank,
	// 	};
	// 	return bal;
	// };

	client.disableComponent = (message, state = true) => {
		if (!message) return [];

		const { components } = message;

		if (!components || !components.length || components.size <= 0) return null;

		const COMPONENTS = components.map((row) =>
			new Discord.MessageActionRow().addComponents([
				row.components.map((component) => {
					switch (component.type) {
						case "BUTTON":
							const button = new Discord.MessageButton()
								.setEmoji(component.emoji)
								.setLabel(component.label)
								.setStyle(component.style);

							if (component.style === "LINK") button.setURL(component.url);
							else {
								button.setCustomId(component.customId).setDisabled(state);
							}
							// console.log(button);
							return button;

						case "SELECT_MENU":
							// console.log(component)
							return new Discord.MessageSelectMenu()
								.setCustomId(String(component.customId))
								.setPlaceholder(String(component.placeholder))
								.addOptions({
									label: "A",
									value: "B",
									description: "C",
								})
								.setDisabled(state);
					}
				}),
			])
		);
		// console.log(COMPONENTS)
		return COMPONENTS;
	};

	client.prefix = require("../configuration/guildPrefix");

	// client.locale = require("../configuration/guildLocale");
};
