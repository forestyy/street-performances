const mongoose = require('mongoose');

const UserModelSchema = new mongoose.Schema({
	name: String,
	googleid: String,
});

module.exports = mongoose.model('UserModel', UserModelSchema);