import {Request, Response, NextFunction} from 'express';

type ASYNC_FUNCTION = (req: Request, res: Response, next: NextFunction) => Promise<any>

export default (_: ASYNC_FUNCTION) => (req: Request, res: Response, next: NextFunction) => {
    _(req, res, next).catch(next);
}