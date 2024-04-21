module.exports = {
    name: 'blacklist-list',
    dm: false,
    description: "Voir la liste des utilisateurs blacklist",
    type: 1,

    go: async (client, db, config, interaction, args) => {
        if (!db.get(`Owner_${interaction.guild.id}-${interaction.user.id}`) && !db.get(`Wl_${interaction.guild.id}-${interaction.user.id}`) && !config.owners.includes(interaction.user.id) && interaction.user.id !== interaction.guild.ownerId) 
            return interaction.reply({ content: `\`❌\` *Vous n'avez pas les permissions pour exécuter cette commande*`, ephemeral: true });

        let content = "";
        const blacklistedUsers = db.all()
            .filter(data => data.ID.startsWith(`blacklist_${interaction.guild.id}-`))
            .sort((a, b) => b.data - a.data);

        for (const userData of blacklistedUsers) {
            if (userData.data === null) userData.data = 0;
            const user = await client.users.fetch(userData.ID.split('-')[1]);
            const blacklistData = db.get(`blacklist_${interaction.guild.id}-${user.id}`);
            const author = await client.users.fetch(blacklistData.AuthorID);

            content += `${user} | \`${user.id}\` (Par ${author})\n`;
        }

        interaction.reply({
            embeds: [{
                title: "Liste des utilisateurs dans la blacklist",
                description: content || "Aucun utilisateur dans la liste noire",
                color: 0x2E3136,
            }]
        });
    }
};
