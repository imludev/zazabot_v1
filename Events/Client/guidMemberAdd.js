const { ChatInputCommandInteraction, InteractionType, EmbedBuilder, GuildMember, GuildMemberManager } = require("discord.js");
const jsonconfig = require("../../config.json");
module.exports = {
    name: "guildMemberAdd",
    /**
     * 
     * @param {GuildMember} member 
     * @param {Client} client 
     */
    execute(member, client) {
        let welcomeEmbed2 = new EmbedBuilder({
            author: { name: member.name, icon_url: member.avatarURL() }
        });
        let welcomeEmbed = new EmbedBuilder()
            .setAuthor({ name: member.user.username + " | " + jsonconfig.server.name, iconURL: jsonconfig.server.iconURL })
            .setColor("DarkBlue")
            .setFields(
                { name: `New member joined`, value: `Welcome, ${member.user.username}` },
                { name: "Please make sure to:", value: `\t- Read the rules in <#${jsonconfig.server.channels.rulesChannel}>\n\t- Be nice to eachother\n\t- Have fun!` }
            )
            .setThumbnail(member.avatarURL())
            .setFooter({ text: ` ${member.user.username} joined at `, iconURL: member.avatarURL() })
            .setTimestamp();
        member.roles.add(jsonconfig.server.roles.member, "Joined the server")
        const welcomeCh = client.channels.cache.get(jsonconfig.server.channels.welcomeChannel);
        welcomeCh.send({ embeds: [welcomeEmbed] }).catch(console.error)

    }
}