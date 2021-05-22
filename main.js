const path = require('path');
const Discord = require('discord.js');
const env = require('dotenv').config({
  path: path.join(__dirname, ".env"),
}).parsed;
const srb2kartinfo = require("./srb2kartInfoParser/srb2kartserverinfo.js").getSrb2Info;

let playerinfo = {}
env.SERVER = "127.0.0.1"
env.INTERVAL = 1000;

const playerresponse = (players, spectator) => {
  const joinnames = (names) => {
    const last = names.pop();
    const init = names.join(", ")
    if( !init )
      return last;
    return `${init} and ${last}`;
  }

  let p_response = "";
  if(players.length === 1)
    p_response = `${players[0]} is lonely.`;
  else if(players.length > 1) {
    p_response = `${joinnames(players)} are racing.`;
  }
  let s_response = "";
  if(spectator.length === 1) {
    s_response = `${joinnames(spectator)} is watching.`;
  } else if(spectator.length >= 1) {
    s_response = `${joinnames(spectator)} are watching.`;
  }
  if(!s_response && !p_response) {
    return "*cricket noises*";
  }
  return `${p_response} ${s_response}`.trim();
}

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
      playerinfo = plinfo
    });
  }

  respond(message) {
    const playerfiltermap = (players, filter) => {
      return players.filter(filter).map(p => p.name);
    }

    if(message.author.bot)
      return
    if(message.content.trim() === "!players") {
      if (!playerinfo.playerinfo)
        return
      const players = playerfiltermap(playerinfo.playerinfo, p=>!p.spectator);
      const spectators = playerfiltermap(playerinfo.playerinfo, p=>p.spectator);
      const response = playerresponse(players, spectators);

      message.channel.send(response)
        .then(message => console.log(`responded to a message on ${message.createdAt}`))
        .catch(console.error);
    }

  }
}

client = new FormulaBunBot();
client.login(env.DISCORD_TOKEN);
