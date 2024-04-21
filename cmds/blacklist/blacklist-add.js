module.exports = {
    name: 'blacklist-add',
    dm: false,
    description: "Ajouter un utilisateur à la blacklist",
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
        const userId = user.id;

        if (!db.get(`Owner_${interaction.guild.id}-${interaction.user.id}`) && !db.get(`Wl_${interaction.guild.id}-${interaction.user.id}`) && !config.owners.includes(interaction.user.id) && interaction.user.id !== interaction.guild.ownerId) 
            return interaction.reply({ content: `\`❌\` *Vous n'avez pas les permissions pour exécuter cette commande*`, ephemeral: true });

        if (user === null) 
            return interaction.reply({ content: `\`❌\` *Vous devez spécifier un utilisateur pour faire cela !*`, ephemeral: true });

        if (userId === interaction.user.id) 
            return interaction.reply({ content: "\`❌\` *Vous ne pouvez pas vous mettre dans la blacklist !*", ephemeral: true });

        if (db.get(`Owner_${interaction.guild.id}-${userId}`) !== null) 
            return interaction.reply({ content: "\`❌\` *Vous ne pouvez pas mettre un `owner` dans la blacklist !*", ephemeral: true });

        const isBlacklisted = db.get(`blacklist_${interaction.guild.id}-${userId}`);
        if (isBlacklisted !== null) {
            return interaction.reply({ content: `\`❌\` *L'utilisateur est déjà dans la blacklist !*`, ephemeral: true });
        }

        const cancelButton = client.button()
            .setStyle(4)
            .setLabel('Annuler')
            .setCustomId('cancel_blacklist_add');

        const continueButton = client.button()
            .setStyle(3)
            .setLabel('Continuer')
            .setCustomId('continue_blacklist_add');

        const actionRow = {
            type: 1,
            components: [cancelButton.toJSON(), continueButton.toJSON()]
        };

        interaction.reply({
            embeds: [{
                description: `\`✅\` *Voulez-vous vraiment ajouter ${user} à la blacklist ?*`,
                color: 0x2E3136,
            }],
            components: [actionRow]
        });

        const filter = i => (i.user.id === interaction.user.id) && (i.customId === 'cancel_blacklist_add' || i.customId === 'continue_blacklist_add');
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async i => {
            if (i.customId === 'cancel_blacklist_add') {
                await i.update({ embeds: [{ description: `\`❌\` *Action annulée*` }], components: [] });
            } else if (i.customId === 'continue_blacklist_add') {
                db.set(`blacklist_${interaction.guild.id}-${userId}`, { DogID: userId, AuthorTag: interaction.user.tag, AuthorID: interaction.user.id, Date: `<t:${Math.floor(Date.now() / 1000)}:R>` });

                interaction.guild.members.ban(userId, { reason: `Ajouté à la blacklist par ${interaction.user.tag}` })
                    .then(() => {
                        i.update({ embeds: [{ description: `\`✅\` *${user} a été ajouté à la blacklist et banni avec succès !*` }], components: [] });
                    })
                    .catch(error => {
                        i.update({ content: `\`❌\` *L'utilisateur a été ajouté à la blacklist mais une erreur est survenue lors de son bannissement : ${error.message}*`, ephemeral: true });
                    });
            }
            collector.stop();
        });

        collector.on('end', () => {
            interaction.editReply({ components: [] }).catch(console.error);
        });
    }
};
