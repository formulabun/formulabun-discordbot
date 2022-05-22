import { Client } from "discord.js";
import { config } from "dotenv";
const env = config().parsed;

export class FormulaBunBotBase extends Client {
  sendMessage(msg, channel) {
    return this.channels
      .fetch(channel)
      .then((channel) => {
        if (!channel.isText()) throw new Error("not a text channel");
        return channel.send(msg);
      })
      .then((message) => {
        console.log(`message send ${message} to channes ${channel}`);
      })
      .catch((e) => {
        console.error(e);
        process.exit(1);
      });
  }

  sendMessageToMultiple(msg, channels = []) {
    return Promise.all(channels.map((c) => this.sendMessage(msg, c)));
  }
}

export default async function login(intents=[]) {
  const client = new FormulaBunBotBase({
    intents,
  });
  await client.login(env.DISCORD_TOKEN);
  return client;
}
