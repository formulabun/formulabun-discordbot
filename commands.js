const path = require('path');
const env = require('dotenv').config({
  path: path.join(__dirname, ".env"),
}).parsed;
const {MessageEmbed} = require('discord.js');

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

exports["players"] = {
  descr: "show current players in the server",
  respond: (server) => {
    const playerfiltermap = (players, filter) => {
      return players.filter(filter).map(p => p.name);
    }
    const players = playerfiltermap(server.playerinfo.playerinfo, p=>!p.spectator);
    const spectators = playerfiltermap(server.playerinfo.playerinfo, p=>p.spectator);
    return {content: playerresponse(players, spectators)};
  }
}

exports["joinfbun"] = {
  descr: "explain how to join this epic server",
  respond: () => {
  return {
    embed: [
      new MessageEmbed()
        .setColor("#ffcece")
        .setTitle("Joining Formula bun")
        .setURL(`http://${env.SERVER}`)
	.setImage("http://formulabun.club/fastbun.png")
        .addField("Option one:", `type \`${env.SERVER}\` into the **join a game** field`)
        .addField("Option two:",
`create a \`kartexec.cfg\` file in your srb2kart folder and add the following line:
> alias joinserver "connect ${env.SERVER}"
and join the server by opening the console with using the \\\` key and enter \`joinserver\`
`)
        .addField("Option three:", `Copy paste the following url into your browser (when supported on your device) \`srb2kart://ip/${env.SERVER}\``)
    ]
}}}
