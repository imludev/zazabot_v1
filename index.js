// DISCORD.JS V14

// Defining the Client
const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;
const client = new Client({
    intents: [Guilds, GuildMembers, GuildMessages],
    Partials: [User, Message, GuildMember, ThreadMember]
});
const { loadEvents } = require("./Handlers/eventHandler")
require("dotenv").config();
client.config = require("./config.json");
client.events = new Collection();
client.commands = new Collection();
client.subCommands = new Collection();


// Events
loadEvents(client);
process.on("unhandledRejection", (reason, promise) => {
    console.warn("-- Unhandled Rejection Error-- ");
    console.log(reason, promise)
});
process.on("uncaughtException", (err, origin) => {
    console.warn("-- Uncaught Exeception Error -- ");
    console.log(err, origin);
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
    console.warn("-- Uncaught Exception Error --");
    console.log(err, origin);
});
// YT
const RSSParser = require('rss-parser');
const urlRegexp = /(https?:\/\/[^ ]*)/;

client.login(process.env.TOKEN);