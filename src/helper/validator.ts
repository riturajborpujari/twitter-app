import {Types} from 'mongoose';
import asyncHandler from './asyncHandler';
import { BadRequestError } from '../core/ApiError';

export const ObjectId = () => asyncHandler(async (req, res, next) => {
    let {id} = req.params;

    if(Types.ObjectId.isValid(id)){
        next();
    }
    else{
        throw new BadRequestError(`Validation failed on 'id'`);
    }
})

export default {ObjectId};