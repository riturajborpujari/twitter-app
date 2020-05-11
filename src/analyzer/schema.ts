import * as Schema from '../api/twitter/schema';

export interface ITweetAnalysisReport{
    replies:{
        count: number,
        distinctLocations: string[],
        activityTimeline: number[],
        activityGap: ITimeValue,
        minActivityGap: ITimeValue,
        distinctUsers: string[],
        most_popular_reply: IMinifiedTweet,
        most_shared_reply: IMinifiedTweet
    },
    meta: {
        favorite_count: number,
        retweet_count: number,
        lang: string
    },
    tweet: IMinifiedTweet
};

export interface ITimeValue {
    value: number,
    denomination: string
};

export interface IMinifiedUser{
    screen_name: string,
    name: string,
    created_at: string,
    profile: {
        location: string,
        follower_count: number,
        friends_count: number,
        statuses_count: number
    }
};

export interface IMinifiedTweet{
    created_at: string,
    text: string,
    entities?: {
        hashtags?: Schema.IHashtag[],
        user_mentions?: Schema.IUserMention[]
    }
    engagement:{
        favorite_count: number,
        retweet_count: number
    },
    user?:IMinifiedUser
};

export interface IUserAnalysisReport{
    tweets: {
        count: number,
        activity_timeline: IMinifiedTweet[],
        most_mentions: string[],
        consistent_follower: IMinifiedUser[],
        most_popular_tweet: IMinifiedTweet,
        most_shared_tweet: IMinifiedTweet
    },
    mentions: {
        distinct_locations: string[],
        mention_activity_timeline: [],
        consistent_promoters: IMinifiedUser[],
        most_popular_mention: IMinifiedTweet,
        most_retweeted_mention: IMinifiedTweet
    },
    user: Schema.IUser
};