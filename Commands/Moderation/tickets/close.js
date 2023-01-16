const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionsBitField, EmbedBuilder } = require("discord.js");
const SettingsDatabase = require("../../../Schemas/Config");
const TicketsDatabase = require("../../../Schemas/Tickets/Tickets");
const jsonconfig = require("../../../config.json");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("close")
        .setDescription("Check the bots latency")
        .addStringOption((options) => options
            .setName("reason")
            .setDescription("Enter a reason")
            .setRequired(true)
        ),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction, client) {
        const reason = interaction.options.getString("reason");
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
                        interaction.channel.setName(`closed-${ticketnr}`).catch((err) => {
                            console.log(err)
                        })
                        const everyone = interaction.guild.id.toString();
                        try {
                            interaction.channel.permissionOverwrites.set(everyone, {
                                ViewChannel: false,
                                SendMessages: false

                            })
                            interaction.channel.permissionOverwrites.create(config.supportRole, {
                                ViewChannel: true,
                                SendMessages: true
                            })
                            interaction.channel.permissionOverwrites.create(Ticket.Creator, {
                                ViewChannel: false,
                                SendMessages: false
                            })

                        }
                        finally {
                            interaction.channel.permissionOverwrites.edit(everyone, {
                                ViewChannel: false,
                                SendMessages: false

                            })
                            
                            interaction.channel.permissionOverwrites.edit(Ticket.Creator, {
                                ViewChannel: false,
                                SendMessages: false
                            })
                        }
                        let newCloseArr = {
                            ClosedBy: interaction.user.id.toString(),
                            ClosedFor: reason,
                            ClosedAt: Date.now().toString()
                        }
                        Ticket.Closes.push(newCloseArr) && await Ticket.save().catch(error => {
                            console.log(error)
                        });

                        interaction.reply("success")
                    }
                } else {
                    interaction.reply(jsonconfig.messages.errors.tickets.noTicketChan)
                }
            }
        }
    }
}
