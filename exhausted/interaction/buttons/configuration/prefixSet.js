// let already = new Set();

module.exports = {
	id: "prefixSet",
	filter: "author",

	async execute(interaction, i18n, already) {
		const { client, message } = interaction;
		const { cooldowns } = client;
		// console.log(interaction)

		const Embed = message.embeds[0];

		if (cooldowns.has(message.guildId)) {
			const now = Date.now();
			const old = cooldowns.get(message.guildId);

			if (now - old < 60000)
				return await interaction.reply({
					content: `You have just changed your guild prefix. Please wait \`${(
						(60000 - (now - old)) /
						1000
					).toFixed(1)}s\``,
					ephemeral: true,
				});
			else cooldowns.delete(message.guildId);
		}

		// if (already.has(interaction.user.id))
		// 	return await interaction.reply({
		// 		content: `You have clicked this button. Please finish previous request.`,
		// 		ephemeral: true,
		// 	});

		message.edit({
			components: client.disableComponent(message),
		});

		already.add(interaction.user.id);

		await interaction.reply({
			content: `Please type below your wish custom prefix to set. You 5 characters limit. Expired <t:${
				Math.round(Date.now() / 1000) + 60
			}:R>`,
			ephemeral: true,
			// fetchReply: true,
		});

		const msg = await interaction.fetchReply();

		// const channel = await client.channels.cache.get(interaction.channelId);

		const filter = (m) => interaction.user.id === m.author.id;

		const msgCol = msg.channel.createMessageCollector({
			filter,
			max: 1,
			time: 60000,
		});

		msgCol.on("collect", () => {
			msgCol.stop();
		});

		msgCol.on("end", async (collected, reason) => {
			already.delete(interaction.user.id);
			if (collected.size === 1) {
				already.delete(interaction.user.id);
				const customPrefix = collected.first().content;

				collected.first().delete();
				// console.log(ifetch)

				if (customPrefix.length > 5) {
					message.edit({
						components: client.disableComponent(message, false),
					});

					return interaction.followUp({
						content: `Prefix length limitation is **5**. Please make it shorter and click \`Set\` button again.`,
						ephemeral: true,
					});
				}

				return client.prefix.set(message, customPrefix).then((prefix) => {
					cooldowns.set(message.guildId, Date.now());

					Embed.fields[0] = {
						name: "Current Prefix",
						value: prefix,
					};

					message.edit({
						embeds: [Embed],
						components: client.disableComponent(message, false),
					});

					return interaction.followUp({
						content: `Successfully changed your guild prefix to \`${prefix}\``,
						ephemeral: true,
					});
				});
			}

			// Embed.fields[0] = {
			// 	name: "Current Prefix",
			// 	value: value,
			// };

			// message.edit({
			// 	embeds: [Embed],
			// });

			if (reason === "time") {
				message.edit({
					components: client.disableComponent(message, false),
				});
				if (collected.size === 0)
					return interaction.followUp({ content: `Timeout.`, ephemeral: true });
			}
		});
	},
};
