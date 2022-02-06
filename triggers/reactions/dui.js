// For now, the only available property is name array. Not making the name array will result in an error.

module.exports = {
	name: ["dúi"],
	testguild: true,
	execute(message, args) {
		// Put all your trigger code over here. This code will be executed when any of the element in the "name" array is found in the message content.

		message.channel.send({
			content: `<@!441438270061150208>`,
		});
	},
};
