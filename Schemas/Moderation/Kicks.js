const {
    model, Schema
} = require("mongoose");

module.exports = model("Kicks", new Schema({
    Guild: String,
    User: String,
    Kicks: Array
}))