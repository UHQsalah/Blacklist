module.exports = {
    name: 'bot-activity',
    description: "Change l'activité du bot",
    type: 1,
    options: [{
        name: 'activité',
        description: "Quel sera la nouvelle activité ?",
        type: 3,
        required: true,
        choices: [{
            name: "Streaming",
            value: "STREAMING"
        }, {
            name: "Listening",
            value: "LISTENING"
        }, {
            name: "Watching",
            value: "WATCHING"
        }, {
            name: "Competing",
            value: "COMPETING"
        }]
    }, {
        name: "message",
        description: "Quel sera le texte de l'activité ?",
        type: 3,
        required: true
    }],
    /**
     * @param {CommandInteraction} interaction
     */
    go: async (client, db, config, interaction, args) => {
        await interaction.deferReply();

        const user = interaction.user.username; 

        if (!db.get(`Owner_${interaction.guild.id}-${interaction.user.id}`) && !config.owners.includes(interaction.user.id) && interaction.user.id !== interaction.guild.ownerId) {
            return interaction.reply({
                embeds: [{
                    description: `\`❌\` *Vous n'avez pas les permissions pour exécuter cette commande*`,
                    color: 0x2E3136,
                }],
                ephemeral: true
            });
        }

        const type2 = interaction.options.getString("activité");
        const msg = interaction.options.getString("message");

        if (type2 !== "STREAMING") client.user.setActivity(msg, { type: type2 });
        else client.user.setActivity(msg, { type: type2, url: "https://www.twitch.tv/#" });

        interaction.followUp({
            embeds: [{
                description: `⚙️ *${user} a changé l'activité du bot pour :* **${msg}** | *Type :* **${type2}**`,
                color: 0x2E3136,
            }]
        });
    }
}
