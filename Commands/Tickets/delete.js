const { SlashCommandBuilder, ChatInputCommandInteraction } = require("discord.js");

const jsonconfig = require("../../config.json");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("delete")
        .setDescription("Check the bots latency")
        .addStringOption((options) => options
            .setName("message")
            .setDescription("Enter a small message/recap/debrief")
            .setRequired(false)
        ),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction, client) {
        const debrief = interaction.options.getString("message") || "No debrief added to this ticket.";
        const logCH = client.channel.cache.get(jsonconfig.server.channels.ticketLogChannel);
        let ticketnr = interaction.channel.name.slice(7)
        function getTimestamp() {
            return Date.now()
        }
        if (interaction.channel.name.startsWith("ticket-")) {
            if (interaction.member.roles.has(r => r.id == `${jsonconfig.server.roles.support} ` || `${jsonconfig.server.roles.manager}` || `${jsonconfig.server.roles.botowner}`)) {

                let ticketEmbed = new EmbedBuilder()
                    .setAuthor({ name: " | " + jsonconfig.server.name, iconURL: jsonconfig.server.iconURL })
                    .setColor("DarkBlue")
                    .setTitle("Ticket deleted")
                    .setFields(
                        { name: `Ticket name`, value: `ticket-${ticketnr}}`, inline: true },
                        { name: "Deleted by", value: `${interaction.user.username}#${interaction.user.discriminator}, ${interaction.user.id}`, inline: true },
                        { name: "Deleted at", value: `${getTimestamp()}`, inline: true },
                        { name: "Debrief", value: newMessage.content, inline: false },
                        { name: "Ticket information", value: `${interaction.channel.topic}`, inline: false },


                    )
                    .setFooter({ text: `Ticket deleted at`, iconURL: oldMessage.member.avatarURL() })
                    .setTimestamp();

                logCH.send({ embeds: [ticketEmbed] }).catch(console.error);
                interaction.channel.delete(`Ticket for ${ticketnr} deleted by ${interaction.user.name}#${interaction.user.discriminator} | Debrief: ${debrief}`)
            } else {
                interaction.reply(jsonconfig.messages.errors.moderation.noPerms)
            }
        } else {
            interaction.reply(jsonconfig.messages.errors.tickets.noTicketChan)
        }

    }
}