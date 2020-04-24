import {Response} from 'express';
import httpStatus from 'http-status-codes';
import { MongooseValidationError, IValidationError } from './ApiError';

abstract class ApiResponse{
    constructor(protected status: number, protected message: string) { }

    public send(res: Response): Response{
        return res.status(this.status).json(this)
    }
}

export class SuccessResponse<T> extends ApiResponse {
    constructor(private data: T, message: string = 'Success', ) {
        super(httpStatus.OK, message);
    }
};

export class SuccessMsgResponse extends ApiResponse {
    constructor(message:string = 'Success') {
        super(httpStatus.OK, message);
    }
};

export class ForbiddenResponse extends ApiResponse {
    constructor(message: string = 'Access Denied') {
        super(httpStatus.FORBIDDEN, message);
    }
};

export class AuthErrorResponse extends ApiResponse {
    constructor(message: string = 'Authentication failure') {
        super(httpStatus.UNAUTHORIZED, message);
    }
};

export class BadRequestResponse extends ApiResponse {
    constructor(message: string = 'Bad parameters') {
        super(httpStatus.BAD_REQUEST, message);
    }
};

export class NotFoundResponse extends ApiResponse {
    constructor(message: string = 'Not Found') {
        super(httpStatus.NOT_FOUND, message)
    }
};

export class InternalErrorResponse extends ApiResponse {
    constructor(message: string = 'Internal Server Error') {
        super(httpStatus.INTERNAL_SERVER_ERROR, message);
    }
};

export class DataValidationErrorResponse extends ApiResponse {
    private errors: IValidationError[]
    
    constructor(error: MongooseValidationError, message: string = 'Data Validation error'){
        super(httpStatus.BAD_REQUEST, message);
        this.errors = error.errors;
    }
}