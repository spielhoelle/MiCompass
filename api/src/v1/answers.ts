import { Router } from 'express';
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

module.exports = router;
