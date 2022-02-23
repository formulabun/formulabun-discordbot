import { Client } from "discord.js";
import path from "path";
import {config} from 'dotenv';
const env = config().parsed;

function _sendMsg(client, msg, channel) {
  return client.channels
    .fetch(channel)
    .then((channel) => {
      if (!channel.isText()) throw new Error("not a text channel");
      return channel.send(msg);
    })
    .then((message) => {
      console.log(`message send ${message}`);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

function sendMsgToMultiple(msg, channels) {
  const client = new Client();
  client
    .login(env.DISCORD_TOKEN)
    .then(() => Promise.all(channels.map((c) => _sendMsg(client, msg, c))))
    .then(() => client.destroy());
}

function sendMsg(msg, channel) {
  const client = new Client();
  client
    .login(env.DISCORD_TOKEN)
    .then(() => _sendMsg(client, msg, channel))
    .then(() => client.destroy());
}

export {
  sendMsg,
  sendMsgToMultiple,
  env,
};
