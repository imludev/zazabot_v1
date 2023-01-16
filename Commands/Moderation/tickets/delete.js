const { SlashCommandBuilder, ChatInputCommandInteraction } = require("discord.js");
const SettingsDatabase = require("../../../Schemas/Config");
const TicketsDatabase = require("../../../Schemas/Tickets/Tickets");
const jsonconfig = require("../../../config.json");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("delete")
        .setDescription("Check the bots latency")
        .addStringOption((options) => options
            .setName("message")
            .setDescription("Enter a small message/recap/debrief")
            .setRequired(true)
        ),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction, client) {
        const debrief = interaction.options.getString("message");
        let config = await SettingsDatabase.findOne({
            guildID: guild.id,
            supportRole: !null
        });
        let ticketnr = interaction.channel.name.slice(7)
        if (!config) {
            interaction.reply(jsonconfig.messages.errors.config.notCorrSetup)
        } else {
            if (interaction.channel.name.startsWith("ticket-")) {
                if (interaction.member.roles.has(r => r.id == config.supportRole)) {

                    interaction.channel.delete(`Ticket nr #${ticketnr} deleted by ${interaction.user.name}#${interaction.user.discriminator} | Debrief: ${debrief}`)

                }
            } else {
                interaction.reply(jsonconfig.messages.errors.tickets.noTicketChan)
            }
        }
    }
}