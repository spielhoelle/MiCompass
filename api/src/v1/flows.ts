import { Router } from 'express';
import { Flow } from '../services/Flow';
const router = Router();

import * as errors from '../helpers/error';
import { verifyToken } from '../middleware/auth';

router.use(verifyToken());

router.post('/save', async (req, res) => {
  const flow = new Flow(req.body)
  await flow.saveFlow()

  res.send({
    success: true
  });
});
router.get('/get', async (req, res) => {
  const flow = new Flow({})
  const allFlows = await flow.getFlows()
  res.send({
    payload: allFlows[0] ? {
      model: allFlows[0].data
    } : false
  });
});

module.exports = router;
