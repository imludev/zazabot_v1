const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js");;
const timeoutDatabase = require("../../Schemas/Moderation/Timeout");
const ms = require("ms");
const jsonconfig = require("../../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("timeout")
        .setDescription("Timeout a member")
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false)
        .addUserOption(options => options
            .setName("target")
            .setDescription("Select the user.")
            .setRequired(true))
        .addStringOption(options => options
            .setName("duration")
            .setDescription("Provide a duration for this timeout")
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
        const duration = options.getString("duration");
        const reason = options.getString("reason") || "No reason specified.";
        const logCh = client.channels.cache.get(jsonconfig.server.channels.modLogChannel)
        function getTimestamp() {
            return Date.now()
        };

        if (!target) return interaction.reply("Member has most likely left the guild.")
            .catch(error => {
                console.log(error)
            });

        if (!ms(duration) || ms(duration) > ms("28d"))
            interaction.reply("Time provided is invalid or over 28 days limit")


        if (member.roles.highest.position < target.roles.highest.position)
            interaction.reply("Selected member has a higher role than you do.")


        const successEmbed = new EmbedBuilder()
            .setAuthor({ name: "Timeout", iconURL: guild.iconURL() })
            .setColor("DarkBlue")
            .setDescription(
                `${target} was timed out.\nReason: ${reason}\nDuration: ${duration} `
            );

        const logEmbed = new EmbedBuilder()
            .setAuthor({ name: `New timeout | ${jsonconfig.server.name}`, iconURL: jsonconfig.server.iconURL })
            .setColor("DarkBlue")
            .setFields(
                {
                    name: `Target user`,
                    value: `${target.user.username + "#" + target.user.discriminator + ", \n" + target.id.toString()}`,
                    inline: true
                },
                {
                    name: `Timed out by`,
                    value: `${interaction.user.username + ", \n" + interaction.user.id}`,
                    inline: true
                },
                {
                    name: `Duration`,
                    value: `${duration}`,
                    inline: true
                },
                {
                    name: `Timed out at`,
                    value: `${getTimestamp()}`,
                    inline: false
                },
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
        const dmEmbed = new EmbedBuilder()
            .setAuthor({ name: `Timeout | ${jsonconfig.server.name}`, iconURL: jsonconfig.server.iconURL })
            .setColor("DarkBlue")

            .setFields(

                {
                    name: `Duration`,
                    value: `${duration}`,
                    inline: true
                },

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

        target.timeout(ms(duration), reason).catch((err) => {
            interaction.reply("Could not time out user due to an uncommon error.").catch(error => {
                console.log(error)
            });
        }).then(() => {
            interaction.reply({ content: `${jsonconfig.messages.success.moderation.successTimeout}`, ephemeral: true })
        }).then(async () => {
            await interaction.channel.send({
                embeds: [successEmbed],
            }).catch(error => {
                console.log(error)
            });
        }).then(async () => {
            await logCh.send({
                embeds: [logEmbed],
            }).catch(error => {
                console.log(error)
            });
        }).then(async () => {
            await target.send({
                embeds: [dmEmbed],
            }).catch(error => {
                console.log(error)
            });
        });


    }

}
// 31:15