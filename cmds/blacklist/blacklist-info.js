module.exports = {
    name: 'blacklist-info',
    dm: false,
    description: "Voir les infos d'un utilisateur blacklist",
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

        if (!db.get(`Owner_${interaction.guild.id}-${interaction.user.id}`) && !config.owners.includes(interaction.user.id) && interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ content: `\`?\` *Vous n'avez pas les permission pour execut� cette commande*`, ephemeral: true })
        if (user !== null) {
            if (db.get(`blacklist_${interaction.guild.id}-${user.id}`) !== null) {
                let infoData = db.get(`blacklist_${interaction.guild.id}-${user.id}`)
                interaction.reply({
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
                    ]
                })
            } else {
                interaction.reply({ content: `\`❌\` L'utilisateur n'est pas dans la blacklist !*`, ephemeral: true })
            }
        }
    }
}