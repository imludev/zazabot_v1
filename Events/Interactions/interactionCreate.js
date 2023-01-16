const { ChatInputCommandInteraction, InteractionType } = require("discord.js");
const config = require("../../config.json");
module.exports = {
    name: "interactionCreate",
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command)
            return interaction.reply({
                content: "Command not found",
                ephemeral: true,

            });
        if (command.developer && interaction.user.id !== config.botowner.id)
            return interaction.reply({
                content: "This command is only available to the developer.",
                ephemeral: true,
            });

        // const subCommand = interaction.options.getSubcommand();
        // if (subCommand) {
        //     const subCommandFile = client.subCommands.get(`${interaction.commandName}.${subCommand}`);
        //     if (!subCommandFile) return interaction.reply({
        //         content: "Command not found",
        //         ephemeral: true,

        //     });

        //     subCommandFile.execute(interaction, client);
        // } else command.execute(interaction, client);


        if (interaction.type === InteractionType.ModalSubmit) {
            console.log(interaction);
        }
        // if (interaction.customId === 'settingsmodal') {
        //     interaction.reply({ content: 'Your submission was received successfully!' });
        // }

        command.execute(interaction, client);
        // console.log(interaction);
    }
}