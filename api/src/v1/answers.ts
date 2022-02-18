import { Router } from 'express';
import * as errors from '../helpers/error';
import { Answer } from '../services/Answer';
const router = Router();

// import * as errors from '../helpers/error';

router.post('/save', async (req, res) => {
  const answer = new Answer(req.body.answers)
  await answer.saveAnswer()
  res.send({
    success: true
  });
});
router.get('/get', async (req, res) => {
  const answer = new Answer(null)
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
