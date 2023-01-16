const {
    ChatInputCommandInteraction,
    InteractionType,
    EmbedBuilder
} = require("discord.js");
const jsonconfig = require("../../config.json");
module.exports = {
    name: "messageUpdate",
    /** 
     * @param {Client} client 
     */
    execute(oldMessage, newMessage, client) {
        const msgLogCH = client.channels.cache.get(jsonconfig.server.channels.messageLogChannel);

        if (oldMessage.content == newMessage.content) { return; } else if (oldMessage.content != newMessage.content) {
            let msgEmbed = new EmbedBuilder()
                .setAuthor({ name: oldMessage.member.user.username + " | " + jsonconfig.server.name, iconURL: jsonconfig.server.iconURL })
                .setColor("DarkBlue")
                .setTitle("Message editted")
                .setFields(
                    { name: `Author`, value: `${oldMessage.member.user.username}` },
                    { name: "Old message content", value: oldMessage.content },
                    { name: "New message content", value: newMessage.content },
                    { name: "Channel", value: `${oldMessage.channel}` },

                )
                .setFooter({ text: `Message deleted at`, iconURL: oldMessage.member.avatarURL() })
                .setTimestamp();

            msgLogCH.send({ embeds: [msgEmbed] }).catch(console.error);
        } else {
            let msgUpdEmbed = new EmbedBuilder()
                .setAuthor({ name: oldMessage.member.user.username + " | " + jsonconfig.server.name, iconURL: jsonconfig.server.iconURL })
                .setColor("DarkBlue")
                .setTitle("Message updated")
                .setFields(
                    { name: `Author`, value: `${oldMessage.member.user.username}` },
                    { name: "Message content", value: oldMessage.content },
                    { name: "Channel", value: `${oldMessage.channel}` },

                )
                .setFooter({ text: `Message updated at`, iconURL: oldMessage.member.avatarURL() })
                .setTimestamp();

            msgUpdEmbed.send({ embeds: [msgEmbed] }).catch(console.error);
        }
    }
}