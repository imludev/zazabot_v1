const {
    model, Schema
} = require("mongoose");

module.exports = model("Bugs", new Schema({
    Guild: String,
    ID: String,
    Bug: String,
    Date: String,
    User: String,
    CheckedBy: String,
    Permitted: Boolean
}))