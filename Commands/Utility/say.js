const { SlashCommandBuilder, ChatInputCommandInteraction } = require("discord.js");;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("say")
        .setDescription("Check the bots latency")
        .addStringOption(options => options
            .setName("text")
            .setDescription("Enter some text")
            .setRequired(true)
            .setMaxLength(500)
        )
        .addChannelOption(options => options
            .setName("channel")
            .setDescription("Enter a channel")
        ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    execute(interaction, client) {
        const inputTXT = interaction.options.getString("text");
        const channel = interaction.options.getChannel("channel") || interaction.channel;
        channel.send(inputTXT)
        interaction.reply({
            content: "Success",
            ephemeral: true
        })
    }
}