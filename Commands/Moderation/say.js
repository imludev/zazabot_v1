const { SlashCommandBuilder, ChatInputCommandInteraction } = require("discord.js");;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("say")
        .setDescription("Check the bots latency")
        .addStringOption(options => options
            .setName("text")
            .setDescription("Enter some text")
            .setRequired(true)
            .setMaxLength(200)
        )
        .addChannelOption(options => options
            .setName("channel")
            .setDescription("Enter a channel")
            .setRequired(true)

        ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    execute(interaction, client) {
        const inputTXT = interaction.options.getString("text");
        const channel = interaction.options.getChannel("channel");
        channel.send(inputTXT)
    }
}