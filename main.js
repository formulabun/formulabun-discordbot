import FormulaBunBot from "./client.js";
import { config } from "dotenv";
const env = config().parsed;
import { getSrb2Info } from "srb2kartjs";

let client = new FormulaBunBot({ intents: [] });
client.login(env.DISCORD_TOKEN);

setInterval(() => {
  getSrb2Info(
    env.SERVER,
    env.PORT,
    (info) => {
      client.serverinfo = info;
    },
    (info) => {
      client.playerinfo = info;
    },
    (error) => {
      client.error = error;
    }
  );
}, parseInt(env.INTERVAL));

process.on("exit", () => client.detroy());
