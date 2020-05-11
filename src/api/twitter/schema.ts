export interface ITweet {
    created_at: string,
    id_str: string,
    text: string,
    meta: {
        favorite_count: number,
        retweet_count: number,
        is_retweet: boolean,
        is_quote_status: boolean,
        lang: string,
        truncated: boolean
    },
    location_info: {
        coordinates?: string,
        place?: string,
    },
    user: IUser,
    in_reply_to?: {
        status_id_str?: string,
        user_id_str?: string,
        screen_name?: string
    },
    entities?: {
        urls?: IUrl[],
        hashtags?: IHashtag[],
        user_mentions?: IUserMention[]
    },
    original_retweeted_status?: ITweet,
    original_quoted_status?: ITweet,

    replies?: ITweet[]
};

export interface IUser {
    id_str: string,
    name: string,
    screen_name: string,
    description: string,
    location: string,
    url?: string,
    profile: {
        background_image_url: string,
        image_url: string,
        banner_url: string,
        followers_count: number,
        friends_count: number,
        meta: {
            created_at: string,
            verified: boolean,
            statuses_count: number
        }
    }
};

export interface IUrl {
    url: string,
    expanded_url: string,
    indices: [
        number,
        number
    ]
};

export interface IHashtag {
    text: string,
    indices: [
        number,
        number
    ]
};

export interface IUserMention {
    screen_name: string,
    name: string,
    
    id_str: string,
    indices: [
        number,
        number
    ]
}