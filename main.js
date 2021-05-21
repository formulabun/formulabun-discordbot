const path = require('path');
const Discord = require('discord.js');
const env = require('dotenv').config({
  path: path.join(__dirname, ".env"),
}).parsed;
const srb2kartinfo = require("./srb2kartInfoParser/srb2kartserverinfo.js").getSrb2Info;

const client = new Discord.Client();

const updateStatus = () => {
  srb2kartinfo(env.SERVER, env.PORT, (server)=>{
    const stat = `${server.numberofplayers} players race`
    client.user.setActivity(stat, {type: 'WATCHING'})
      .catch(console.error);
  }, ()=>{});
}

client.on('message', (message) => {
  return
  if(message.author.bot)
    return
  if(message.content.trim() === "!players") {
    srb2kartinfo(env.SERVER, env.PORT, () => {}, (plrs)=>{
      const players = plrs.playerinfo.map((plrinfo) => {
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
        .then(message => console.log(`sent a message at ${message.createdAt}`))
        .catch(console.error);
    });
  }
})

client.on('ready', () => {
  setInterval(updateStatus, env.INTEVAL);
});

client.login(env.DISCORD_TOKEN);
