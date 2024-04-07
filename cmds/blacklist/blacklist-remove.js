module.exports = {
    name: 'blacklist-remove',
    dm: false,
    description: "Remove un utilisateur de la blacklist",
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

        const
            user = interaction.options.getUser('user'),
            member = interaction.guild.members.cache.get(user.id);

            if (!db.get(`Owner_${interaction.guild.id}-${interaction.user.id}`) && !db.get(`Wl_${interaction.guild.id}-${interaction.user.id}`) && !config.owners.includes(interaction.user.id) && interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ content: `\`❌\` *Vous n'avez pas les permission pour executé cette commande*`, ephemeral: true })
        if (user === null) return interaction.reply({ content: `\`❌\` *Vous devez assigner un utilisateur pour faire ceci !*`, ephemeral: true })
        const t = db.get(`blacklist_${interaction.guild.id}-${user.id}`)
        if (t === null) return interaction.reply({ content: `\`❌\` *Cet utilisateur n'est pas blacklist !*`, ephemeral: true })

        if (config.owners.includes(interaction.user.id) && interaction.user.id === interaction.guild.ownerId) {

            if (db.get(`blacklist_${interaction.guild.id}-${user.id}`) !== null) {

                db.delete(`blacklist_${interaction.guild.id}-${user.id}`)
                interaction.reply({
                    embeds: [
                        {
                            description: `🐶 *${user} a bien été retiré de la blacklist !*`,
                            color: 0x2E3136,
                        }
                    ]
                })
                
            } else {
                interaction.reply({ content: `\`❌\` Cet utilisateur n'est pas en blacklist !`, ephemeral: true })
            }
        }

        if (!t.AuthorID.includes(interaction.user.id)) return interaction.reply({
            content: `\`❌\` *Vous ne pouvez pas retirer la blacklist à ${user}, car vous n'êtes pas l'auteur de ce derniers !*`,
            ephemeral: true
        })

        if (db.get(`blacklist_${interaction.guild.id}-${user.id}`) !== null) {
            db.delete(`blacklist_${interaction.guild.id}-${user.id}`)
            
            interaction.reply({
                embeds: [
                    {
                        description: `\`✅\` *${user} a bien été retiré de la blacklist !*`,
                        color: 0x2E3136,
                    }
                ]
            })

        } 
        }
    }
