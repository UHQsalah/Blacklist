module.exports = {
    name: 'blacklist-list',
    dm: false,
    description: "Voir la liste des utilisateurs blacklist",
    type: 1,

    go: async (client, db, config, interaction, args) => {
        if (!db.get(`Owner_${interaction.guild.id}-${interaction.user.id}`) && !db.get(`Wl_${interaction.guild.id}-${interaction.user.id}`) && !config.owners.includes(interaction.user.id) && interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ content: `\`❌\` *Vous n'avez pas les permission pour executé cette commande*`, ephemeral: true })
        var content = ""
        const owner = db
            .all()
            .filter((data) => data.ID.startsWith(`blacklist_${interaction.guild.id}-`))
            .sort((a, b) => b.data - a.data);
        for (let i in owner) {
            if (owner[i].data === null) owner[i].data = 0;
            let userData = await client.users.fetch(owner[i].ID.split(`-`)[1])

            const t = db.get(`blacklist_${interaction.guild.id}-${userData.id}`)
            await client.users.fetch(t.AuthorID)

            content += `
                <@${userData.id}> | \`${userData.id}\``
        }
        interaction.reply({
            embeds: [
                {
                    title: "Liste des utilisateurs dans la blacklist",
                    description: content,
                    color: 0x2E3136,
                }
            ],
        })
    }
}