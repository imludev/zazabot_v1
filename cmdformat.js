const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, Client } = require("discord.js");;
const jsonconfig = require("./config.json");
const variables = require("./variables.js")
module.exports = {
    data: new SlashCommandBuilder()
        .setName("name")
        .setDescription("")
        .addStringOption(options => options
            .setName("text")
            .setDescription("Enter some text")
            .setRequired(true)
            .setMaxLength(200)
        ),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    execute(interaction, client) {

        const text = interaction.options.getString("text");
        var embed = new EmbedBuilder()
            .setAuthor({ name: `${interaction.user.username} | ${jsonconfig.server.name}`, iconURL: interaction.user.avatarURL() })
            .setColor("DarkBlue")
            .setTitle("")
            .setDescription(``)
            .setFields(
                { name: ``, value: ``, inline: false },
                { name: ``, value: ``, inline: false },
                { name: ``, value: ``, inline: false },
                { name: ``, value: ``, inline: false },
                { name: ``, value: ``, inline: false }
            )
            .setFooter({
                text: ``,
                iconURL: interaction.user.avatarURL()
            })
            .setTimestamp();
        interaction.reply({
            content: `${jsonconfig.messages.lazydog}`,
            embeds: [embed],
            ephemeral: false
        });

    }
}