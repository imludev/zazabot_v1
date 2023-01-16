const {
    model, Schema
} = require("mongoose");

module.exports = model("TicketCount", new Schema({
    Guild: String,
    TicketCount: String
}))