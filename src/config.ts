import {config} from 'dotenv';

// Load ENV variables
config();

export const twitter = {
    consumer_key: process.env.TWITTER_APP_API_KEY,
    consumer_secret: process.env.TWITTER_APP_API_SECRET,
    access_token_key: process.env.TWITTER_MYACC_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_MYACC_ACCESS_TOKEN_SECRET
}


export const environment = process.env.NODE_ENV
export const port = process.env.SERVER_PORT