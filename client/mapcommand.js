import {idToMap, searchMaps} from "./maplookup.js";
import { MessageEmbed } from "discord.js";
import {TooManyMapsError, MapNotFoundError, IncorrectMapIdFormat} from "./errors.js";

const MAPIDSTRING = "id";
const QUERYSTRING = "query";

async function searchMapWithId(id) {
  if(!id.match(/^(map)?..$/i)) throw new IncorrectMapIdFormat();
  return await idToMap(id);
}

async function searchMapWithQuery(query) {
  const mapDatas = await searchMaps(query);
  if (mapDatas.length == 0)
    throw new MapNotFoundError();
  if (mapDatas.length < 3)
    return mapDatas[0];
  throw new TooManyMapsError();
}

const searchOptionToSearchFunction = {
  [MAPIDSTRING]: searchMapWithId,
  [QUERYSTRING]: searchMapWithQuery,
}

function errorResponse(string) {
  return {content: string};
}

function makeEmbed(mapData) {
  const {
    mapid,
    fullname,
    thumbnail,
    hidden,
    typeoflevel,
    numlaps,
    mappack,
  } = mapData;
  let thum = thumbnail.replace("localhost:3030", "api.formulabun.club");
  let response = new MessageEmbed()
    .setColor("#ffcece")
    .setTitle(fullname)
    .setImage(thum)
  if(typeoflevel.toLowerCase() == "singleplayer") 
    response.setDescription("This map isn't in the rotation.\nIt's baaaad.");
  else if (hidden)
    response.setDescription("This is a hell map.");

  response.addField("mapid", mapid, true);
  if (typeoflevel.toLowerCase() == "race")
    response.addField("number of laps", `${numlaps}`);
  response.addField("map pack", mappack);
  return {embed: [response]};
}

export default {
  descr: "lookup a map",
  options: [
    {
      name: MAPIDSTRING,
      description: "search by id",
      type: "SUB_COMMAND",
      options: [
        {
          name: MAPIDSTRING,
          description: "map id",
          required: true,
          type: "STRING",
        }
      ]
    },
    {
      name: QUERYSTRING,
      description: "search by query string", 
      type: "SUB_COMMAND",
      options: [
        {
          name: QUERYSTRING,
          description: "search query",
          required: true,
          type: "STRING",
        }
      ]
    }
  ],
  respond: async (server, options) => {
    const subCommand = options.getSubcommand(true);
    const argument = options.getString(subCommand);

    try {
      const mapData = await searchOptionToSearchFunction[subCommand](argument);
      return makeEmbed(mapData);
    } catch(err) {
      if (err instanceof TooManyMapsError)
        return errorResponse("There were too many results for me to choose from, I just couldn't pick one.");
      if (err instanceof MapNotFoundError)
        return errorResponse("I couldn't find the map that you're looking for, sorry.");
      if (err instanceof IncorrectMapIdFormat)
        return errorResponse("A map id is `map` followed by two characters. I know you can do that.");
      console.log(err);
      return errorResponse("Something terrible went wrong, I'm really sorry.");
    }
  }
}
