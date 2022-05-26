import path from "path";
import { config } from "dotenv";
const {
  website
} = config().parsed;
import { MessageEmbed } from "discord.js";

import maplookup from "./mapcommand.js";
import players from "./playerscommand.js";

const join = {
  descr: "explain how to join this epic server",
  respond: async () => {
    return {
      embed: [
        new MessageEmbed()
          .setColor("#ffcece")
          .setTitle("Joining this server")
          .setURL(`http://${website}`)
          .addField(
            "Option one:",
            `type \`${website}\` into the **join a game** field`
          )
          .addField(
            "Option two:",
            `create a \`kartexec.cfg\` file in your srb2kart folder and add the following line:
> alias joinserver "connect ${website}"
and join the server by opening the console with using the \\\` key and enter \`joinserver\`
`
          )
          .addField(
            "Option three:",
            `Copy paste the following url into your browser (when supported on your device) \`srb2kart://ip/${website}\``
          ),
      ],
    };
  },
};

export default {
  players,
  join,
  maplookup,
};
