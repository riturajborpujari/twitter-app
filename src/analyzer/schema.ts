import * as Schema from '../api/twitter/schema';

export interface ITweetAnalysisReport {
    replies: {
        count: number,
        distinctLocations: string[],
        activityTimeline: number[],
        activityGap: ITimeValue,
        minActivityGap: ITimeValue,
        distinctUsers: string[],
        most_popular_reply?: IMinifiedTweet,
        most_shared_reply?: IMinifiedTweet
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

export interface IMinifiedUser {
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

export interface IMinifiedTweet {
    created_at: string,
    text: string,
    entities?: {
        hashtags?: Schema.IHashtag[],
        user_mentions?: Schema.IUserMention[]
    }
    engagement: {
        favorite_count: number,
        retweet_count: number
    },
    user?: IMinifiedUser
};

export interface IUserTweetsReport {
    count: number,
    activity_timeline: IMinifiedTweet[],
    consistent_followers?: IMinifiedUser[],
    most_popular_tweet: IMinifiedTweet,
    most_retweeted_tweet: IMinifiedTweet
};

export interface IUserMentionsReport {
    distinct_locations: string[],
    mentions_activity_timeline: number[],
    consistent_promoters: {
        promoter: IMinifiedUser,
        mentions_count: number
    }[],
    most_popular_mention: IMinifiedTweet,
    most_retweeted_mention: IMinifiedTweet
};

export interface IUserAnalysisReport {
    tweet_report: IUserTweetsReport,
    mentions_report: IUserMentionsReport,
    user: Schema.IUser
};