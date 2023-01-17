const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js");;
const jsonconfig = require("../../config.json");
const { botOwnerid, servOwnerId, supportRoleID } = require("../../variables")
module.exports = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kick a member")
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false)
        .addUserOption(options => options
            .setName("target")
            .setDescription("Select the user.")
            .setRequired(true))
        .addStringOption(options => options
            .setName("reason")
            .setDescription("Enter a reason.")
            .setMaxLength(512)
        )
    ,
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options, guild, member } = interaction;
        const target = options.getMember("target");
        const reason = options.getString("reason") || "No reason specified.";
        const supportID = jsonconfig.server.roles.support;
        const serverOwnerRoleID = jsonconfig.server.roles.owner;
        const logCh = client.channels.cache.get(jsonconfig.server.channels.modLogChannel)


        if (!interaction.member.roles.cache.has(supportID)) {
            interaction.reply(jsonconfig.messages.errors.moderation.noPerms)
        } else if (interaction.member.roles.cache.has(supportID)) {
            if (!target) return interaction.reply("Member has most likely left the guild.").catch(error => {
                console.log(error)
            });;


            if (interaction.member.roles.highest.position < target.roles.highest.position) {
                interaction.reply(jsonconfig.messages.errors.moderation.notModerateable + "a")
                return;
            }


        }
        function getTimestamp() {
            return Date.now()
        };
        const successEmbed = new EmbedBuilder()
            .setAuthor({ name: "Kick", iconURL: guild.iconURL() })
            .setColor("DarkBlue")
            .setDescription([
                `${target} was kicked.\nReason: ${reason}\nDate: ${getTimestamp()} `
            ].join("\n\n"));

        const dmEmbed = new EmbedBuilder()
            .setAuthor({ name: `Kick | ${jsonconfig.server.name}`, iconURL: jsonconfig.server.iconURL })
            .setColor("DarkBlue")
            .setFields(
                {
                    name: `Reason`,
                    value: `${reason}`,
                    inline: false
                },
            )
            .setFooter({
                text: jsonconfig.server.name,
                iconURL: jsonconfig.server.iconURL
            })
            .setTimestamp();


        const logEmbed = new EmbedBuilder()
            .setAuthor({ name: `New kick | ${jsonconfig.server.name}`, iconURL: jsonconfig.server.iconURL })
            .setColor("DarkBlue")
            .setFields(
                {
                    name: `Kicked user`,
                    value: `${target.user.username + "#" + target.user.discriminator + ", \n" + target.id.toString()}`,
                    inline: true
                },
                {
                    name: `Kicked by`,
                    value: `${interaction.user.username + ", \n" + interaction.user.id}`,
                    inline: true
                },

                {
                    name: `Kicked at`,
                    value: `${getTimestamp()}`,
                    inline: false
                },
                {
                    name: `Reason`,
                    value: `${reason}`,
                    inline: false
                },)
            .setFooter({
                text: jsonconfig.server.name,
                iconURL: jsonconfig.server.iconURL
            })
            .setTimestamp();

        await interaction.channel.send({
            embeds: [successEmbed],
        }).catch(error => {
            console.log(error)
        }).then(async () => {
            await logCh.send({
                embeds: [logEmbed],
            })
        }).catch(error => {
            console.log(error)
        }).then(async () => {
            await target.send({
                embeds: [dmEmbed],
            }).catch(error => {
                console.log(error)
            });
        });
        await guild.members.kick(target.id, reason).catch((err) => {
            console.log(err);
            interaction.reply(
                "Could not kick user due to an uncommon error."
            )
        }).then(() => {
            interaction.reply({ content: `${jsonconfig.messages.success.moderation.successKick}`, ephemeral: true })
        })
    }
}

