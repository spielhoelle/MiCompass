import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import * as errors from '../helpers/error';
import { Answer } from '../services/Answer';
const router = Router();

// import * as errors from '../helpers/error';

router.post('/save', async (req, res) => {
  const answer = new Answer(req.body.flow, req.body.data)
  await answer.saveAnswer()
  res.send({
    success: true
  });
});
router.get('/get', verifyToken(), async (req, res) => {
  const answer = new Answer("newAnswer", null)
  const allAnswers = await answer.getAnswers()
  if (allAnswers[0]) {
    return res.send({
      payload: allAnswers
    });
  } else {
    return errors.errorHandler(res, 'no answers found.', null);
  }
});

module.exports = router;
