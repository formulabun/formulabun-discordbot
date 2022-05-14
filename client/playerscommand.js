import { Util } from "discord.js";
import { idToMap } from "./maplookup.js";

const playerresponse = (players, spectator, { fullname }) => {
  const joinnames = (names) => {
    const last = names.pop();
    const init = names.join(", ");
    if (!init) return last;
    return `${init} and ${last}`;
  };

  let p_response = "";
  if (players.length === 1)
    p_response = `${players[0]} probably doing record attack`;
  else if (players.length > 1) {
    p_response = `${joinnames(players)} are racing`;
  }
  let s_response = "";
  if (spectator.length === 1) {
    s_response = `${joinnames(spectator)} is watching`;
  } else if (spectator.length >= 1) {
    s_response = `${joinnames(spectator)} are watching`;
  }
  if (!s_response && !p_response) {
    return "*cricket noises*";
  }
  if (!s_response) {
    return `${p_response} on ${fullname}.`;
  }
  if (!p_response) {
    return `${s_response} an empty ${fullname}. They might need a friend.`;
  }
  return `${p_response} on ${fullname}. ${s_response}.`.trim();
};

export default {
  descr: "show current players in the server",
  respond: async (server) => {
    const playerfiltermap = (players, filter) => {
      return players.filter(filter).map((p) => p.name);
    };
    const players = playerfiltermap(
      server.playerinfo.playerinfo,
      (p) => !p.spectator
    );
    const spectators = playerfiltermap(
      server.playerinfo.playerinfo,
      (p) => p.spectator
    );
    const mapdata = await idToMap(server.serverinfo.mapname);
    let response = playerresponse(players, spectators, mapdata);
    response = Util.escapeMarkdown(response);
    response = Util.cleanContent(response);
    return { content: response };
  },
};
