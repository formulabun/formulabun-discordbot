import { FormulaBunBotBase } from './base.js';
import { config } from "dotenv";
import commands from "./commands.js";
const env = config().parsed;
const { TEST_GUILD } = config().parsed;

export class FormulaBunBotInteracive extends FormulaBunBotBase {
  constructor(param) {
    super(param);
    this.players = {};
    this.server = {};
    this.on("ready", () => {
      this.registercommands();
      this.ws.on("INTERACTION_CREATE", (interaction) =>
        this.respond(interaction)
      );
    });
  }

  registercommands() {
    for (let c in commands) {
      if (commands.hasOwnProperty(c)) {
        let guild,
          application = this.api.applications(this.user.id);

        switch (process.env.DISCORDBOT_ENV) {
          case "test":
            guild = application.guilds(TEST_GUILD);
            break;
          case "deploy":
            guild = application;
            break;
          default:
            throw "DISCORDBOT_ENV not set, possible values: test, deploy.";
        }

        guild.commands
          .post({
            data: {
              name: c,
              description: commands[c].descr,
            },
          })
          .then(() => {
            console.log(`registered ${c}`);
          })
          .catch(console.error);
      }
    }
  }

  set serverinfo(serverinfo) {
    if (!this.readyAt) return;
    this.server.serverinfo = serverinfo;
    const stat = `${serverinfo.numberofplayers} players race`;
    this.user
      .setActivity(stat, { type: "WATCHING" })
      .then(() => {
        if (serverinfo.numberofplayers === 0) this.user.setStatus("idle");
        else this.user.setStatus("online");
      })
      .catch(console.error);
  }

  set playerinfo(playerinfo) {
    if (!this.readyAt) return;
    this.server.playerinfo = playerinfo;
  }

  set error(err) {
    if (!this.readyAt) return;
    this.user.setActivity("for a heartbeat", { type: "LISTENING" }).then(() => {
      this.user.setStatus("dnd");
    });
  }

  respond(interaction) {
    const command = interaction.data.name;

    if (!this.server.serverinfo || !this.server.playerinfo) {
      return;
    }

    if (commands[command]) {
      const response = commands[command].respond(this.server);

      this.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: {
            content: response.content,
            embeds: response.embed,
          },
        },
      });
    }
  }
}

export default async function login() {
  const client = new FormulaBunBotInteracive();
  await client.login(env.DISCORD_TOKEN);
  return client;
}
