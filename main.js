const path = require('path');
const Discord = require('discord.js');
const env = require('dotenv').config({
  path: path.join(__dirname, ".env"),
}).parsed;
const commands = require("./commands.js");
const srb2kartinfo = require("./srb2kartInfoParser/srb2kartserverinfo.js").getSrb2Info;

let server = {}

class FormulaBunBot extends Discord.Client{

  constructor() {
    super();
    this.players = {};
    this.on('message', this.respond);
    this.on('ready', () => {
      this.updateData();
      setInterval(this.updateData, parseInt(env.INTERVAL));
    });
  }

  updateData() {
    srb2kartinfo(env.SERVER, env.PORT, (serverinfo)=>{
      server.serverinfo = serverinfo;
      const stat = `${serverinfo.numberofplayers} players race`
      client.user.setActivity(stat, {type: 'WATCHING'})
        .then(() => {
          if(serverinfo.numberofplayers === 0)
            client.user.setStatus("idle")
              .catch(console.error);
          else
            client.user.setStatus("online")
              .catch(console.error);
        })
        .catch(console.error)
    }, (plinfo) => {
      server.playerinfo = plinfo
    });
  }

  respond(message) {

    const content = message.content.trim();
    if(message.author.bot)
      return
    if(!server.serverinfo || !server.playerinfo)
      return

    if(commands[content]) {
      const response = commands[content].respond(server);
      message.channel.send(response)
        .then(message => console.log(`responded to a message on ${message.createdAt}`))
        .catch(console.error);
    }
  }
}

client = new FormulaBunBot();
client.login(env.DISCORD_TOKEN);
