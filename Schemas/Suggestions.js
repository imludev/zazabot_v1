const {
    model, Schema
} = require("mongoose");

module.exports = model("Suggestions", new Schema({
    Guild: String,
    ID: String,
    Suggestion: String,
    Date: String,
    User: String,
    CheckedBy: String,
    Approved: Boolean,
    Permitted: Boolean
}))