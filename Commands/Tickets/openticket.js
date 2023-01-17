const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionsBitField, ChannelType, EmbedBuilder } = require("discord.js");
const mongoose = require("mongoose")
const jsonconfig = require("../../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ticket")
        .setDescription("Open a ticket")
        .addStringOption((options) => options
            .setName("reason")
            .setDescription("Enter a reason")
            .setRequired(true)
        ),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction, client) {
        const guild = interaction.guild;
        const reason = interaction.options.getString("reason");
        const TicketNR = interaction.user.username.toLowerCase() || interaction.user.username.replace(" ", "") || interaction.user.id.slice(0, 7) || interaction.user.id;
        function getTimestamp() {
            return Date.now()
        };
        var ticketEmbed = new EmbedBuilder()
            .setAuthor({ name: `${interaction.user.username} | ${jsonconfig.server.name}`, iconURL: interaction.user.avatarURL() })
            .setColor("DarkBlue")
            .setTitle("New ticket")
            .setDescription(`A new ticket has been opened. See the details below.`)
            .setFields(
                { name: `Creator`, value: `${interaction.user.username}#${interaction.user.discriminator}, ${interaction.user.id}`, inline: true },
                { name: `Reason`, value: `${reason}`, inline: true },
                { name: `Created at`, value: `${getTimestamp()}`, inline: false },
            )
            .setFooter({
                text: interaction.member.displayName,
                iconURL: interaction.user.avatarURL()
            })
            .setTimestamp();

        interaction.guild.channels.create({
            name: `ticket-${TicketNR}`,
            type: ChannelType.GuildText,
            parent: jsonconfig.server.channels.ticketCategory,
            topic: `Ticket was created by **${interaction.user.username}#${interaction.user.discriminator}**, ${interaction.user.id}. \nReason: *${reason}*.\nTicket identifier.: ${TicketNR}\nCreated at: ${getTimestamp()} `,
            reason: `Created a ticket for **${interaction.user.username}#${interaction.user.discriminator}**, ${interaction.user.id}. \nReason: ${reason}.\nTicket identifier.: ${TicketNR}\nCreated at: ${getTimestamp()} `,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel,
                    PermissionsBitField.Flags.SendMessages,
                    PermissionsBitField.Flags.AttachFiles],
                },
                {
                    id: jsonconfig.server.roles.support,
                    allow: [PermissionsBitField.Flags.ViewChannel,
                    PermissionsBitField.Flags.SendMessages,
                    PermissionsBitField.Flags.AttachFiles],
                }
            ],
        }).then((channel) => {
            interaction.reply(`I've created a ticket for your. ${channel}`),
                channel.send({
                    embeds: [ticketEmbed]
                })

        })

    }
}