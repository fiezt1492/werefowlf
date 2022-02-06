// Deconstructed the constants we need in this file.

const Discord = require("discord.js");
// const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const fetch = require("node-fetch");

module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("meme")
		.setDescription("Summon random memes")
		.addStringOption((option) =>
			option
				.setName("subreddit")
				.setDescription("Provide a subreddit to get memes in it.")
				.setRequired(false)
		),

	async execute(interaction) {
		const { client } = interaction;

		let subreddit = interaction.options.getString("subreddit");
		if (!isNaN(Number(subreddit))) subreddit = null;

		const embed = new Discord.MessageEmbed().setColor("RANDOM");
		let http;
		let post;

		let row = (state) => [
			new Discord.MessageActionRow().addComponents(
				new Discord.MessageButton()
					.setCustomId("more")
					.setLabel("More!")
					.setDisabled(state)
					.setStyle("SUCCESS"),
				new Discord.MessageButton()
					.setCustomId("cancel")
					.setLabel("Stop")
					.setDisabled(state)
					.setStyle("SECONDARY")
			),
		];

		try {
			http = await fetch(
				`https://meme-api.herokuapp.com/gimme/${subreddit ? subreddit : ""}`
			);
			post = await http.json();
			// console.log(post)
			if (post)
				if (post.code)
					return message.reply(
						`**Error code**: \`${post.code}\` - **Error message**: \`${post.message}\``
					);
			embed
				.setAuthor({ name: `u/${post.author}` })
				.setTitle(String(post.title))
				.setURL(String(post.postLink))
				.setFooter({ text: `r/${post.subreddit} | ⬆ ${post.ups}` });
			if (!(post.nsfw || post.spoiler)) embed.setImage(post.url);
			else
				embed
					.setImage("https://cdn130.picsart.com/322803413346201.jpg")
					.setDescription(
						`⚠ This image is set as **NSFW/Spoiler**.\n||Click **[here](${post.url})** if you want to reveal.||`
					);
		} catch (error) {
			console.log(error);
			if (error.code === "ERR_NON_2XX_3XX_RESPONSE")
				return interaction.reply(
					`**[ERROR]** I can't find any meme in \`r/${subreddit}\``
				);

			embed.setColor("RED").setTitle("ERROR").setDescription(error);
			return interaction.reply({
				embeds: [embed],
			});
		}
		await interaction.reply({
			embeds: [embed],
			components: row(false),
			// allowedMentions: {
			// 	repliedUser: false,
			// },
		});

        const m = await interaction.fetchReply()

		const filter = (b) => b.user.id === interaction.user.id;

		const mCol = m.createMessageComponentCollector({
			filter,
			componentType: "BUTTON",
			time: 30000,
		});

		mCol.on("collect", async (btn) => {
			// if (btn.customId === "stop") return mCol.stop();
			if (btn.customId === "more") {
				mCol.resetTimer();
				try {
					http = await fetch(
						`https://meme-api.herokuapp.com/gimme/${subreddit ? subreddit : ""}`
					);
					post = await http.json();
					if (post)
						if (post.code)
							if (btn.replied === false)
								return btn.reply({
									content: `**Error code**: \`${post.code}\` - **Error message**: \`${post.message}\``,
									ephemeral: true,
								});
							else
								btn.editReply({
									content: `**Error code**: \`${post.code}\` - **Error message**: \`${post.message}\``,
									ephemeral: true,
								});
					embed.description = null;
					embed
						.setAuthor({ name: `u/${post.author}` })
						.setTitle(post.title)
						.setURL(post.postLink)
						.setFooter({ text: `r/${post.subreddit} | ⬆ ${post.ups}` });
					if (!(post.nsfw || post.spoiler)) embed.setImage(post.url);
					else
						embed
							.setImage("https://cdn130.picsart.com/322803413346201.jpg")
							.setDescription(
								`⚠ This image is set as **NSFW/Spoiler**.\n||Click **[here](${post.url})** if you want to reveal.||`
							);
					await btn.update({ embeds: [embed] });
				} catch (error) {
					console.log(error);
				}
			}
		});

		mCol.on("end", async (collected, reason) => {
			if (reason === "time")
				return m.edit({
					components: row(true),
				});

			// if (collected)
			// 	return collected.map(async (btn) => {
			// 		if (btn.replied === false)
			// 			await btn.update({
			// 				components: row(true),
			// 			});
			// 	});
		});
	},
};
