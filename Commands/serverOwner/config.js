
const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const mongoose = require('mongoose');
const GuildDatabase = require('../../Schemas/Config')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('View or edit the settings of your server!')

        //    view settings
        .addSubcommand((subcommand) => subcommand
            .setName("viewsettings")
            .setDescription("Restart your events"))

        // ticket
        .addSubcommand((subcommand) => subcommand
            .setName("ticket")
            .setDescription("Reload your commands")
            .addIntegerOption((options) => options
                .setName("ticketchannel")
                .setDescription("Enter a channel ID for the ticket logs")
                .setRequired(true)
            )
            .addIntegerOption((options) => options
                .setName("ticketcategory")
                .setDescription("Enter a category ID for the tickets")
                .setRequired(true)
            )
        )
        // modlog
        .addSubcommand((subcommand) => subcommand
            .setName("modlog")
            .setDescription("Reload your commands")
            .addIntegerOption((options) => options
                .setName("modlogchannel")
                .setDescription("Enter a channel ID for the moderation logs")
                .setRequired(true)
            )
        )
        // suggest en bugs
        .addSubcommand((subcommand) => subcommand
            .setName("suggestbugs")
            .setDescription("Reload your commands")
            .addIntegerOption((options) => options
                .setName("suggestchannel")
                .setDescription("Enter a channel ID for the bugs")
                .setRequired(true)
            )
            .addIntegerOption((options) => options
                .setName("bugchannel")
                .setDescription("Enter a channel ID for the bugs")
                .setRequired(true)
            )
        )
        //  review
        .addSubcommand((subcommand) => subcommand
            .setName("review")
            .setDescription("Reload your commands")
            .addIntegerOption((options) => options
                .setName("reviewchannel")
                .setDescription("Enter a channel ID for the reviews")
                .setRequired(true)
            )
        )
        // messagelog
        .addSubcommand((subcommand) => subcommand
            .setName("messagelog")
            .setDescription("Reload your commands")
            .addIntegerOption((options) => options
                .setName("msglogchannel")
                .setDescription("Enter a channel ID for the message logs")
                .setRequired(true)
            )
        )
        // memes
        .addSubcommand((subcommand) => subcommand
            .setName("memes")
            .setDescription("Reload your commands")
            .addBooleanOption((options) => options
                .setName("memeenabled")
                .setDescription("Enable or disable memes")
                .setRequired(true)
            )
        )
        // clear
        .addSubcommand((subcommand) => subcommand
            .setName("clear")
            .setDescription("Reload your commands")
            .addUserOption((options) => options
                .setName("clear")
                .setDescription("Clear all settings. This could affect databases. Tag the bot to confirm.")
                .setRequired(true)
            )
        )
    ,
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     * @returns 
     */
    async execute(interaction, client) {
        const subCommand = interaction.options.getSubcommand();
        // options
        const ticketchannel = interaction.options.getInteger("ticketchannel");
        const ticketcategory = interaction.options.getInteger("ticketcategory");
        const modlogchannel = interaction.options.getInteger("modlogchannel");
        const suggestChannel = interaction.options.getInteger("suggestchannel");
        const bugChannel = interaction.options.getInteger("bugchannel");
        const reviewChannel = interaction.options.getInteger("reviewchannel");
        const msgLogChannel = interaction.options.getInteger("msglogchannel");
        const memesEnabled = interaction.options.getBoolean("memesenabled");
        const clearUserOption = interaction.options.getUser("clear");


        // 
        const guildDB = await GuildDatabase.findOne({
            guildID: interaction.guild.id
        }).catch(err => {
            console.error(err)
        })
        switch (subCommand) {
            case "viewsettings":
                const embed = new EmbedBuilder();
                if (!guildDB) { embed.setDescription("No settings (yet)") }
                else {
                    embed.addFields(
                        {
                            name: 'Ticket category:',
                            value: guildDB.ticketCategory ? '✅' : '❌',
                            inline: true
                        },
                        {
                            name: 'Ticket log channel:',
                            value: guildDB.ticketCategory ? '✅' : '❌',
                            inline: true
                        },
                        {
                            name: 'Message log channel:',
                            value: guildDB.ticketCategory ? '✅' : '❌',
                            inline: true
                        },

                        {
                            name: 'Moderation log channel:',
                            value: guildDB.ticketCategory ? '✅' : '❌',
                            inline: true
                        },
                        {
                            name: 'Suggestion channel:',
                            value: guildDB.ticketCategory ? '✅' : '❌',
                            inline: true
                        },
                        {
                            name: 'Bug channel:',
                            value: guildDB.ticketCategory ? '✅' : '❌',
                            inline: true
                        },
                        {
                            name: 'Review channel:',
                            value: guildDB.ticketCategory ? '✅' : '❌',
                            inline: true
                        },

                    )
                        .setColor("Gold")
                        .setFooter({ text: "✅ = ingesteld | ❌ = niet ingesteld" })
                }
                return interaction.reply({ embeds: [embed] }).catch(err => {
                    console.error(err)
                });
            case "ticket":
            case "modlog":
            case "suggestbugs":
            case "review":
            case "messagelog":
            case "memes":
            case "clear":


        }

        if (!guildDB) {
            const newGuild = new GuildDatabase({
                _id: mongoose.Types.ObjectId(),
                guildID: interaction.guild.id,
                ticketCategory: null,
            })

            await newGuild.save()
                .catch(err => console.error(err));
        };



    },
}; 