const {Client} = require('discord.js');
const path = require('path');
const env = require('dotenv').config({
  path: path.join(__dirname, ".env"),
}).parsed;

function sendMsg(msg, channel) {
  const client = new Client();
  return client.login(env.DISCORD_TOKEN).then(() =>
    client.channels.fetch(channel)
  ).then((channel) => {
    if (!channel.isText()) throw new Error('not a text channel')
    return channel.send(msg);
  }).then(message => {
    console.log(`message send ${message}`);
  }).catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

module.exports = {
  sendMsg,
  env
}
