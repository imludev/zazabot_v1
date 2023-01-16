const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionsBitField } = require("discord.js");;
const SettingsDatabase = require("../../../Schemas/Config");
const TicketsDatabase = require("../../../Schemas/Tickets/Tickets");
const jsonconfig = require("../../../config.json");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("add")
        .setDescription("Add someone to the ticket")
        .addUserOption((options) => options
            .setName("user")
            .setDescription("Select an user")
            .setRequired(true)
        ),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction, client) {
        const addedUser = interaction.options.getUser("user");

        let ticketnr = interaction.channel.name.slice(7)

        let config = await SettingsDatabase.findOne({
            guildID: interaction.guild.id,
        });
        let Ticket = await TicketsDatabase.findOne({
            guildID: interaction.guild.id,
            TicketNR: ticketnr
        });
        if (!config) {
            interaction.reply(jsonconfig.messages.errors.config.notCorrSetup)
        } else {
            if (!Ticket) {
                interaction.reply(jsonconfig.messages.errors.tickets.noTicketChan)
            } else {
                if (interaction.channel.name.startsWith("ticket-")) {
                    if (interaction.channel.name.startsWith("closed-")) {
                        interaction.reply(jsonconfig.messages.errors.tickets.closedTicket)
                    } else {
                        interaction.channel.permissionOverwrites.create(addedUser.id, {
                            ViewChannel: true,
                            SendMessages: true

                        });
                        interaction.reply({content:`${addedUser.username} has been added.`})
                        
                    }

                } else {
                    interaction.reply(jsonconfig.messages.errors.tickets.noTicketChan)
                }
            }
        }
    }
}