// let already = new Set();

module.exports = {
	id: "localeSet",
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
					content: `You have just changed your guild locale. Please wait \`${(
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
			components: client.disableComponent(message, true),
		});

		already.add(interaction.user.id);

		await interaction.reply({
			content: `Please enter a locale from **Supported Locales** (Example: en). Expired <t:${
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
				const locale = collected
					.first()
					.content.toLowerCase()
					.replace(/[&\/\\#^+()$~%.'":*?<>{}!@ ]/g, "");
				// console.log(locale)
				collected.first().delete();
				// console.log(ifetch)
				let locales = i18n.getLocales();

				if (!locales.includes(locale))
					return interaction
						.followUp({
							content: `Unknown \`${locale}\` locale.`,
							ephemeral: true,
						})
						.then(() => {
							message.edit({
								components: client.disableComponent(message, false),
							});
						});

				return client.locale.set(message, locale).then((locale) => {
					cooldowns.set(message.guildId, Date.now());

					Embed.fields[0] = {
						name: "Current Locale",
						value: "`" + locale + "`",
					};

					message.edit({
						embeds: [Embed],
                        components: client.disableComponent(message, false),
					});

					return interaction.followUp({
						content: `Successfully changed your guild locale to \`${locale}\``,
						ephemeral: true,
					});
				});
			}

			// let value = await client.locale.get(message);
			// Embed.fields[0] = {
			// 	name: "Current Locale",
			// 	value: "`" + value + "`",
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
