import {Response} from 'express';
import {
    BadRequestResponse, 
    NotFoundResponse,
    InternalErrorResponse,
    ForbiddenResponse,
    AuthErrorResponse
} from './ApiResponse';


enum ERROR_TYPE {
    BAD_REQUEST     = 'BAD_REQUEST',
    FORBIDDEN       = 'FORBIDDEN',
    NOT_FOUND       = 'NOT_FOUND',
    INTERNAL_ERROR  = 'INTERNAL_ERROR',
    AUTHENTICATION  = 'AUTHENTICATION'

}

export abstract class ApiError extends Error {
    constructor(public type: ERROR_TYPE, public message:string = 'Error') {
        super(type);
    }

    public static handle(err: ApiError, res: Response): Response {
        switch(err.type){
            case ERROR_TYPE.BAD_REQUEST:
                return new BadRequestResponse(err.message).send(res);
            case ERROR_TYPE.FORBIDDEN:
                return new ForbiddenResponse(err.message).send(res);
            case ERROR_TYPE.INTERNAL_ERROR:
                return new InternalErrorResponse(err.message).send(res);
            case ERROR_TYPE.NOT_FOUND:
                return new NotFoundResponse(err.message).send(res);
            case ERROR_TYPE.AUTHENTICATION:
                return new AuthErrorResponse(err.message).send(res);
        }
    }
}

export class BadRequestError extends ApiError {
    constructor(message: string = 'Bad parameters') {
        super(ERROR_TYPE.BAD_REQUEST, message);
    }
};

export class ForbiddenError extends ApiError{
    constructor(message: string = 'Access Denied') {
       super(ERROR_TYPE.FORBIDDEN, message);
    }
};

export class InternalError extends ApiError {
    constructor(message: string = 'Internal Server Error') {
        super(ERROR_TYPE.INTERNAL_ERROR, message);
    }
};

export class NotFoundError extends ApiError {
    constructor(message: string = 'Not found') {
        super(ERROR_TYPE.NOT_FOUND, message);
    }
};

export class AuthError extends ApiError {
    constructor(message: string = 'Invalid credentials') {
        super(ERROR_TYPE.AUTHENTICATION, message);
    }
};