const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { loadCommands } = require("../../Handlers/commandHandler");
const { loadEvents } = require("../../Handlers/eventHandler")
const config = require("../../config.json")

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName("restart")
        .setDescription("Restart the bot.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand((options) => options
            .setName("events")
            .setDescription("Restart your events"))
        .addSubcommand((options) => options
            .setName("commands")
            .setDescription("Reload your commands")),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    execute(interaction, client) {
        const subCommand = interaction.options.getSubcommand();
        const ownerId = config.botowner.id.toString();
        const servOwnerId = config.server.owner.id.toString();
        if (interaction.user.id != ownerId || interaction.user.id != servOwnerId) {
            interaction.reply("You are not the owner >:(")
        }
        else if (interaction.user.id == ownerId  || interaction.user.id == servOwnerId) {
            switch (subCommand) {
                case "events": {
                    for (const [key, value] of client.events)
                        client.removeListener(`${key}`, value, true)
                    loadEvents(client).catch(err => {
                        console.log(err)
                    });
                    interaction.reply({
                        content: 'Reloaded events.',
                        ephemeral: true
                    });
                }
                    break;
                case "commands": {
                    loadCommands(client).catch(err => {
                        console.log(err)
                    });
                    interaction.reply({
                        content: 'Reloaded commands.',
                        ephemeral: true
                    });
                } break;
            }
        }
        else {
            interaction.reply("e-r-r-o-r")
        }
    }


}


// 23:47