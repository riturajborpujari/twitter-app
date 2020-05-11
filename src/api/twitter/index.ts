import Twitter from 'twitter';
import FilterTweets from './filter/tweetFilter';
import { ITweet } from './schema';
import { NotFoundError } from '../../core/ApiError';
import PaginationController from './paginationController';

export interface ITweetsResponse{
    tweets: ITweet[],       // an array of tweets in our schema
    search_metadata: any    // metadata as provided in twitter response
};

export interface ITweetResponse{
    tweet: ITweet
};

export default class TwitterClient {
    private client: Twitter

    constructor(twitterOptions: Twitter.AccessTokenOptions | Twitter.BearerTokenOptions){
        this.client = new Twitter(twitterOptions);
    }

    async searchTweets(params: Twitter.RequestParams) : Promise<ITweetsResponse>{
        // Search tweets with the given params
        let response = await this.client.get('search/tweets', 
            PaginationController.setPaginationParams(params));
        
        // Filter tweets to fit our schema
        let tweets: ITweet[] = await FilterTweets(response.statuses);

        return {tweets, search_metadata: response.search_metadata};
    }

    async getMinimalTweets(ids: string): Promise<ITweetsResponse> {
        let response = await this.client.get('statuses/lookup', {id: ids, include_entities: false});

        // Filter tweets to fit our schema
        let tweets: ITweet[] = await FilterTweets(<any[]>response);
        if(tweets.length < 1){
            // no tweet found
            throw new NotFoundError('No tweet found with given ids');
        }

        else return {tweets, search_metadata: response.search_metadata};
    }

    async getExtendedTweets(ids: string): Promise<ITweetsResponse> {
        let response = await this.client.get(`statuses/lookup`, {id: ids, tweet_mode:'extended'});

        // Filter tweets to fit our schema
        let tweets: ITweet[] = await FilterTweets(<any[]>response);
        if(tweets.length < 1){
            // no tweet found
            throw new NotFoundError('No tweet found with given ids');
        }

        return {tweets, search_metadata: response.search_metadata};
    }

    async getTweetWithReplies(id: string): Promise<ITweetResponse> {
        let extendedTweets = await this.getExtendedTweets(id);

        // select the first tweet and load replies
        let tweet = extendedTweets.tweets[0];
        let repliesResp = await this.loadRepliesForTweet(tweet);

        // assign replies to tweet
        tweet.replies = repliesResp.tweets;

        return {
            tweet
        };
    }

    public async loadRepliesForTweet(tweet: ITweet) : Promise<ITweetsResponse> {
        let {user, id_str} = tweet;
        
        // save tweet's post datestamp
        let tweet_at = new Date(tweet.created_at);

        // load all replies to this user
        let allRepliesToTweet:ITweet[] = [];
        let replies:ITweetsResponse;
        let max_id = null;

        do {
            // load all replies to user
            replies = await this.searchTweets({
                q: `to:${user.screen_name}`, 
                max_id,
                include_entities: false,
                count: 100
            });
            
            // select only replies done to THIS tweet
            replies.tweets.forEach(tweet => {
                if(tweet.in_reply_to.status_id_str === id_str){
                    allRepliesToTweet.push(tweet);
                }
            })
            
            // Get max_id from next_results
            if(replies.search_metadata.next_results){
                let next = <string>replies.search_metadata.next_results;
                
                // Use PaginationController to get max_id
                max_id = PaginationController.getParameterFromQueryString(next, 'max_id');
            }
            else{
                // BREAK loop if no more results exist
                break;
            }

            // get last reply tweet's post datestamp
            let last_reply_at = new Date(replies.tweets[replies.tweets.length - 1].created_at);

            // BREAK loop if last reply is earlier than tweet itself
            if(last_reply_at.valueOf() < tweet_at.valueOf()){
                break;
            }
            
        } while (true);

        return {tweets: allRepliesToTweet, search_metadata: replies.search_metadata};
    }
};

