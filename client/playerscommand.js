import { Util, Formatters } from "discord.js";
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
    return `:cricket: ${Formatters.italic("cricket noises")} :cricket:`;
  }

  let response;
  if (!s_response) {
    response = `${p_response} on ${fullname}.`;
  }
  else if (!p_response) {
    response = `${s_response} an empty ${fullname}. They might need a friend.`;
  }
  else
   response = `${p_response} on ${fullname}. ${s_response}.`.trim();
  return Util.escapeMarkdown(response);
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
    let mapdata;
    try {
      mapdata = await idToMap(server.serverinfo.mapname);
    }
    catch {
      mapdata = {fullname:"a map"};
    }
    finally {
      let response = playerresponse(players, spectators, mapdata);
      response = response.replace(":", "\\:")
      response = Util.cleanContent(response);
      return { content: response };
    }
  },
};
