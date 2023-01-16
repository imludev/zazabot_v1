const { SlashCommandBuilder, ChatInputCommandInteraction } = require("discord.js");
const SettingsDatabase = require("../../../Schemas/Config");
const TicketsDatabase = require("../../../Schemas/Tickets/Tickets");
const jsonconfig = require("../../../config.json");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("claim")
        .setDescription("Check the bots latency"),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction, client) {
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
                    if (!Ticket.Claimed) {
                        let newAgentArr = {
                            ClaimedBy: interaction.user.id.toString(),
                            ClaimedAt: Date.now().toString()
                        };
                        Ticket.Agents.push(newAgentArr) && await Ticket.save().catch(error => {
                            console.log(error)
                        });
                        interaction.reply({
                            content: "Success",
                            ephemeral: true
                        })

                        interaction.channel.send(`This ticket is claimed by ${interaction.user}.`);
                        // interaction.user.send({content:`Information about ticket ${ticketnr}:\n
                        //     Opened by: <@${Ticket.Creator}>, ${Ticket.Creator};\n
                        //     Opened at: ${Ticket.CreatedAt.toString()}\n
                        //     Reason: ${reason}`})
                    } else if(Ticket.Claimed) {
                        interaction.reply(jsonconfig.messages.errors.tickets.alrClaimed)
                    } else{
                        interaction.reply("oo")
                    }

                }

                else {
                    interaction.reply(jsonconfig.messages.errors.tickets.noTicketChan)
                }
            }
        }
    }
}