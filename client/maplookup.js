import fetch from "node-fetch";
import { config } from "dotenv";
const {
  api_server,
} = config().parsed;

import { MapNotFoundError } from "./errors.js";

export async function idToMap(mapid) {
  const url = `http://${api_server}/servers/main/maps?id=${mapid}`;
  const response = await fetch(url);
  if (!response.ok) throw new MapNotFoundError();
  return await response.json();
}

export async function searchMaps(searchString) {
  const url = `http://${api_server}/servers/main/maps?search=${searchString}`;
  const response = await fetch(url);
  if (!response.ok) throw new MapNotFoundError();
  return await response.json();
}
