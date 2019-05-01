const mongoose = require('mongoose');

const EventModelSchema = new mongoose.Schema({
	artist: String,
	location: {
		type: {
			type: String, 
			enum: ['Point'],
			required: true
		},
		coordinates: {
			type: [Number],
			required: true
		}
	},
	date: Date,
	description: String
});

module.exports = mongoose.model('EventModel', EventModelSchema);