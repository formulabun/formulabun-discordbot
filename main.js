import FormulaBunBot from "./client.js";
import { config } from "dotenv";
const { DISCORD_TOKEN, SERVER, PORT, INTERVAL } = config().parsed;
import { getSrb2Info } from "srb2kartjs";

let client = new FormulaBunBot({ intents: [] });
client.login(DISCORD_TOKEN);

setInterval(() => {
  getSrb2Info(
    SERVER,
    PORT,
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
}, parseInt(INTERVAL));

process.on("exit", () => client.detroy());
