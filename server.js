const express = require("express");
const Discord = require("discord.js");
const Topgg = require("@top-gg/sdk");
const webhook = new Topgg.Webhook(process.env.TOPGG_AUTH);
const server = express();
const { port } = require("./config");

module.exports = (client) => {
	server.use("/index", express.static("web"));

	server.all("/", (req, res) => {
		// console.log(req)
		// console.log(res)
		// res.send(`Bot is running.`);
		res.send(`
		<html>
			<head>
				<title>Owlvernyte</title>
				<link rel="shortcut icon"
				href="https://cdn.discordapp.com/attachments/852888201391374376/867022478017429514/output-onlinegiftools_1.gif" type="image/gif" />
			</head>
			<body>
				<div>
					<h2>
						<a href="https://top.gg/bot/853623967180259369/invite" <span></span> ADD OWLVERNYTE </a> 
					</h2>
				</div>
				<footer>
					<div>
						<p>Owlvernyte © 2021</p>
					</div>
				</footer>
			</body>
		</html>
		`);
	});

	/**
	 * <html
	 * <head>
	 * 	<title>Owlvernyte</title>
	 * 	<link
			rel="shortcut icon"
			href="https://cdn.discordapp.com/attachments/852888201391374376/867022478017429514/output-onlinegiftools_1.gif"
			type="image/gif"
			/>
		</head>
		<body>
		<a
									href="https://top.gg/bot/853623967180259369/invite"
										&nbsp;ADD OWLVERNYTE
								</a>
		<footer>
		<p>@ Owlvernyte - 2021</p>
		</footer>
		</body>
	 * 
	 * 
	 */

	server.post(
		"/dblwebhook",
		webhook.listener(async (vote) => {
			const user = await client.users.fetch(vote.user);
			
			if (user) {
				let embed = new Discord.MessageEmbed()
					.setColor("RANDOM")
					.setTitle("Thanks for voting me, " + user.tag + "!");

				user.send({
					embeds: [embed],
				});
			}
		})
	);

	keepAlive();
};

var keepAlive = () => {
	server.listen(port, () => {
		console.log("Server is ready.");
	});
};
