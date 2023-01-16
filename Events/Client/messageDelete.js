const { ChatInputCommandInteraction, InteractionType, EmbedBuilder } = require("discord.js");
const jsonconfig = require("../../config.json");
module.exports = {
    name: "messageDelete",
   /**
    * 
    * @param {Client} client 
    */
    execute(message, client) {
        let msgEmbed = new EmbedBuilder()
            .setAuthor({ name: message.user.username + " | " + jsonconfig.server.name, iconURL: jsonconfig.server.iconURL})
            .setColor("DarkBlue")
            .setTitle("Member left")
            .setFields(
                {name:`Author`, value: `${message.member.name}`},
                {name: "Message", value:message},
                {name: "Message content", value:message.content},
                {name: "Channel", value:message.channel},

            )
            .setFooter({text:`Message deleted at`, iconURL: message.member.avatarURL()})
            .setFooter();
            ;
        const msgLogCH = client.channels.fetch(jsonconfig.server.channels.messageLogChannel);
        msgLogCH.send({ embeds: [leftEmbed] }).catch(console.error)

    }
}