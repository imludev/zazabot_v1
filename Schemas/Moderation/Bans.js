const {
    model, Schema
} = require("mongoose");

module.exports = model("Bans", new Schema({
    Guild: String,
    User: String,
    Bans: Array
}))