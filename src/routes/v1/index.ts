import express from 'express';
import twitterRouter from './twitter';
import analyzerRouter from './analyzer';

const router = express.Router();

router.use('/twitter', twitterRouter);
router.use('/analyzer', analyzerRouter);

export default router;