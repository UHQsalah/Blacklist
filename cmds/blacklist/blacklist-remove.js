module.exports = {
    name: 'blacklist-remove',
    dm: false,
    description: "Retire un utilisateur de la liste noire",
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

        if (!db.get(`Owner_${interaction.guild.id}-${interaction.user.id}`) && !db.get(`Wl_${interaction.guild.id}-${interaction.user.id}`) && !config.owners.includes(interaction.user.id) && interaction.user.id !== interaction.guild.ownerId) 
            return interaction.reply({ content: `\`❌\` *Vous n'avez pas les permissions pour exécuter cette commande*`, ephemeral: true });

        if (user === null) 
            return interaction.reply({ content: `\`❌\` *Vous devez spécifier un utilisateur pour cela !*`, ephemeral: true });

        const isBlacklisted = db.get(`blacklist_${interaction.guild.id}-${user.id}`);
        if (isBlacklisted === null) 
            return interaction.reply({ content: `\`❌\` *Cet utilisateur n'est pas en liste noire !*`, ephemeral: true });

        if (!config.owners.includes(interaction.user.id) && interaction.user.id !== interaction.guild.ownerId && !isBlacklisted.AuthorID.includes(interaction.user.id)) 
            return interaction.reply({ content: `\`❌\` *Vous ne pouvez pas retirer la liste noire de ${user}, car vous n'êtes pas l'auteur de cette action !*`, ephemeral: true });

        const confirmButton = client.button()
            .setStyle(3)
            .setLabel('Continuer')
            .setCustomId('confirm_remove_blacklist');

        const cancelButton = client.button()
            .setStyle(4)
            .setLabel('Annuler')
            .setCustomId('cancel_remove_blacklist');

        interaction.reply({
            embeds: [{
                title: `Confirmation`,
                description: `\`🎯\` Voulez-vous vraiment retirer ${user} de la liste noire ?`,
                color: 0x2E3136,
            }],
            components: [
                { type: 1, components: [confirmButton, cancelButton] }
            ],
            ephemeral: false
        });

        const collector = interaction.channel.createMessageComponentCollector({
            time: 60000,
            filter: i => i.user.id === interaction.user.id
        });

        collector.on('collect', async i => {
            if (i.customId === 'confirm_remove_blacklist') {
                try {
                    db.delete(`blacklist_${interaction.guild.id}-${user.id}`);
                    await i.update({ embeds: [{ description: `\`✅\` *${user} a bien été retiré de la blacklist !*` }], components: [] });
                } catch (error) {
                    console.error(error);
                    const errorEmbed = {
                        color: 0x2E3136,
                        description: `\`❌\` Une erreur est survenue lors du retrait de la liste noire de ${user}.`
                    };
                    await i.update({ embeds: [errorEmbed], components: [] });
                } finally {
                    collector.stop();
                }
            } else if (i.customId === 'cancel_remove_blacklist') {
                await i.update({ embeds: [{ description: `\`❌\` *Action annulée*` }], components: [] });
                collector.stop();
            }
        });

        collector.on('end', () => {
            interaction.editReply({ components: [] }).catch(console.error);
        });
    }
};
