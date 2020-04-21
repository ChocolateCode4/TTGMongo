const Discord = require("discord.js");                                                  const config = require("../Configuration/config.json");
const Choco = require("../chocomdb.connector.js");
module.exports = async(bot, msg, args) => {
   const noPerms = new Discord.RichEmbed()                                .setAuthor(bot.user.username, bot.user.avatarURL)                     .setDescription(`:no_entry_sign: ${msg.author.username}, you don't have the pemission to run this command`)
    .setColor(0xff0000)
    .setFooter(`Contact your server admin for help is you belive this isn't right`)                                     // ---------------------------------------------------                                                           
const missingArgument_User = new Discord.RichEmbed()                                                                    .setTitle(`Oops! :scream:`)                                                                                           .setDescription(`You're a missing a required argument (ViewUser) in your message. The command can't continue witho
ut this, please add it and try again`)
    .setColor(0xff0000)
    .setFooter(`Contact a developer if you belive this is a mistake and the argument was entered`)
  // ---------------------------------------------------
  const missingArgument_Reason = new Discord.RichEmbed()
    .setTitle(`Oops! :scream:`)
    .setDescription(`You're a missing a required argument (reason) in your message. The command can't continue without
 this, please add it and try again`)
    .setColor(0xff0000)
    .setFooter(`Contact a developer if you belive this is a mistake and the argument was entered`)
  // ========================== END OF EMBEDS SECTION ==============================

  if(!msg.member.roles.some(r=>["Staff"].includes(r.name)) ) return msg.channel.send(noPerms);
     Choco.mongo.connect(async err => {
        let warn,kick,mute,ban;
        let col = await Choco.mongo.db("discord").collection("users");
        let colUsers = await col.find({}).toArray();
        for(let x = 0;x<colUsers.length;x++) {
	 console.log(colUsers[x].name+"/"+args[0]);
         if(colUsers[x].name == args[0]) {                                 warn = colUsers[x].warn;
           kick = colUsers[x].kicks
           mute = colUsers[x].mutes
           ban  = colUsers[x].bans;
         }
        }
         const embed = new Discord.RichEmbed()
            .setAuthor(`${bot.user.username}`, bot.user.avatarURL)
            .setTitle(`Moderation List:`)
            .setDescription(`${args[0]}`)
            .addField(`Warns`, warn, true)
            .addField(`Kicks`, kick, true)
            .addField(`Mutes`, mute, true)
            .addField(`Bans`, ban, true)
            .setColor(0x157f87)
            .setFooter(`${bot.username} ${config.version}`)
        msg.channel.send(embed)
        Choco.mongo.close();
   });
}
