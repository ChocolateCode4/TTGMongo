
const { MongoClient } = require("mongodb"),
url = "mongodb+srv://user:password@cluster0-f7a7l.mongodb.net/test?retryWrites=true&w=majority",
mongo = new MongoClient(url);

const dbName = 'discord';

async function user(action, amount, name,id) {
 mongo.connect(async err => {
   const db = await mongo.db(dbName);
   const collectionName = "users";
   const col = db.collection(collectionName);
   let users = await col.find({}).toArray(),
   found = false,
   userIndexed;
   console.log(users);
   for(let x=0;x<users.length;x++) {
    if(users[x].name == name && users[x].discordID == id) {
     userIndexed = await col.find({"discordID": id}).toArray();
     found = true;
     //user exists
     const currentBans = userIndexed[0].bans,
     currentKicks = userIndexed[0].kicks,
     currentMutes = userIndexed[0].mutes,
     currentWarns = userIndexed[0].warn
     const filter = {"name": name, "discordID": id};
     let newAmount,update;
     switch(action) {
      case "banAdd":
	newAmount = currentBans + amount;
        update = {"bans": newAmount};
	await col.findOneAndUpdate(filter,{$set: update});
	console.log(`Ban count has been updated: ${currentBans} -> ${newAmount}`);
	break;
      case "kickAdd":
        newAmount = currentKicks + amount;
        update = {"kicks": newAmount};
	await col.findOneAndUpdate(filter,{$set: update});
	console.log(`Kick count has been updated: ${currentKicks} -> ${newAmount}`);
	break;
       case "warnAdd":
        newAmount = currentWarns + amount;
        update = {"warn": newAmount};
	await col.findOneAndUpdate(filter,{$set: update})
	console.log(`Warn count has been updated: ${currentWarns} -> ${newAmount}`);
	break;
       case "muteAdd":
        newAmount = currentMutes + amount;
        update = {"mutes": newAmount};
	await col.findOneAndUpdate(filter,{$set: update})
	console.log(`Mute count has been updated: ${currentMutes} -> ${newAmount}`);
	break;
	default:
	console.log("UNDEFINED ACTION PARAMETERS");
     }
    }
   }
   if(!found) {
    //user does not exist
    console.log(`user ${name} has been created`);
    col.insertOne(
    {
     "name": name,
     "discordID": id,
     "kicks": 0,
     "mutes": 0,
     "bans": 0,
     "warn": 0
    })
    recallUser(action, amount, name, id);
   };

   mongo.close();
  });
}
function recallUser(ac,am,na,id) {
 user(ac,am,na,id);
}

function getUser(doc, name) {
 let docNeeded = "n/a";
 mongo.connect(async err => {
   const db = await mongo.db(dbName);
   const collectionName = "users";
   const col = db.collection(collectionName);
   let users = await col.find({}).toArray();
   for(let x=0;x<users.length;x++) {
    if(users[x].name == name) {
     console.log(name + " : " + users[x].name);
     //user exists
     switch(doc) {
	case "kicks":
	 docNeeded = users[x].kicks;
	 break;
        case "bans":
	 docNeeded = users[x].bans;
	 break;
	case "warns":
	 docNeeded = users[x].warn;
	 break;
	case "mutes":
	 docNeeded = users[x].mutes;
	 break;
	default:
	 console.log("Provide proper paramater");
     }
    }
  }
  return docNeeded;
  mongo.close();
 });
}
module.exports = {
 getUser,
 user,
 mongo
}
