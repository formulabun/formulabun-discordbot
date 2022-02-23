import FormulaBunBot from './client.js';
import {config} from 'dotenv';
const env = config().parsed;


let client = new FormulaBunBot({intents: []});
client.login(env.DISCORD_TOKEN);

setInterval(() => client.updateData(), parseInt(env.INTERVAL));
