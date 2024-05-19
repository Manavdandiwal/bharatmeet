import mongoose from "mongoose";

const calls = new mongoose.Schema({
    callID: String,
    createdBy: String,
    InvitedUsers: [String],
});

module.exports = mongoose.models.Calls || mongoose.model("Calls", calls);
