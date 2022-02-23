import Database from "better-sqlite3";

function getDB() {
  return new Database(`./db.sqlite3`);
}

function initDB() {
  const db = getDB();
  db.exec(`
CREATE TABLE IF NOT EXISTS
  EventChannels (
    channelID PRIMARY KEY
  )
  `);
  db.exec(`
CREATE TABLE IF NOT EXISTS
  UpdateChannels (
    channelID PRIMARY KEY
  )
  `);
  db.close();
}

function _getChannels(column) {
  if (column !== "UpdateChannels" && column !== "EventChannels")
    throw new Error("incorrect column name");
  const db = getDB();
  const rows = db
    .prepare(
      `
SELECT * FROM ${column}; 
  `
    )
    .all();
  db.close();
  return rows;
}

function getEventChannels() {
  return _getChannels("EventChannels");
}

function getUpdateChannels() {
  return _getChannels("UpdateChannels");
}

function _addChannel(column, channelId) {
  if (column !== "UpdateChannels" && column !== "EventChannels")
    throw new Error("incorrect column name");
  if (typeof channelId != "string")
    throw new Error("channelId must be a string");
  const db = getDB();
  db.prepare(
    `
INSERT OR IGNORE INTO ${column} VALUES (?)
  `
  ).run(channelId.toString());
  db.close();
}

function addEventChannel(channelId) {
  _addChannel("EventChannels", channelId);
}

function addUpdateChannel(channelId) {
  _addChannel("UpdateChannels", channelId);
}

export {
  addEventChannel,
  addUpdateChannel,
  getEventChannels,
  getUpdateChannels,
};
