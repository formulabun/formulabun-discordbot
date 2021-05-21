const path = require('path');
const Discord = require('discord.js');
const env = require('dotenv').config({
  path: path.join(__dirname, ".env"),
}).parsed;
const srb2kartinfo = require("./srb2kartInfoParser/srb2kartserverinfo.js").getSrb2Info;

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
    srb2kartinfo(env.SERVER, env.PORT, (server)=>{
      const stat = `${server.numberofplayers} players race`
      client.user.setActivity(stat, {type: 'WATCHING'})
        .catch(console.error);
    }, (plinfo) => {
      this.players = plinfo
    });
  }

  respond(message) {
    if(message.author.bot)
      return
    if(message.content.trim() === "!players") {
      if (!this.players.playerinfo)
        return
      const players = this.players.playerinfo.map((plrinfo) => {
        return plrinfo.name
      });
      let response;
      if(players.length == 0)
        response = `*cricket noises*`
      else if(players.length == 1)
        response = `${players[0]} is lonely`;
      else {
        last = players.pop();
        names = players.join(", ");
        response = `${players.join(', ')} and ${last} are online`;
      }
      message.channel.send(response)
        .then(message => console.log(`responded to a message on ${message.createdAt}`))
        .catch(console.error);
    }

  }
}

client = new FormulaBunBot();
client.login(env.DISCORD_TOKEN);
