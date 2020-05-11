import {ITweet} from '../api/twitter/schema';
import * as AnalysisSchema from './schema';
import MinifyTweet from './common/minifyTweet';

export default async function AnalyzeTweet(tweet: ITweet): Promise<AnalysisSchema.ITweetAnalysisReport>{
    let report:AnalysisSchema.ITweetAnalysisReport = {
        meta: {
            favorite_count: tweet.meta.favorite_count,
            retweet_count: tweet.meta.retweet_count,
            lang: tweet.meta.lang
        },
        replies: {
            count: 0,
            distinctLocations: [],
            activityGap: {
                value: 0,
                denomination: ''
            },
            activityTimeline: [],
            distinctUsers: [],
            minActivityGap: {
                value: 0,
                denomination: ''
            }
        },
        tweet: null
    };

    let lastActivityAt = new Date(tweet.created_at).valueOf();
    let totalActivityGap = 0, minActivityGap = Number.POSITIVE_INFINITY;
    let mostFavs = 0, mostRTs = 0, popularIndex = -1, mostRTsIndex = -1;

    tweet.replies.forEach((reply, index) => {
        report.replies.count++;

        // if user is unique, add it
        if(!report.replies.distinctUsers.includes(reply.user.screen_name)){
            report.replies.distinctUsers.push(reply.user.screen_name);
        }

        // if user's location is unique, add it
        if(!report.replies.distinctLocations.includes(reply.user.location)){
            report.replies.distinctLocations.push(reply.user.location);
        }

        // Add to activity timeline and calculate duration from last activity
        let activityAt = new Date(reply.created_at).valueOf();
        report.replies.activityTimeline.push(activityAt);

        let activityGap = lastActivityAt - activityAt;  // replies are loaded in reverse chronological order
        if(activityGap < 0){
            activityGap *= -1;                          // but first reply is in chronological order with the tweet itself
        }
        lastActivityAt = activityAt;                    // every reply is an activity
        
        totalActivityGap += activityGap;

        // compare minimum activity gap
        if(activityGap < minActivityGap){
            minActivityGap = activityGap;
        }

        // compare reply popularity
        if(reply.meta.favorite_count > mostFavs){
            popularIndex = index;
            mostFavs = reply.meta.favorite_count;
        }

        // compare reply retweet popularity
        if(reply.meta.retweet_count > mostRTs){
            mostRTsIndex = index;
            mostRTs = reply.meta.retweet_count;
        }
    })

    // add most popular and most retweeted reply
    if(popularIndex !== -1){
        report.replies.most_popular_reply = MinifyTweet(tweet.replies[popularIndex]);
    }
    if(mostRTsIndex != -1){
        report.replies.most_shared_reply = MinifyTweet(tweet.replies[mostRTsIndex]);
    }

    // calculate average activity Gap
    let avgActivityGap = totalActivityGap / (report.replies.count || 1);    // reply count may be zero

    avgActivityGap = parseInt(avgActivityGap.toFixed(0));                   // take not fractional values

    report.replies.activityGap = GetTimeValue(avgActivityGap);
    report.replies.minActivityGap = GetTimeValue(minActivityGap);

    if(report.replies.count > 0){
        delete tweet.replies;
        report.tweet = MinifyTweet(tweet);
    }

    return report;
}

const GetTimeValue = (timeMs: number): AnalysisSchema.ITimeValue => {
    timeMs = parseInt((timeMs / 1000).toFixed(0));      // convert ms to seconds
    let denomination:string = '';

    if(timeMs < 60){
        denomination = 'seconds'
    }
    else if(timeMs < 3600) {
        timeMs = parseInt((timeMs / 60).toFixed(0));    // convert to minutes
        denomination = 'minutes';
    }
    else{
        timeMs = timeMs / 3600;                         // convert to hours
        denomination = 'hours'
    }

    return {value: timeMs, denomination};
}