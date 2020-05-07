# Twitter Search App
*Use Twitter API for searching tweets, retreiving replies*
This is a Node.js app Express app built using Typescript. It allows accessing the twitter API to use features
* Search for tweets
* Get extended (full) version of tweets which are more than 160 characters
* Get tweets in a simple structured format
* Get replies to tweet


## Running this app

1. Create an environment file from example `cp .env.example .env`
2. Modify the env variables for your twitter app in file `.env`
    * TWITTER_APP_API_KEY this is your twitter app api key
    * TWITTER_APP_API_SECRET this is your twitter app api secret
    * TWITTER_APP_BEARER_TOKEN=this is your twitter app bearer token
3. Install *node modules* `npm install`
4. Start project `npm start` _Or_ Start project in watch mode `npm run watch`