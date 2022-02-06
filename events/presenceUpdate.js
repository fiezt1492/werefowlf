const { token, client_id, test_guild_id } = require("../config");
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

module.exports = {
	name: "presenceUpdate",
	skip: true,

	async execute(oldPresence, newPresence, client) {
		// console.log("old" + oldPresence)
		// console.log("new" + newPresence)
		const db = client.db.collection("remind");

		const exist = await db.findOne({ id: newPresence.userId });
		if (!exist) return;

		const guilds = exist.args.map((e) => e.guildId);


		if (!guilds.includes(newPresence.guild.id)) return;

		if (oldPresence != null || newPresence.status == "offline") return;

		try {
			const user = await client.users.fetch(exist.id, false);
			let objects = exist.args;
			// console.log(objects)

			for (let i in objects) {
				const guild = await client.guilds.fetch(objects[i].guildId);

				const Embed = new MessageEmbed()
					.setColor("RANDOM")
					.setDescription(objects[i].content)
					.setFooter({
						text: guild.name,
						iconURL: guild.iconURL({ dynamic: true }),
					})
					.setTimestamp(objects[i].timestamp);

				user.send({
					embeds: [Embed],
				});

				await db.updateOne(
					{
						id: exist.id,
					},
					{
						$pull: {
							args: objects[i],
						},
					}
				);
			}
		} catch (e) {
			console.log(e);
		} finally {
			const check = await db.findOne({ id: newPresence.userId });
			if (check.args.length <= 0)
				await db.deleteOne({ id: newPresence.userId });
		}

		// if (newPresence.status === 'offline') return;
		// if (newPresence.userId === '830110554604961824') {
		// 	console.log(newPresence)
		// 	const user = client.users.fetch(newPresence.userId)
		// 	user.send("ai?")
		// }
	},
};

// Presence {
//   userId: '584411132769337440',
//   guild: <ref *1> Guild {
//     id: '830110554604961824',
//     name: 'Owlvernyte',
//     icon: '55088f5f13c21c7e0b30dd1cf0a133ea',
//     features: [
//       'THREADS_ENABLED',
//       'MEMBER_VERIFICATION_GATE_ENABLED',
//       'PREVIEW_ENABLED',
//       'NEWS',
//       'COMMUNITY',
//       'NEW_THREAD_PERMISSIONS',
//       'WELCOME_SCREEN_ENABLED'
//     ],
//     commands: GuildApplicationCommandManager {
//       permissions: [ApplicationCommandPermissionsManager],
//       guild: [Circular *1]
//     },
//     members: GuildMemberManager { guild: [Circular *1] },
//     channels: GuildChannelManager { guild: [Circular *1] },
//     bans: GuildBanManager { guild: [Circular *1] },
//     roles: RoleManager { guild: [Circular *1] },
//     presences: PresenceManager {},
//     voiceStates: VoiceStateManager { guild: [Circular *1] },
//     stageInstances: StageInstanceManager { guild: [Circular *1] },
//     invites: GuildInviteManager { guild: [Circular *1] },
//     scheduledEvents: GuildScheduledEventManager { guild: [Circular *1] },
//     available: true,
//     shardId: 0,
//     splash: null,
//     banner: null,
//     description: null,
//     verificationLevel: 'MEDIUM',
//     vanityURLCode: null,
//     nsfwLevel: 'DEFAULT',
//     discoverySplash: null,
//     memberCount: 195,
//     large: true,
//     premiumProgressBarEnabled: true,
//     applicationId: null,
//     afkTimeout: 3600,
//     afkChannelId: null,
//     systemChannelId: '923269780750868501',
//     premiumTier: 'NONE',
//     premiumSubscriptionCount: 0,
//     explicitContentFilter: 'ALL_MEMBERS',
//     mfaLevel: 'NONE',
//     joinedTimestamp: 1628492203811,
//     defaultMessageNotifications: 'ONLY_MENTIONS',
//     systemChannelFlags: SystemChannelFlags { bitfield: 0 },
//     maximumMembers: 250000,
//     maximumPresences: null,
//     approximateMemberCount: null,
//     approximatePresenceCount: null,
//     vanityURLUses: null,
//     rulesChannelId: '830113042858901554',
//     publicUpdatesChannelId: '830113042858901555',
//     preferredLocale: 'en-US',
//     ownerId: '445102575314927617',
//     emojis: GuildEmojiManager { guild: [Circular *1] },
//     stickers: GuildStickerManager { guild: [Circular *1] }
//   },
//   status: 'idle',
//   activities: [],
//   clientStatus: { desktop: 'idle' }
// }
