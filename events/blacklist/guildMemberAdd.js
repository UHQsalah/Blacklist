module.exports = async (client, db, config, member) => {
    try {
        
        if (db.get(`blacklist_${member.guild.id}-${member.id}`)) {
           
            await member.guild.members.ban(member.id, { reason: `Blacklist` });
           
            await member.send({ content: `Vous êtes blacklist de **${member.guild.name}**, vous ne pouvez pas rejoindre le serveur` });
        }
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la gestion de l\'event guildMemberAdd :', error);
    }
}
