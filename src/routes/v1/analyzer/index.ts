import express from 'express';
import AsyncHandler from '../../../helper/asyncHandler';
import {SuccessResponse} from '../../../core/ApiResponse';
import {BadRequestError} from '../../../core/ApiError';
import TweetAnalyzer from '../../../analyzer/tweetAnalyzer';
import UserAnalyzer from '../../../analyzer/analyzeUser';
import Twitter from '../../../api/twitter';
import {twitter as twOptions} from '../../../config';        // Loads twitter app tokens, and secrets

const router = express.Router();
const twitter = new Twitter(twOptions);

router.get('/analyze_tweet', AsyncHandler(async (req, res) => {
    let {id} = req.query;

    if(!id){
        throw new BadRequestError('Required: Tweet id `id`');
    }

    let {tweet} = await twitter.getTweetWithReplies(<string>id);
    let report = await TweetAnalyzer(tweet);

    return new SuccessResponse(report, 'Tweet Report').send(res);
}))

router.get('/analyze_user', AsyncHandler(async (req, res) => {
    let {screen_name} = req.query;

    if(!screen_name){
        throw new BadRequestError('Required: Twitter user handle `screen_name`')
    }

    let report = await UserAnalyzer(<string>screen_name);

    return new SuccessResponse(report, 'Profile report').send(res);
}))

export default router;