import fetch from "node-fetch";
import { config } from "dotenv";
const {
  SERVER,
  API_PORT
} = config().parsed; 

import { MapNotFoundError } from "./errors.js";


export async function idToMap(mapid) {
  const url = `http://${SERVER}:${API_PORT}/servers/main/maps?id=${mapid}`
  const response = await fetch(url);
  if(!response.ok)
    throw new MapNotFoundError();
  return await response.json();
}

export async function searchMaps(searchString) {
  const url = `http://${SERVER}:${API_PORT}/servers/main/maps?search=${searchString}`
  const response = await fetch(url);
  if(!response.ok)
    throw new MapNotFoundError();
  return await response.json();
}
