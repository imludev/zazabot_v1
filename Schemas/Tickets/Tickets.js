const {
    model, Schema
} = require("mongoose");

module.exports = model("Tickets", new Schema({
    Guild: String,
    TicketNR: Number,
    Creator: String,
    Reason: String,
    Claimed: Boolean,
    ChannelID: String,
    CreatedAt: String,
    Agents: Array,
    Closes: Array,
    Closed: Boolean,
    Reopens: Array,
    Open: Boolean,
    DeletedBy: String,
    DeletedAt: String
    // ,Transcript: String


}))