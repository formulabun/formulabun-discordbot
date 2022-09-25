import login from "./client/interactive.js";
//import login from "./client/base.js";
import { config } from "dotenv";
const {
  discord_token,
  website,
  kart_port,
  discordbot_update_interval
} = config().parsed;
import { getSrb2Info } from "srb2kartjs";

const client = await login();

setInterval(() => {
  getSrb2Info(
    website,
    kart_port,
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
}, parseInt(discordbot_update_interval));

client.on('debug', console.log)

process.on("SIGINT", () => {
  console.log("goodbye");
  client.destroy();
});
