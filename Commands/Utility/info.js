const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");;
const jsonconfig = require("../../config.json");
const pckg = require("../../package.json");
const variables = require("../../variables.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Get some general info")
        .addSubcommand((subcommand) => subcommand
            .setName("general")
            .setDescription("Get general info")

        )
        .addSubcommand((subcommand) => subcommand
            .setName("bot")
            .setDescription("Get botinfo")

        )
        .addSubcommand((subcommand) => subcommand
            .setName("server")
            .setDescription("Get serverinfo")

        )
    ,
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    execute(interaction, client) {
        const subCommands = interaction.options.getSubcommand();
        switch (subCommands) {
            case "general":
                const infoRow = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel("YouTube")
                        .setURL(`https://www.youtube.com/channel/${process.env.YT_ID}`)
                        .setEmoji("📹")
                        .setDisabled(false)
                        .setStyle(ButtonStyle.Link),
                    new ButtonBuilder()
                        .setLabel("Twitch")
                        .setURL(`https://twitch.tv/`)
                        .setEmoji("📹")
                        .setDisabled(true)
                        .setStyle(ButtonStyle.Link),
                    new ButtonBuilder()
                        .setLabel("Instagram")
                        .setURL(`https://instagram.com/${jsonconfig.socials.insta}/`)
                        .setDisabled(false)
                        .setEmoji("📷")
                        .setStyle(ButtonStyle.Link),
                    new ButtonBuilder()
                        .setLabel("Snapchat")
                        .setURL(`https://snapchat.com/add/${jsonconfig.socials.snap}`)
                        .setDisabled(false)
                        .setEmoji("👻")
                        .setStyle(ButtonStyle.Link),


                );
                var embed = new EmbedBuilder()
                    .setAuthor({
                        name: `${interaction.user.username} | ${jsonconfig.server.name}`, iconURL: jsonconfig.server.iconURL
                    })
                    .setColor("DarkBlue")
                    .setTitle("Info")
                    .setFields(
                        {
                            name: `Algemene info`, value: `Hoi ik ben Qin, ik ben 15 jaar en speel vooral Fortnite en Fall Guys.  
Ik livestream vaak en ik doe graag custom matchmaking. 
Ik probeer elke week 1 video online te zetten. 
Als je mijn livestreams en video's leuk vind,
zou ik het fijn vinden als je een like dropt en abonneert.
Kijk ook zeer op mijn socials`, inline: false
                        },
                        { name: `Socials`, value: `\t`, inline: false }
                    )
                    .setFooter({
                        text: jsonconfig.server.name,
                        iconURL: jsonconfig.server.iconURL
                    })
                    .setTimestamp();
                interaction.reply({
                    embeds: [embed],
                    components: [infoRow],
                    ephemeral: false
                });



                break;
            case "bot":
                let botinfoEmbed = new EmbedBuilder()
                    .setColor("DarkBlue")
                    .setTitle("Bot info")
                    // .setDescription(``)
                    .addFields(

                        {
                            name: `Bot version`,
                            value: `${pckg.version}`,
                            inline: true
                        },
                        {
                            name: `Node version`,
                            value: `v19.1.0`,
                            inline: true
                        },

                        {
                            name: `Discord.js version`,
                            value: `${pckg.dependencies["discord.js"]}`,
                            inline: true
                        },
                        {
                            name: `Made by`,
                            value: `[${jsonconfig.botowner.name}](https://discord.com/users/${jsonconfig.botowner.id})`,
                            inline: false
                        },



                    )
                    .setTimestamp();

                interaction.reply({
                    embeds: [botinfoEmbed]
                });
                break;
            case "server":
                const serverName = interaction.guild.name;
                const serverID = interaction.guild.id;
                const memberCount = interaction.guild.memberCount;
                const allMembers = interaction.guild.members.cache;
                const allEmojis = interaction.guild.emojis;
                const allStickers = interaction.guild.stickers;

                const servername = interaction.guild.name;
                const allRoles = interaction.guild.roles.cache;
                const serverOwnerID = interaction.guild.ownerId;
                const boostTier = interaction.guild.premiumTier;
                const boostCount = interaction.guild.premiumSubscriptionCount;

                const allChannels = interaction.guild.channels.cache;
                const allChannelsNoTH = interaction.guild.channels.channelCountWithoutThreads;




                let serverinfoEmbed = new EmbedBuilder()
                    .setAuthor({
                        name: `${jsonconfig.server.name} | ${jsonconfig.server.name}`, iconURL: jsonconfig.server.iconURL
                    }).setColor("#72008E")
                    .setTitle("Bot info")
                    .addFields({
                        name: `Total Members`,
                        value: `${memberCount}`,
                        inline: true,
                    }, {
                        name: `Emojis`,
                        value: `${allEmojis.cache.size.toString()} emojis, ${allStickers.cache.size.toString()} stickers`,
                        inline: true,
                    }, {
                        name: `Roles`,
                        value: `${allRoles.size.toString()}`,
                        inline: true,
                    }, {
                        name: `Server owner`,
                        value: `<@${serverOwnerID}>, ${serverOwnerID}`,
                        inline: true,
                    }, {
                        name: `Boost tier`,
                        value: `${boostTier}`,
                        inline: true,
                    }, {
                        name: `Boosters`,
                        value: `${boostCount}`,
                        inline: true,
                    }, {
                        name: `Channel count`,
                        value: `${allChannels.size.toString()} channels`,
                        inline: true,
                    })

                    .setFooter({ text: `Server Name: ${serverName.toString()} | Server ID: ${serverID}` });

                interaction.reply({
                    embeds: [botinfoEmbed]
                    // , ephemeral: true
                });
                break;
        }

    }
}