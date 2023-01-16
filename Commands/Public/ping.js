const { SlashCommandBuilder, ChatInputCommandInteraction } = require("discord.js");;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Check the bots latency"),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute(interaction, client) {
        interaction.reply({
            content: `Pong pang! Bot latency is **${interaction.createdTimestamp - Date.now()}ms**. API latency is **${Math.round(client.ws.ping)}ms**.`
        });
    }
}