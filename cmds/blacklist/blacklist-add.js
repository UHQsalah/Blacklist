module.exports = {
    name: 'blacklist-add',
    dm: false,
    description: "Ajouter un utilisateur à la blacklist",
    type: 1,
    options: [
        {
            name: 'user',
            description: 'user',
            type: 6,
            required: true,
        },
    ],

    go: async (client, db, config, interaction, args) => {
        const user = interaction.options.getUser('user');
        const member = interaction.guild.members.cache.get(user.id);

        if (!db.get(`Owner_${interaction.guild.id}-${interaction.user.id}`) && !db.get(`Wl_${interaction.guild.id}-${interaction.user.id}`) && !config.owners.includes(interaction.user.id) && interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ content: `\`❌\` *Vous n'avez pas les permissions pour exécuter cette commande*`, ephemeral: true })
        if (user === null) return interaction.reply({ content: `\`❌\` *Vous devez spécifier un utilisateur pour faire cela !*`, ephemeral: true })
        if (user.id === interaction.user.id) return interaction.reply({ content: "\`❌\` *Vous ne pouvez pas vous mettre dans la blacklist !*", ephemeral: true })
        if (db.get(`Owner_${interaction.guild.id}-${user.id}`) !== null) return interaction.reply({ content: "\`❌\` *Vous ne pouvez pas mettre un \`owner\` dans la blacklist !*", ephemeral: true })
        if (db.get(`blacklist_${interaction.guild.id}-${user.id}`) === null) {
            db.set(`blacklist_${interaction.guild.id}-${user.id}`, { DogID: user.id, AuthorTag: interaction.user.tag, AuthorID: interaction.user.id, Date: `<t:${Math.floor(Date.now() / 1000)}:R>` })

            // Ban l'utilisateur
            member.ban({ reason: `Mise dans la blacklist par ${interaction.user.tag}` })
                .then(() => {
                    interaction.reply({
                        embeds: [
                            {
                                description: `\`✅\` *${user} a été ajouté à la blacklist et banni avec succès !*`,
                                color: 0x2E3136,
                            }
                        ]
                    });
                })
                .catch(error => {
                    interaction.reply({
                        content: `\`❌\` *L'utilisateur a été ajouté à la blacklist mais une erreur est survenue lors de son bannissement : ${error.message}*`,
                        ephemeral: true
                    });
                });
        } else {
            interaction.reply({
                content: `\`❌\` *L'utilisateur est déjà dans la blacklist !*`,
                ephemeral: true
            });
        }
    }
}
