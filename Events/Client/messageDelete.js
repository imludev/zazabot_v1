const { ChatInputCommandInteraction, InteractionType, EmbedBuilder } = require("discord.js");
const jsonconfig = require("../../config.json");
module.exports = {
    name: "messageDelete",
    /**
     * 
     * @param {Client} client 
     */
    async execute(message, client) {
        let msgEmbed = new EmbedBuilder()
            .setAuthor({ name: message.member.user.username + " | " + jsonconfig.server.name, iconURL: jsonconfig.server.iconURL })
            .setColor("DarkBlue")
            .setTitle("Message deleted")
            .setFields(
                { name: `Author`, value: `${message.member.user.username}` },
                {
                    name: "Message content", value: message.content
                        || "No content, somehow.. This might be an embedded message without text."
                },
                { name: "Channel", value: `${message.channel}` },

            )
            .setFooter({ text: `Message deleted at`, iconURL: message.member.avatarURL() })
            .setTimestamp();
        ;
        const msgLogCH = client.channels.cache.get(jsonconfig.server.channels.messageLogChannel);
        await msgLogCH.send({ embeds: [msgEmbed] }).catch(console.error)

    }
}