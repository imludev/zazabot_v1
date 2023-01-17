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

        ),
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
                        .setURL(`https://snapchat.com/${jsonconfig.socials.snap}`)
                        .setDisabled(true)
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
                        { name: `Socials`, value: `\s`, inline: false }
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
                        // {
                        //     name: ``,
                        //     value: ``,
                        //     inline: false
                        // },
                        // {
                        //     name: ``,
                        //     value: ``,
                        //     inline: false
                        // },


                    )
                    .setTimestamp();

                interaction.reply({
                    embeds: [botinfoEmbed]
                });
                break;
            case "server":
                break;
        }

    }
}