module.exports = {
    name: 'blacklist-forceremove',
    dm: false,
    description: "Retire un utilisateur de la blacklist (buyer)",
    type: 1,
    options: [
        {
            name: 'user',
            description: 'Utilisateur',
            type: 6,
            required: true,
        },
    ],

    go: async (client, db, config, interaction, args) => {
        const user = interaction.options.getUser('user');

        if (!config.owners.includes(interaction.user.id) && interaction.user.id !== interaction.guild.ownerId) 
            return interaction.reply({ content: `\`❌\` *Vous n'avez pas les permissions pour exécuter cette commande*`, ephemeral: true });

        if (user === null) 
            return interaction.reply({ content: `\`❌\` *Vous devez spécifier un utilisateur pour cela !*`, ephemeral: true });

        const isBlacklisted = db.get(`blacklist_${interaction.guild.id}-${user.id}`);
        if (isBlacklisted === null) 
            return interaction.reply({ content: `\`❌\` *Cet utilisateur n'est pas blacklisté !*`, ephemeral: true });

        const cancelButton = client.button()
            .setStyle(4)
            .setLabel('Annuler')
            .setCustomId('cancel');

        const continueButton = client.button()
            .setStyle(3)
            .setLabel('Continuer')
            .setCustomId('continue');

        const actionRow = {
            type: 1,
            components: [cancelButton.toJSON(), continueButton.toJSON()]
        };

        interaction.reply({
            embeds: [{
                description: `\`✅\` *Voulez-vous vraiment retirer ${user} de la blacklist ?*`,
                color: 0x2E3136,
            }],
            components: [actionRow]
        });

        const filter = i => (i.user.id === interaction.user.id) && (i.customId === 'cancel' || i.customId === 'continue');
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async i => {
            if (i.customId === 'cancel') {
                await i.update({ embeds: [{ description: `\`❌\` *Action annulée*` }], components: [] });
            } else if (i.customId === 'continue') {
                db.delete(`blacklist_${interaction.guild.id}-${user.id}`);
                await i.update({ embeds: [{ description: `\`✅\` *${user} a bien été retiré de la blacklist !*` }], components: [] });
            }
            collector.stop();
        });

        collector.on('end', () => {
            interaction.editReply({ components: [] }).catch(console.error);
        });
    }
};
