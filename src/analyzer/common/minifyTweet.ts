import * as TweetsSchema from '../../api/twitter/schema';
import * as AnalysisSchema from '../schema';
import MinifyUser from './minifyUser';

export default function MinifyTweet(full_tweet: TweetsSchema.ITweet, include_user:boolean = true): AnalysisSchema.IMinifiedTweet {
    let minified_tweet:AnalysisSchema.IMinifiedTweet =  {
        created_at: full_tweet.created_at,
        text: full_tweet.text,
        engagement: {
            favorite_count: full_tweet.meta.favorite_count,
            retweet_count: full_tweet.meta.retweet_count
        }
    };

    if(full_tweet.entities){
        minified_tweet.entities = {};
        let hashtagsFound = false, mentionsFound = false;

        if(full_tweet.entities.hashtags.length){            
            hashtagsFound = true;
            minified_tweet.entities.hashtags = full_tweet.entities.hashtags;
        }
        if(full_tweet.entities.user_mentions.length){
            mentionsFound = true;
            minified_tweet.entities.user_mentions = full_tweet.entities.user_mentions;
        }

        if(!hashtagsFound && !mentionsFound) {
            delete minified_tweet.entities;
        }
    }

    if(include_user){
        minified_tweet.user = MinifyUser(full_tweet.user);
    }

    return minified_tweet;
}