#!/usr/bin/node
const path = require('path');
const { readFile } = require('fs/promises');
const {Client} = require('discord.js');
const env = require('dotenv').config({
  path: path.join(__dirname, ".env"),
}).parsed;

function sendMsg(msg) {
  const client = new Client();
  return client.login(env.DISCORD_TOKEN).then(() =>
    client.channels.fetch(env.UPDATE_CHANNEL)
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

function difference(oldfile, newfile) {

  return Promise.all([readFile(oldfiles), readFile(newfiles)]
  ).then(([o, n]) => { // buffers
    const toName = (o) => `${o.name}`;
    return [
      JSON.parse(String(o)).map(toName),
      JSON.parse(String(n)).map(toName)
    ];
  }).then(([o, n]) => { 
    return [
      o.filter(e => !n.includes(e)),
      n.filter(e => !o.includes(e)),
    ]
    return [o, n]
  }).then(([removed, added]) => { 
    return {removed, added};
  });
}

const oldfiles = process.argv[2];
const newfiles = process.argv[3];

difference(oldfiles, newfiles).then(({removed, added}) => {
  if( removed.length === 0 && added.length === 0) return '';
  const formatMap = (file) => `  • ${file}`;
  removed = removed.map(formatMap).join('\n');
  added = added.map(formatMap).join('\n');
  return (
`**The server addons have been updated!**
added:
${added}

removed:
${removed}`
  )
}).then(sendMsg
).then(() => {
  process.exit(0);
});
