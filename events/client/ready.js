module.exports = (client, db, config) => {
    console.log(`[BOT] => ON [${client.user.tag}]`);
    client.user.setPresence({
        activities: [{ name: 'Blacklist', type: 1, url: 'https://twitch.tv/#' }],

    });
}