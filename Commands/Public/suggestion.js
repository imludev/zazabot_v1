const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const SuggestionDatabase = require("../../Schemas/Suggestions");
const jsonconfig = require("../..//config.json");
const variables = require("../../variables.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("idea")
        .setDescription("Submit an (video) idea.")
        .addSubcommand((subcommand) => subcommand
            .setName("submit")
            .setDescription("Send an idea")
            .addStringOption((options) => options
                .setName("idea")
                .setDescription("Enter an idea")
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) => subcommand
            .setName("check")
            .setDescription("Check an idea")
            .addStringOption(options => options
                .setName("id")
                .setDescription("Enter an idea id.")
                .setMaxLength(512)
                .setRequired(true)
            )
            .addBooleanOption((options) => options
                .setName("submitconfirm")
                .setDescription("Submit?")
                .setRequired(true)
            )
            .addStringOption(options => options
                .setName("checkreason")
                .setDescription("Enter a reason.")
                .setMaxLength(512)
            )
        ),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction, client) {
        const subCommand = interaction.options.getSubcommand();
        function getRndInteger(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }
        let id = getRndInteger(10000000, 99999999);
        let suggestion = interaction.options.getString("idea");
        let allow = interaction.options.getBoolean("submitconfirm");
        let checkreason = interaction.options.getString("checkreason") || "No reason specified";
        let suggestionID = interaction.options.getString("id");

        let suggestionCheckChannel = client.channels.cache.get(jsonconfig.server.channels.suggestCheckChannel);
        let bugCheckChannel = client.channels.cache.get(jsonconfig.server.channels.bugCheckChannel);
        let suggestChannel = client.channels.cache.get(jsonconfig.server.channels.suggestChannel);
        let submitDate = Date.now();
        let dateFormat = new Date(submitDate);
        let normalDate = dateFormat.getHours() + ":" + dateFormat.getMinutes() + ", " + dateFormat.toDateString() || submitDate;
        const guild = interaction.guild;

        let suggestionData = await SuggestionDatabase.findOne({
            Guild: guild.id,
            ID: id
        });
        if (!suggestChannel) {
            interaction.reply(jsonconfig.messages.errors.config.notCorrSetup)
        } else {
            if (suggestionData) {
                interaction.reply(jsonconfig.messages.errors.undefinedErr)
            } else {
                switch (subCommand) {
                    case "submit":
                        let new_suggestionDB = new SuggestionDatabase({
                            Guild: guild.id,
                            ID: id,
                            Suggestion: suggestion,
                            Date: submitDate,
                            User: interaction.user.id,
                            CheckedBy: "none",
                            Approved: false,
                            Permitted: false
                        });
                        new_suggestionDB.save()
                            .catch(err => console.error(err));
                        setTimeout(() => { }, 5000);
                        if (!suggestionCheckChannel) {
                            var suggestionEmbed = new EmbedBuilder()
                                .setAuthor({ name: `${interaction.user.username}, ${jsonconfig.server.name}`, iconURL: interaction.user.avatarURL() })
                                .setColor("Green")
                                .setTitle("New idea submitted")
                                .setFields(
                                    { name: `Idea`, value: `${suggestion}`, inline: false },
                                )
                                .setFooter({
                                    text: `Idea submitted at ${normalDate}.`,
                                    iconURL: interaction.user.avatarURL()
                                })
                                .setTimestamp();
                            suggestChannel.send({ embeds: [suggestionEmbed] }).then(() => {
                                interaction.reply("Your idea has been sent successfully.")
                            })
                        } else {
                            var suggestionEmbed = new EmbedBuilder()
                                .setAuthor({ name: `${interaction.user.username}, ${jsonconfig.server.name}`, iconURL: interaction.user.avatarURL() })
                                .setColor("Grey")
                                .setTitle("New idea submitted")
                                .setFields(
                                    { name: `Idea`, value: `${suggestion}`, inline: false },
                                    { name: `By`, value: `${interaction.user.username + "#" + interaction.user.discriminator + ", " + interaction.user.id}`, inline: false },
                                    { name: "ID:", value: `${id}` }

                                )
                                .setFooter({
                                    text: `Suggestion submitted at ${normalDate}. id: ${id}. Run "/idea check" to check this suggestion.`,
                                    iconURL: interaction.user.avatarURL()
                                })
                                .setTimestamp();
                            suggestionCheckChannel.send({ embeds: [suggestionEmbed] }).then(() => {
                                interaction.reply("Your idea has been submitted successfully.")
                            })
                        };
                        break;

                    case "check":
                        if (interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
                            let suggestionData = await SuggestionDatabase.findOne({
                                Guild: guild.id,
                                ID: suggestionID
                            });
                            if (!suggestionData) {
                                interaction.reply(jsonconfig.messages.errors.undefinedErr)
                            } else {
                                let submitUser = guild.members.cache.get(suggestionData.User)
                                if (!allow) {
                                    submitUser.send("o");
                                    await suggestionData.updateOne({
                                        CheckedBy: interaction.user.id,
                                        Approved: true,
                                        Permitted: false
                                    })
                                } else {
                                    if (suggestionData.Approved) {
                                        "This idea has been approved already."
                                    } else {
                                        let dateFormat2 = new Date(suggestionData.Date);
                                        let normalDate2 = dateFormat.getHours() + ":" + dateFormat.getMinutes().toFixed(2) + ", " + dateFormat.toDateString() || submitDate;
                                        var newSuggestionEmbed = new EmbedBuilder()
                                            .setAuthor({ name: `${submitUser.user.username}, ${jsonconfig.server.name}`, iconURL: submitUser.user.avatarURL() })
                                            .setColor("Green")
                                            .setTitle("New idea submitted")
                                            .setFields(
                                                { name: `Idea`, value: `${suggestionData.Suggestion}`, inline: false },
                                            )
                                            .setFooter({
                                                text: `Idea submitted at ${normalDate2}.`,
                                                iconURL: interaction.user.avatarURL()
                                            })
                                            .setTimestamp();
                                        suggestChannel.send({
                                            embeds: [newSuggestionEmbed]
                                        })
                                        await suggestionData.updateOne({
                                            CheckedBy: interaction.user.id,
                                            Approved: true,
                                            Permitted: true
                                        });
                                        interaction.reply("Success");
                                        setTimeout(() => {
                                            interaction.deleteReply()
                                        }, 7 * 1000);
                                    }
                                }
                            }
                        } else {
                            interaction.reply(jsonconfig.messages.errors.moderation.noPerms)
                        }
                        break;

                }
            }

        }
    }

}