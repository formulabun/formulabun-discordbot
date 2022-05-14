import { Client } from "discord.js";
import path from "path";
import { config } from "dotenv";
const env = config().parsed;

import login from "./client/base.js";

function sendMsgToMultiple(msg, channels) {
  login().then((client) => {
    return client
      .sendMessageToMultiple(msg, channels)
      .then(() => client.destroy());
  });
}

function sendMsg(msg, channel) {
  login()
    .then((client) => {
      client.sendMessage(msg, channel);
    })
    .then(client.destroy);
}

export { sendMsg, sendMsgToMultiple, env };
