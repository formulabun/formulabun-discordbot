import { FormulaBunBotBase } from "./base.js";
import { config } from "dotenv";
import commands from "./commands.js";
import { CommandInteraction } from "discord.js";
const env = config().parsed;
const { TEST_GUILD } = config().parsed;

export class FormulaBunBotInteracive extends FormulaBunBotBase {
  constructor(param) {
    super(param);
    this.players = {};
    this.server = {};
    this.on("ready", async () => {
      await this.registercommands();
      this.on("interactionCreate", (interaction) => {
        if (interaction.isCommand()) {
          this.respond(interaction);
        }
      });
    });
  }

  async registercommands() {
    for (let c in commands) {
      if (commands.hasOwnProperty(c)) {
        let commandsObject;
        switch (process.env.DISCORDBOT_ENV) {
          case "test":
            commandsObject = (await this.guilds.fetch(TEST_GUILD)).commands;
            break;
          case "deploy":
            commandsObject = this.application.commands;
            break;
          default:
            throw "DISCORDBOT_ENV not set, possible values: test, deploy.";
        }

        try {
          await commandsObject.create({
            name: c,
            description: commands[c].descr,
            options: commands[c].options || [],
          });
          console.log(`resistered ${c}`);
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  set serverinfo(serverinfo) {
    if (!this.readyAt) return;
    this.server.serverinfo = serverinfo;
    const stat = `${serverinfo.numberofplayers} players race`;
    try {
      this.user.setActivity(stat, { type: "WATCHING" });
      if (serverinfo.numberofplayers === 0) this.user.setStatus("idle");
      else this.user.setStatus("online");
    } catch (err) {
      console.error(err);
    }
  }

  set playerinfo(playerinfo) {
    if (!this.readyAt) return;
    this.server.playerinfo = playerinfo;
  }

  set error(err) {
    if (!this.readyAt) return;
    this.user.setActivity("for a heartbeat", { type: "LISTENING" });
    this.user.setStatus("dnd");
  }

  /**
   * Responds to a command interaction.
   * @param {CommandInteraction} interaction Interaction object created from the command.
   */
  async respond(interaction) {
    const command = interaction.commandName;

    if (!this.server.serverinfo || !this.server.playerinfo) {
      return;
    }

    if (commands[command]) {
      await interaction.deferReply();

      const response = await commands[command].respond(
        this.server,
        interaction.options
      );

      await interaction.editReply({
        content: response.content,
        embeds: response.embed,
        allowedMentions: {
          parse: [],
        },
      });
    }
  }
}

export default async function login(intents=[]) {
  const client = new FormulaBunBotInteracive({
    intents,
  });
  await client.login(env.DISCORD_TOKEN);
  return client;
}
