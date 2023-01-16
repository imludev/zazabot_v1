const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js");;
const timeoutDatabase = require("../../Schemas/Moderation/Timeout");
const ms = require("ms");
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
        const duration = options.getString("duration")
        const reason = options.getString("reason") || "No reason specified."

        const errorsArray = [];

        const errorsEmbed = new EmbedBuilder()
            .setAuthor({ name: "Could not timeout a member due to", })
            .setColor("Red");

        if (!target) return interaction.reply({
            embeds: [errorsEmbed.setDescription("Member has most likely left the guild.")]
        }).catch(error => {
            console.log(error)
        });

        if (!ms(duration) || ms(duration) > ms("28d"))
            errorsArray.push("Time provided is invalid or over 28 days limit").catch(error => {
                console.log(error)
            });

        if (!target.manageable || !target.moderatable)
            errorsArray.push("Slected member cannot be moderated by this bot.").catch(error => {
                console.log(error)
            });

        if (member.roles.highest.position < target.roles.highest.position)
            errorsArray.push("Selected member has a higher role than you do.").catch(error => {
                console.log(error)
            });

        if (errorsArray.length)
            return interaction.reply({
                embeds: [errorsEmbed.setDescription(errorsArray.join("\n"))],
                ephemeral: true
            }).catch(error => {
                console.log(error)
            });
        target.timeout(ms(duration), reason).catch((err) => {
            interaction.reply({
                embeds: [errorsEmbed.setDescription("Could not time out user due to an uncommon error.")]
            }).catch(error => {
                console.log(error)
            });
        });

        const newInfractionsObject = {
            IssuerID: member.id,
            IsssuerTag: member.user.tag,
            Reason: reason || "No reason speified",
            Date: Date.now()
        }

        let userData = await timeoutDatabase.findOne({
            Guild: guild.id,
            User: target.id
        });
        if (!userData)
            userData = await timeoutDatabase.create({
                Guild: guild.id,
                User: target.id
            })
        else {
            userData.Timeouts.push(newInfractionsObject) && await userData.save().catch(error => {
                console.log(error)
            });
        }
        const successEmbed = new EmbedBuilder()
            .setAuthor({ name: "Timeout issues", iconURL: guild.iconURL() })
            .setColor('Green')
            .setDescription([
                `${target} was issued a timeout for **${duration}**, \nbringing their infractions total to ** ${userData.Timeouts.length}**.\nReason: ${reason} `
            ].join("\n\n"));

        return interaction.reply({
            embeds: [successEmbed],
        }).catch(error => {
            console.log(error)
        });

    }
}
// 31:15