const db = require("../../databases/mongo").collection("players");
module.exports = class {
	constructor(id) {
		this.id = id;
		// this.player = await this.get(this.id)
	}
	async count() {
		return await db.count({ id: this.id }, { limit: 1 });
	}
	async get() {
		return await db.findOne({ id: this.id });
	}
	async set() {
		const exist = await this.get();
		if (exist) return exist;
		await db.insertOne({
			id: this.id,
			level: 0,
			owlet: 1000,
			nyteGem: 0,
			bank: 0,
			cooldowns: [],
			vote: 0,
			voteStreaks: 0,
			backpack: {
				level: 1,
				items: [],
				equipments: [],
				jewels: [],
			},
		});

		return await this.get();
	}
	async owlet(input) {
		input = Math.round(input);
		if (isNaN(input)) return;
		if (input < 0) {
			const player = await this.get();
			const remain = player.owlet;
			if (remain + input <= 0) input = -remain;
		}

		await db.updateOne(
			{
				id: this.id,
			},
			{
				$inc: {
					owlet: input,
				},
			}
		);
	}
	async bank(input) {
		input = Math.round(input);
		if (isNaN(input)) return;
		const player = await this.get()
		const owlet = player.owlet
		if (input > owlet) input = owlet
		if (input < 0) {
			const bank = player.bank
			if (input > bank) input = bank
		}
		
		await db.updateOne(
			{
				id: this.id,
			},
			{
				$inc: {
					owlet: -input,
					bank: input,
				},
			}
		);
	}
	async cooldownsPush(event, duration) {
		const player = await this.get();
		const exist = player.cooldowns.find((c) => c.event === event);

		if (exist) return;

		await db.updateOne(
			{
				id: this.id,
			},
			{
				$push: {
					cooldowns: {
						event: event,
						timestamps: Date.now(),
						duration: duration,
					},
				},
			}
		);
	}
	async cooldownsPull(event) {
		await db.updateOne(
			{
				id: this.id,
			},
			{
				$pull: {
					cooldowns: {
						event: event,
					},
				},
			}
		);
	}
	async cooldownsGet(event) {
		const player = await this.get();
		if (!event) return player.cooldowns;
		const exist = player.cooldowns.find((c) => c.event === event);
		return exist;
	}
};
