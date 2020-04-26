import express from 'express';
import Twitter from '../../../api/twitter';
import {twitter as twOptions} from '../../../config';        // Loads twitter app tokens, and secrets
import AsyncHandler from '../../../helper/asyncHandler';
import {SuccessResponse} from '../../../core/ApiResponse';
import {BadRequestError} from '../../../core/ApiError';

const router = express.Router();
const twitter = new Twitter(twOptions);

router.post('/search_tweets', AsyncHandler(async (req, res) => {
    let {q, ...rest} = req.body;

    if(!q){
        throw new BadRequestError(`Required search query: 'q'`)
    }
    if(!rest.count){
        // Add default tweet limit of 5 if not given
        rest.count = 5;
    }

    let data = await twitter.searchTweets({
        q,
        ...rest
    });

    return new SuccessResponse(data).send(res);
}))


router.post('/search_tweets_by_user', AsyncHandler(async (req, res) => {
    let {screen_name, q,  ...rest} = req.body;

    if(!screen_name){
        throw new BadRequestError(`Required username: 'screen_name'`)
    }
    if(!rest.count){
        // Add default tweet limit of 5 if not given
        rest.count = 5;
    }

    let data = await twitter.searchTweets({q: `from:${screen_name}`, ...rest})

    return new SuccessResponse(data).send(res);
}))

router.post('/get_extended_tweets', AsyncHandler(async (req, res) => {
    let {ids} = req.body;

    if(!ids){
        throw new BadRequestError(`Required tweet ids: 'ids'`);
    }

    let data = await twitter.getExtendedTweets(ids);

    return new SuccessResponse(data).send(res);
}))

export default router;