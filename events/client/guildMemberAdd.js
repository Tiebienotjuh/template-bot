const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,

    execute(member, client) {

        let role = member.guild.roles.cache.get("1144740279862173787");
        member.roles.add(role);
        
    }
}