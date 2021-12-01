const sqlite3 = require('sqlite3');

function getDB() {
  return new sqlite3.Database('./db.sqlite3');
}

function initDB() {
  const db = getDB();
  db.run(`
CREATE TABLE IF NOT EXISTS
  EventChannels (
    channelID PRIMARY KEY
  )
  `);
  db.run(`
CREATE TABLE IF NOT EXISTS
  UpdateChannels (
    channelID PRIMARY KEY
  )
  `);
  db.close();
}

function _getChannels(column) {
  if(column !== 'UpdateChannels' && column !== 'EventChannels') throw new Error('incorrect column name');
  const db = getDB();
  return new Promise((res, rej) => db.all(`
SELECT * FROM ${column}; 
  `, function(err, rows) {
    if (err) throw rej(err);
    return res(rows);
  }).close());
}

function getEventChannels() {
  return _getChannels('EventChannels');
}

function getUpdateChannels() {
  return _getChannels('UpdateChannels');
}

function _addChannel(column, channelId) {
  if(column !== 'UpdateChannels' && column !== 'EventChannels') throw new Error('incorrect column name');
  if(typeof channelId != 'string') throw new Error('channelId must be a string');
  const db = getDB();
  db.run(`
INSERT OR IGNORE INTO ${column} VALUES (?)
  `, channelId.toString()).close();
}

function addEventChannel(channelId) {
  _addChannel('EventChannels', channelId);
}

function addUpdateChannel(channelId) {
  _addChannel('UpdateChannels', channelId);
}

module.exports = {
  getEventChannels,
  getUpdateChannels
}
