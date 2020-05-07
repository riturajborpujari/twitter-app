import {config} from 'dotenv';

// Load ENV variables
config();

export const twitter = {
    consumer_key: process.env.TWITTER_APP_API_KEY,
    consumer_secret: process.env.TWITTER_APP_API_SECRET,
    bearer_token: process.env.TWITTER_APP_BEARER_TOKEN
}


export const environment = process.env.NODE_ENV
export const port = process.env.SERVER_PORT