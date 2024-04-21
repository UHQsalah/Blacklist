module.exports = {
    name: 'blacklist-info',
    dm: false,
    description: "Voir les infos d'un utilisateur blacklist",
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
        const authorId = interaction.user.id;

        if (!db.get(`Owner_${interaction.guild.id}-${interaction.user.id}`) && !config.owners.includes(authorId) && authorId !== interaction.guild.ownerId) 
            return interaction.reply({ content: `\`❌\` *Vous n'avez pas les permissions pour exécuter cette commande*`, ephemeral: true });

        if (user !== null) {
            const blacklistData = db.get(`blacklist_${interaction.guild.id}-${user.id}`);
            if (blacklistData !== null) {
                let infoData = blacklistData;

                const buttons = [];

                if (authorId === infoData.AuthorID) {
                    const removeButton = client.button()
                        .setStyle(4)
                        .setLabel('Retirer')
                        .setCustomId('remove_from_blacklist');

                    buttons.push(removeButton.toJSON());
                }

                const reply = await interaction.reply({
                    ephemeral: true,
                    embeds: [
                        {
                            color: 0x2E3136,
                            description: `
                                **__Informations de la blacklist__**

                                **Auteur : **
                                Nom d'utilisateur : <@${infoData.AuthorID}>
                                Identifiant : \`${infoData.AuthorID}\`

                                **Victime : **
                                Nom d'utilisateur : ${user}
                                Identifiant : \`${user.id}\`

                                **__Informations Supplémentaires__**
                                Date : ${infoData.Date}
                            `
                        }
                    ],
                    components: buttons.length > 0 ? [{ type: 1, components: buttons }] : []
                });

                const collector = reply.createMessageComponentCollector({ time: 60000 });

                collector.on('collect', async i => {
                    if (i.customId === 'remove_from_blacklist') {
                        db.delete(`blacklist_${interaction.guild.id}-${user.id}`);
                        const updatedEmbed = {
                            color: 0x2E3136,
                            description: `\`✅\` *${user} a été retiré de la blacklist avec succès !*`
                        };
                        await i.update({ embeds: [updatedEmbed], components: [] });
                        collector.stop();
                    }
                });

                collector.on('end', collected => {
                    if (collected.size === 0) {
                        reply.delete();
                    }
                });
            } else {
                interaction.reply({ content: `\`❌\` L'utilisateur n'est pas dans la blacklist !`, ephemeral: true });
            }
        }
    }
};
