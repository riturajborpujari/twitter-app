import express from 'express';
import twitterRouter from './twitter';

const router = express.Router();

router.use('/twitter', twitterRouter);

export default router;