const mongoose = require('mongoose');

const ParticipantSchema = mongoose.Schema({
	 conversationId: String,
	 userId: String
});

const Participant = module.exports = mongoose.model('Participant', ParticipantSchema);
