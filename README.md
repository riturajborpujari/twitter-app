# Twitter Search App
*Use Twitter API for searching tweets, retreiving replies*
This is a Node.js app Express app built using Typescript. It allows accessing the twitter API to use features
* Search for tweets
* Get extended (full) version of tweets which are more than 160 characters
* Get tweets in a simple structured format
* Get replies to tweet

## Provided endpoints (all routes begin with /api/v1)
* POST at `'/search_tweets`
    * Send search parameters `q`(required), `count`, `lang`, `max_id` etc to search for tweets
    * Send `next_results` from `search_metadata` to load next results(older tweets)
    * Send `refresh_url` from `search_metadata` to refresh(load newer tweets)
    * Default count of 5 is applied if not specified
    * Returns an array of `ITweet`s along with `search_metdata`
* POST at `/search_tweets_by_user`
    * Same as previous one but search for tweets by a specific user
    * Returns an array of `ITweet`s along with `search_metdata`
* POST at `/get_extended_tweets`
    * Gets extended version of the tweets
    * Send a comma separated list of `ids` as string
    * Returns an array of `ITweet`s along with `search_metdata`
* POST at `/get_minimal_tweets`
    * Gets minimal version of the tweets(excludes entities)
    * Send a comma separated list of `ids` as string
    * Returns an array of `ITweet`s along with `search_metdata`
* POST at `/get_tweet_with_replies`
    * Gets tweet along with replies made to them
    * Send an id of a tweet `id`
    * Returns a `ITweet` containing replies


## Running this app

1. Create an environment file from example `cp .env.example .env`
2. Modify the env variables for your twitter app in file `.env`
    * TWITTER_APP_API_KEY this is your twitter app api key
    * TWITTER_APP_API_SECRET this is your twitter app api secret
    * TWITTER_APP_BEARER_TOKEN=this is your twitter app bearer token
3. Install *node modules* `npm install`
4. Start project `npm start` _Or_ Start project in watch mode `npm run watch`