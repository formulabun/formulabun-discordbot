import login from "./client/interactive.js";
//import login from "./client/base.js";
import { config } from "dotenv";
const { DISCORD_TOKEN, SERVER, PORT, INTERVAL } = config().parsed;
import { getSrb2Info } from "srb2kartjs";

const client = await login()

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

process.on("SIGINT", () => {console.log("goodbye"); client.detroy()});
