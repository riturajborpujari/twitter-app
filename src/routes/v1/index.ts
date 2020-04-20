import express from 'express';
import { SuccessResponse, SuccessMsgResponse} from '../../core/ApiResponse';
import { InternalError, AuthError, ForbiddenError, BadRequestError } from '../../core/ApiError';
import AsyncHandler from '../../helper/asyncHandler';

const router = express.Router();

router.get('/success', (req, res, next) => {
    return new SuccessMsgResponse().send(res);
})

router.get('/bad_request', AsyncHandler(async (req, res, next) => {
    throw new BadRequestError()
}))

router.get('/error', (req, res, next) => {
    try {
        throw new ForbiddenError()
    } catch (error) {
        next(error)
    }
})

router.get('/success_data', (req, res, next) => {
    return new SuccessResponse({owner: 'Rituraj Borpujari', info: 'API server'}).send(res);
})

export default router;