import { Router } from 'express';
const router = Router();

import * as errors from '../helpers/error';
import { verifyToken } from '../middleware/auth';

router.use(verifyToken());

router.get('/get', (req, res) => {
  res.send({
    success: true
  });
});

module.exports = router;
