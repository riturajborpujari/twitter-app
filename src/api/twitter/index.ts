import Twitter from 'twitter';
import FilterTweets from './filter/tweetFilter';
import { ITweet } from './schema';

export interface ITweetsResponse{
    tweets: ITweet[],
    search_metadata: any
}

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

    async getExtendedTweets(ids: string): Promise<ITweetsResponse> {
        let response = await this.client.get(`statuses/lookup`, {id: ids, tweet_mode:'extended'});

        let tweets: ITweet[] = await FilterTweets(<any[]>response);

        return {tweets, search_metadata: response.search_metadata};
    }
};