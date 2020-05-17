import * as Schema from '../api/twitter/schema';
import * as AnalysisSchema from './schema';
import MinifyTweet from './common/minifyTweet';
import MinifyUser from './common/minifyUser';
import TwitterAPI from '../api/twitter';
import {twitter} from '../config';

const apiClient = new TwitterAPI(twitter);

const MAX_MENTIONS = 1000;

export default async function AnalyzeUser(screen_name: string) : Promise<AnalysisSchema.IUserAnalysisReport>{
    let report:AnalysisSchema.IUserAnalysisReport = {
        tweet_report: null,
        mentions_report: null,
        user: null
    };

    // Searching user tweets
    let {tweets:user_tweets} = await apiClient.searchTweets({
        q: `from:${screen_name}`,
        count: 100
    });

    // Searching user mentions
    console.log('Searching user mentions...');
    let user_mentions: Schema.ITweet[] = [];
    let next_results:string = null;

    while(user_mentions.length < MAX_MENTIONS){
        let {tweets, search_metadata} = await apiClient.searchTweets({
            q: `@${screen_name}`,
            count: 100,
            next_results
        });
        console.log(`Loaded ${tweets.length} tweets.`);

        // merge tweets into user_mentions[]
        user_mentions = [...user_mentions, ...tweets];

        if(!search_metadata.next_results){
            console.log('No more tweets. Breaking loop...');
            break;
        }

        next_results = search_metadata.next_results;
    }
    console.log(`Found ${user_mentions.length} tweets.`)

    if(user_tweets.length){
        report.user = user_tweets[0].user;
    }
    else {
        report.user = null;
    }

    console.log('Analyzing user tweets...');
    report.tweet_report = await AnalyzeUserTweets(user_tweets);
    console.log('Analyzing user mentions...');
    report.mentions_report = AnalyzeUserMentions(user_mentions);
    
    console.log('Report generated.');
    return report;
}


const AnalyzeUserTweets = async(tweets: Schema.ITweet[]): Promise<AnalysisSchema.IUserTweetsReport> => {
    let report: AnalysisSchema.IUserTweetsReport = {
        count: null,
        activity_timeline: null,
        most_popular_tweet: null,
        most_retweeted_tweet: null,
        consistent_followers: null
    };

    let count: number = 0, activity_timeline: AnalysisSchema.IMinifiedTweet[] = [];
    let most_popular_tweet: AnalysisSchema.IMinifiedTweet = null, mostFavs = 0;
    let most_retweeted_tweet: AnalysisSchema.IMinifiedTweet = null, mostRts = 0;

    tweets.forEach(tweet => {
        count++;

        // add to activity timeline
        activity_timeline.push(MinifyTweet(tweet, false));

        // compare tweet popularity with most popular one
        if(mostFavs < tweet.meta.favorite_count){
            mostFavs = tweet.meta.favorite_count;
            most_popular_tweet = MinifyTweet(tweet);
        }

        // compare tweet retweets with most retweeted one
        if(mostRts < tweet.meta.retweet_count){
            mostRts = tweet.meta.retweet_count;
            most_retweeted_tweet = MinifyTweet(tweet);
        }
    })

    report.activity_timeline = activity_timeline;
    report.count = count;
    report.most_popular_tweet = most_popular_tweet;
    report.most_retweeted_tweet = most_retweeted_tweet;

    return report;
}

const AnalyzeUserMentions = (mentions: Schema.ITweet[]): AnalysisSchema.IUserMentionsReport => {
    let report: AnalysisSchema.IUserMentionsReport = {
        mentions_activity_timeline: null,
        distinct_locations: null,
        most_popular_mention: null,
        most_retweeted_mention: null,
        consistent_promoters: null
    };

    let distinct_locations: string[] = [], mentions_activity_timeline:number[] = [];
    let promoter_users: AnalysisSchema.IMinifiedUser[] = [];
    let most_popular_mention: AnalysisSchema.IMinifiedTweet = null, mostFavs = 0;
    let most_retweeted_mention: AnalysisSchema.IMinifiedTweet = null, mostRTs = 0;
    
    let promoter_screen_names:string[] = [], promoter_mention_counts:number[] =[];

    mentions.forEach((mention, index) => {
        // store mention timestamp
        mentions_activity_timeline.push(new Date(mention.created_at).valueOf());

        // store user location if new
        if(!distinct_locations.includes(mention.user.location)){
            distinct_locations.push(mention.user.location);
        }

        // check for popular mention
        if(mostFavs < mention.meta.favorite_count){
            mostFavs = mention.meta.favorite_count;
            most_popular_mention = MinifyTweet(mention);
        }

        // check for most shared mention
        if(mostRTs < mention.meta.retweet_count){
            mostRTs = mention.meta.retweet_count;
            most_retweeted_mention = MinifyTweet(mention);
        }

        // check promoter activity
        let promoter_index = promoter_screen_names.indexOf(mention.user.screen_name);
        
        // if promoter is new add it to list
        if(promoter_index === -1){
            promoter_screen_names.push(mention.user.screen_name);
            promoter_users.push(MinifyUser(mention.user));
            promoter_mention_counts.push(0);
        }
        else{
            // increase mention count for promoter
            promoter_mention_counts[promoter_index]++;
        }
    })


    report.consistent_promoters = [];
    promoter_mention_counts.forEach((mentions_count, index) => {
        if(mentions_count > 1){
            report.consistent_promoters.push({
                promoter: promoter_users[index],
                mentions_count
            })
        }
    })

    report.consistent_promoters.sort((itemA, itemB) => {
        return itemB.mentions_count - itemA.mentions_count;
    });

    report.distinct_locations =  distinct_locations;
    report.mentions_activity_timeline = mentions_activity_timeline;
    report.most_popular_mention = most_popular_mention;
    report.most_retweeted_mention = most_retweeted_mention;

    return report;
}