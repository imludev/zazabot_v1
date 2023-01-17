const { SlashCommandBuilder, ChatInputCommandInteraction } = require("discord.js");;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Check the bots latency"),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction, client) {

        let pingC = interaction.createdTimestamp - Date.now();
        if (pingC <= 0) {
            pingC = "347";
        };
        let pingC2 = Math.round(client.ws.ping);
        if (pingC2 <= 0) {
            pingC2 = "347";
        };

        interaction.reply({
            content: `Pong pang! Bot latency is **${pingC} ms**. API latency is **${pingC2} ms.**`
        }).catch(console.error)
    }
}