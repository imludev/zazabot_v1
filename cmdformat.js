const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");;
const config = require("./config.json");
const variables = require("./variables.js")
module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Check the bots latency"),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute(interaction, client) {
        var embed = new EmbedBuilder()
            .setAuthor({ name: `${interaction.user.username}, ${config.server.name}`, iconURL: interaction.user.avatarURL() })
            .setColor("")
            .setTitle("")
            .setDescription(``)
            .setFields(
                {name: ``, value:``, inline: false},
                {name: ``, value:``, inline: false},
                {name: ``, value:``, inline: false},
                {name: ``, value:``, inline: false},
                {name: ``, value:``, inline: false}
            )
            .setFooter({ 
                text: ``, 
                iconURL: interaction.user.avatarURL()
            })
            .setTimestamp();
        interaction.reply({
            content: `${config.messages.lazydog}`,
            embeds: [embed],
            ephemeral: false
        });
    }
}