import Twitter from 'twitter';

export default class TwitterClient {
    private client: Twitter

    constructor(twitterOptions: Twitter.AccessTokenOptions | Twitter.BearerTokenOptions){
        this.client = new Twitter(twitterOptions);
    }

    async searchTweets(params: Twitter.RequestParams) : Promise<Twitter.ResponseData>{
        return this.client.get('search/tweets', params);
    }

    async postTweet(status: string) : Promise<Twitter.ResponseData>{
        return this.client.post('status/update', {status});
    }

    async getExtendedTweets(ids: string): Promise<Twitter.ResponseData> {
        return this.client.get(`statuses/lookup`, {id: ids, tweet_mode:'extended'});
    }
};