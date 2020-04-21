
const Discord = require("discord.js");
const config = require("../Configuration/config.json");
const Choco = require("../chocomdb.connector.js");
module.exports = async(bot, msg, args) => {	
 let user = msg.mentions.members.first().user;
  const noPerms = new Discord.RichEmbed()
    .setAuthor(bot.user.username, bot.user.avatarURL)
    .setDescription(`:no_entry_sign: ${msg.author.username}, you don't have the pemission to run this command`)
    .setColor(0xff0000)
    .setFooter(`Contact your server admin for help is you belive this isn't right`)
  // ---------------------------------------------------
  const missingArgument_User = new Discord.RichEmbed()
    .setTitle(`Oops! :scream:`)
    .setDescription(`You're a missing a required argument (ViewUser) in your message. The command can't continue without this, please add it and try again`)
    .setColor(0xff0000)
    .setFooter(`Contact a developer if you belive this is a mistake and the argument was entered`)
  // ---------------------------------------------------
  const missingArgument_Reason = new Discord.RichEmbed()
    .setTitle(`Oops! :scream:`)
    .setDescription(`You're a missing a required argument (reason) in your message. The command can't continue without this, please add it and try again`)
    .setColor(0xff0000)
    .setFooter(`Contact a developer if you belive this is a mistake and the argument was entered`)
  // ========================== END OF EMBEDS SECTION ==============================

  if(!msg.member.roles.some(r=>["Staff"].includes(r.name)) ) return msg.channel.send(noPerms);

  if (msg.mentions.users.size < 1) return msg.channel.send(missingArgument_User).catch(err => {
    const error = new Discord.RichEmbed()
      .setAuthor(bot.user.username, bot.user.avatarURL)
      .setTitle(`Something went wrong :scream:`)
      .setDescription(`An error happened while executing the command and could not run`)
      .addField(`Here's what returned`, err, false)
      .setColor(0xff0000)
      .setFooter(`Contact a developer for help on how to fix this.`)

    msg.channel.send(error)
    console.log(`An error has eccoured during the running of the view command and could not operate: ${err}`)
  });
     Choco.mongo.connect(async err => {
        let warn,kick,mute,ban;
	let col = await Choco.mongo.db("discord").collection("users");
        let colUsers = await col.find({}).toArray();
	for(let x = 0;x<colUsers.length;x++) {
         if(colUsers[x].name == user.username) {
           warn = colUsers[x].warn;
           kick = colUsers[x].kicks
           mute = colUsers[x].mutes
           ban  = colUsers[x].bans;
         }
	}
         const embed = new Discord.RichEmbed()
            .setAuthor(`${bot.user.username}`, bot.user.avatarURL)
            .setTitle(`Moderation List:`)
            .setDescription(`${user.username}`)
            .addField(`Warns`, warn, true)
            .addField(`Kicks`, kick, true)
            .addField(`Mutes`, mute, true)
            .addField(`Bans`, ban, true)
            .setColor(0x157f87)
	    .setFooter(`${bot.user.username} ${config.version}`)
        msg.channel.send(embed)
	Choco.mongo.close();
    });
}
