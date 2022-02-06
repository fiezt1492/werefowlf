module.exports = {
	id: "sample",
	filter: "author",

	async execute(interaction) {
		await interaction.reply({
			content: "This was a reply from button handler!",
		});
		return;
	},
};
