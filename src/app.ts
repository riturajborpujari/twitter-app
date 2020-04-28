import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import httpStatus from 'http-status-codes';
import { ApiError, NotFoundError } from './core/ApiError';
import { port, environment } from './config';      // Load ENV variables
import routesV1 from './routes/v1';

const app = express();

app.use(bodyParser.json())
app.use('/api/v1', routesV1);

// Raise NotFound Error if no route matches
app.use((req, res, next) => next(new NotFoundError()))

// Middleware Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApiError) {
        ApiError.handle(err, res);
    }
    else {
        if (environment === 'development') {
            console.error(err)
        }

        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR),
            message: err.message
        })
    }
})

app.listen(port, _ => {
    console.log(`Server started on http://localhost:${port}`)
})