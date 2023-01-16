const {
    model, Schema
} = require("mongoose");


module.exports = model("SetupSettings", new Schema({
    guildID: String,
    ticketCategory: String,
    ticketLogChannel: String,
    ticketsEnabled: Boolean,
    modLogChannel: String,
    suggestChannel: String,
    bugChannel: String,
    suggestionsEnabled: Boolean,
    reviewChannel: String,
    messageLogChannel: String,
    memesEnables: Boolean,
})
)