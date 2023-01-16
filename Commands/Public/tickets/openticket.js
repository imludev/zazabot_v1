const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionsBitField, ChannelType } = require("discord.js");
const mongoose = require("mongoose")
const SettingsDatabase = require("../../../Schemas/Config");
const TicketsDatabase = require("../../../Schemas/Tickets/Tickets");
const CountDatabase = require("../../../Schemas/Tickets/TicketCount");
const TicketCount = require("../../../Schemas/Tickets/TicketCount");
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
        let config = await SettingsDatabase.findOne({
            guildID: guild.id,
            ticketsEnabled: true,
        });
        let countDB = await CountDatabase.findOne({
            guildID: guild.id.toString(),

        });

        function noSettingsMSG() {
            interaction.reply("Ticket system is not set up correctly.").catch(error => {
                console.log(error)
            })
        }
        if (!config) {
            console.log("cannot find any settings for guild " + guild.id);
            noSettingsMSG();
        }
        else {
            if (!countDB) {
                const new_countDB = new CountDatabase({
                    Guild: guild.id,
                    TicketCount: "1000"
                })
                new_countDB.save()
                    .catch(err => console.error(err));
                setTimeout(() => {
                    
                }, 5000);
            }
            function getTimestamp() {
                return Date.now()
            }
            interaction.guild.channels.create({
                name: `ticket-${countDB.TicketCount.toString() || "1000"}`,
                type: ChannelType.GuildText,
                parent: config.ticketCategory.toString(),
                topic: `Ticket created by ${interaction.user.username}#${interaction.user.discriminator}, for: "${reason}"\nTicket nr.:${countDB.TicketCount}`,
                reason: `Created a ticket for ${interaction.user.username}. \nReason: ${reason}.\nTicket nr.:${countDB.TicketCount}\n`,
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
                        id: config.supportRole || "952532854594756608",
                        allow: [PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.AttachFiles],
                    }
                ],
            }).then((channel) => {
                interaction.reply(`I've created a ticket for your. ${channel}`)

            }).then(async () => {
                const newTicket = new TicketsDatabase({
                    _id: mongoose.Types.ObjectId(),
                    Guild: guild.id,
                    TicketNR: countDB.TicketCount,
                    Creator: interaction.user.id,
                    Reason: reason,
                    Claimed: false,
                    ChannelID: interaction.guild.channels.cache.find(channel => channel.name = `ticket-${countDB.TicketCount.toString()}`).id,
                    CreatedAt: getTimestamp(),
                    Agents: Array,
                    Users: Array,
                    Closes: Array,
                    Closed: false,
                    Reopens: Array,
                    Open: true,
                    DeletedBy: "no",
                    DeletedAt: "no"
                })

                await newTicket.save()
                    .catch(err => console.error(err));
            })
            // .then(async () => {
            //     setTimeout(() => {
                    
            //     }, 3000);
            //     let Ticket = await TicketsDatabase.findOne({
            //         guildID: interaction.guild.id,
            //         TicketNR: countDB.TicketCount
            //     });
            //     let newUserArr = {
            //         User: interaction.user.id.toString(),
            //         AddedAt: Date.now().toString()
            //     };
            //     Ticket.Users.push(newUserArr) && await Ticket.save().catch(error => {
            //         console.log(error)
            //     });
            // })
            .then(async () => {
                var newTicketCount = (parseInt(countDB.TicketCount) + 1).toString()
                await countDB.updateOne({
                    TicketCount: newTicketCount
                })
            })
        }
    }
}