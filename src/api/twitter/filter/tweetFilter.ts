import {ITweet, IUser, IUrl, IHashtag, IUserMention} from '../schema';

const FilterTweets = (_tweets: any[]): ITweet[] => {
    let tweets: ITweet[] = [];

    _tweets.forEach(item => {
        let tweet_item = FilterTweet(item);
        tweets.push(tweet_item);
    })

    return tweets;
}

const FilterTweet = (tweet: any): ITweet => {
    let {created_at, id_str, entities, user, text, full_text,
        in_reply_to_status_id_str, in_reply_to_user_id_str,in_reply_to_screen_name, 
        coordinates, place, favorite_count, retweet_count, lang, retweeted_status,
        is_quote_status, truncated} = tweet
    
    let filteredTweet: ITweet = {
        created_at,
        id_str,
        text: full_text? full_text : text,
        meta: {
            favorite_count,
            retweet_count,
            is_retweet: !retweeted_status? false: true,
            is_quote_status,
            lang,
            truncated
        },
        location_info: {
            coordinates,
            place
        },
        user: FilterUser(user),
        in_reply_to: {
            status_id_str: in_reply_to_status_id_str,
            user_id_str: in_reply_to_user_id_str,
            screen_name: in_reply_to_screen_name
        }
    }

    if(entities){
        filteredTweet.entities = FilterEntities(entities);
    }

    if(tweet.retweeted_status){
        filteredTweet.original_retweeted_status = FilterTweet(tweet.retweeted_status);
    }

    if(tweet.quoted_status){
        filteredTweet.original_quoted_status = FilterTweet(tweet.quoted_status);
    }

    return filteredTweet;
}

const FilterUser = (_user: any) => {
    let {id_str, name, screen_name, description, location, url, created_at,
        followers_count,friends_count,verified, statuses_count,
        profile_background_image_url, profile_image_url, profile_banner_url} = _user;

    let user: IUser = {
        id_str,
        name,
        screen_name,
        description,
        location,
        url,
        profile: {
            background_image_url: profile_background_image_url,
            image_url: profile_image_url,
            banner_url: profile_banner_url,
            followers_count,
            friends_count,
            meta: {
                created_at, 
                verified,
                statuses_count
            }
        }
    };

    return user;
}

const FilterEntities = (_entities: any) => {
    let {hashtags: _hashtags, 
        urls: _urls, 
        user_mentions: _user_mentions} = _entities;

    let hashtags = FilterHashtags(_hashtags);
    let urls = FilterUrls(_urls);
    let user_mentions = FilterUserMentions(_user_mentions);

    return {hashtags, urls, user_mentions};;
}

const FilterUrls = (_urls: any[]) => {
    let urls: IUrl[] = [];

    _urls.forEach(item => {
        let {url, expanded_url, indices} = item;
        let url_item: IUrl = {
            url,
            expanded_url,
            indices
        };
        urls.push(url_item)
    })

    return urls;
}

const FilterHashtags = (_hashtags: any[]) => {
    let hashtags: IHashtag[] = [];

    _hashtags.forEach(item => {
        let {text, indices} = item;

        let hashtag_item: IHashtag = {
            text,
            indices
        };
        hashtags.push(hashtag_item);
    })

    return hashtags;
}

const FilterUserMentions = (_userMentions: any[]) => {
    let userMentions: IUserMention[] = [];

    _userMentions.forEach(item => {
        let {screen_name, name, id_str, indices} = item;

        let userMentionItem: IUserMention = {
            screen_name,
            name,
            id_str,
            indices
        };
        userMentions.push(userMentionItem);
    })

    return userMentions;
}

export default FilterTweets;