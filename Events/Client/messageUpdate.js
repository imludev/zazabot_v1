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
        if (oldMessage == newMessage) { return; } else {
            let msgEmbed = new EmbedBuilder()
                .setAuthor({ name: message.user.username + " | " + jsonconfig.server.name, iconURL: jsonconfig.server.iconURL })
                .setColor("DarkBlue")
                .setTitle("Member left")
                .setFields(
                    { name: `Author`, value: `${oldMessage.member.name}` },
                    { name: "Old message", value: oldMessage },
                    { name: "Old message content", value: oldMessage.content },
                    { name: "New message", value: newMessage },
                    { name: "New message content", value: newMessage.content },
                    { name: "Channel", value: oldMessage.channel },

                )
                .setFooter({ text: `Message deleted at`, iconURL: oldMessage.member.avatarURL() })
                .setFooter();

            const msgLogCH = client.channels.fetch(jsonconfig.server.channels.messageLogChannel);
            msgLogCH.send({ embeds: [leftEmbed] }).catch(console.error);
        }
    }
}