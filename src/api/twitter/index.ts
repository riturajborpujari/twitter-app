import Twitter from 'twitter';
import FilterTweets from './filter/tweetFilter';
import { ITweet } from './schema';
import { NotFoundError } from '../../core/ApiError';

export interface ITweetsResponse{
    tweets: ITweet[],
    search_metadata: any
};

export interface ITweetWithRepliesResponse {
    tweets: ITweet[],
    replies: ITweet[],
    search_metadata: any
};

export default class TwitterClient {
    private client: Twitter

    constructor(twitterOptions: Twitter.AccessTokenOptions | Twitter.BearerTokenOptions){
        this.client = new Twitter(twitterOptions);
    }

    async searchTweets(params: Twitter.RequestParams) : Promise<ITweetsResponse>{
        let response = await this.client.get('search/tweets', params);

        let tweets: ITweet[] = await FilterTweets(response.statuses);

        return {tweets, search_metadata: response.search_metadata};
    }

    async postTweet(status: string) : Promise<Twitter.ResponseData>{
        return this.client.post('status/update', {status});
    }

    async getMinimalTweets(ids: string): Promise<ITweetsResponse> {
        let response = await this.client.get('statuses/lookup', {id: ids, include_entities: false});

        let tweets: ITweet[] = await FilterTweets(<any[]>response);
        if(tweets.length < 1){
            // no tweet found
            throw new NotFoundError('No tweet found with given ids');
        }

        else return {tweets, search_metadata: response.search_metadata};
    }

    async getExtendedTweets(ids: string): Promise<ITweetsResponse> {
        let response = await this.client.get(`statuses/lookup`, {id: ids, tweet_mode:'extended'});

        let tweets: ITweet[] = await FilterTweets(<any[]>response);
        if(tweets.length < 1){
            // no tweet found
            throw new NotFoundError('No tweet found with given ids');
        }

        return {tweets, search_metadata: response.search_metadata};
    }

    async getTweetWithReplies(id: string): Promise<ITweetWithRepliesResponse> {
        let minimalTweets = await this.getMinimalTweets(id);

        let tweet = minimalTweets.tweets[0];
        let repliesResp = await this.loadRepliesForTweet(tweet);

        return {
            tweets: minimalTweets.tweets, 
            replies: repliesResp.tweets, 
            search_metadata: repliesResp.search_metadata
        };
    }

    private async loadRepliesForTweet(tweet: ITweet) : Promise<ITweetsResponse> {
        let {user, id_str} = tweet;
        let replies = await this.searchTweets({q: `to:${user.screen_name}`, include_entities: false});

        // select only thos replies done to this tweet
        let repliesToTweet = replies.tweets.filter(tweet => {
            if(tweet.in_reply_to.status_id_str === id_str){
                return true;
            }
        })

        return {tweets: repliesToTweet, search_metadata: replies.search_metadata};
    }
};