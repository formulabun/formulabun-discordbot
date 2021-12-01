#!/usr/bin/node
const { readFile } = require('fs/promises');
const {sendMsgToMultiple, env} = require("./functions.js");
const { getUpdateChannels } = require('./db.js');

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
  var text = `**The server addons have been updated!**\n`;

  const formatMap = (file) => `  • ${file}`;
  if(added.length !== 0) {
    text += (
`added:
${added.map(formatMap).join('\n')}\n`
    )
  }

  if(removed.length !== 0) {
    text += (
`removed:
${removed.map(formatMap).join('\n')}`
    )
  }

  //console.log(text)
  return text; 
}).then((msg) => {
  if(!msg) return
  return getUpdateChannels().then(channels => 
    sendMsgToMultiple(msg, channels.map(c => c.channelID))
  );
});
