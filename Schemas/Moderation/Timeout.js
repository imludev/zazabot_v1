const {
    model, Schema
} = require("mongoose");

module.exports = model("Timeouts", new Schema({
    Guild: String,
    User: String,
    Timeouts: Array
}))