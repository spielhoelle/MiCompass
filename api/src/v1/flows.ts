import { Router,  Request, Response } from 'express';
import { Flow } from '../services/Flow';
const router = Router();
import * as errors from '../helpers/error';
import { verifyToken } from '../middleware/auth';

router.post('/save', verifyToken(), async (req: any, res: any) => {
  const flow = new Flow(req.body)
  await flow.saveFlow()
  
  res.send({
    success: true, 
    flow
  });
});
router.get('/get', async (_: Request, res: Response) => {
  const flow = new Flow(null)
  const allFlows = await flow.getFlows()
  if (allFlows[0]) {
    return res.send({
      payload: {
        model: allFlows
      }
    });
  } else {
    return errors.errorHandler(res, 'no flows found.', null);
  }
});

module.exports = router;
