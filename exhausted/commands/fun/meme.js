const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
	name: "meme",
	description: "Generate random meme",
	category: "fun",
	aliases: ["mêm"],
	usage: "<subreddit>",
	once: true,
	permissions: "SEND_MESSAGES",

	async execute(message, args, guildSettings) {
		// const { client } = message;
		let subreddit = args.join("_");

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
				return message.reply(
					`**[ERROR]** I can't find any meme in \`r/${subreddit}\``
				);

			embed.setColor("RED").setTitle("ERROR").setDescription(error);
			return message.reply({
				embeds: [embed],
			});
		}

		const m = await message.reply({
			embeds: [embed],
			components: row(false),
			allowedMentions: {
				repliedUser: false,
			},
		});

		const filter = (b) => b.user.id === message.author.id;

		const mCol = m.createMessageComponentCollector({
			filter,
			componentType: "BUTTON",
			time: 10000,
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
