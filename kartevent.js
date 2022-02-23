#!/usr/bin/node
const { sendMsgToMultiple, env } = require("./functions.js");
const { getEventChannels } = require("./db.js");
const random = require("random");

const capitalize = (string) =>
  string[0].toUpperCase() + string.substring(1).toLowerCase();

const kartevent = process.argv[2];

const messages = [
  `Today's event is ${kartevent}.`,
  `I hope you like ${kartevent} because it's happening right now.`,
  `${capitalize(kartevent)} is fun, right?`,
  `I picked ${kartevent} specially for you.`,
  `Wouldn't it be funny if ${kartevent} was happening right now?`,
  `${capitalize(kartevent)}, take it or leave it.`,
  `Come play ${kartevent} right now!`,
  `We're having fun playing ${kartevent}. Won't you join us?`,
  `It's not like I want you to play ${kartevent} or something.`,
  `It's ${kartevent} time, bitches.`,
  `I hope you like ${kartevent}, because it's all you get today`,
  `${capitalize(kartevent)}.`,
  `I know ${kartevent} sucks, but will you please give it a try?`,
  `Come hop on and play some ${kartevent}.`,
  `${capitalize(kartevent)} pog.`,
  `||It's free ${kartevent}.||`,
  `${capitalize(kartevent)} is boring, dead game.`,
  `You don't want to miss ${kartevent} right?`,
  `It's every day bro with that ${kartevent} flow.`,
  `Watch out, a wild ${kartevent} appeared!`,
  `You want to play ${kartevent} and you know it.`,
  `Come play ${kartevent} or I won't like you anymore.`,
  `You probably didn't want to play ${kartevent}. Too bad.`,
  `I know we've already had ${kartevent}, but this time it'll be fun I swear.`,
];

const index = random.integer(0, messages.length - 1);
const msg = messages[index];

const channels = getEventChannels();
sendMsgToMultiple(
  msg,
  channels.map((c) => c.channelID)
);
