import { Router, Request, Response } from 'express';
const router = Router();

import * as errors from '../helpers/error';
import { Authentication } from '../services/Authentication';
import { IUser } from '../types/user.types';
import { verifyToken } from '../middleware/auth';

router.post('/login', (req: Request, res: Response) => {
  const authentication = new Authentication();

  return authentication
    .loginUser({
      email: req.body.email,
      password: req.body.password
    })
    .then((theUser: IUser) => {
      return (
        theUser &&
        res.send({
          success: true,
          authToken: theUser.authToken,
          refreshToken: theUser.refreshToken,
          firstName: theUser.firstName,
          lastName: theUser.lastName,
          email: theUser.email
        })
      );
    })
    .catch((err: any) => {
      return errors.errorHandler(res, err.message, null);
    });
});

router.post('/validate', (req: Request, res: Response) => {
  const authentication = new Authentication();

  return authentication
    .validateToken(req.body.token)
    .then(() => {
      res.send({
        success: true
      });
    })
    .catch((err: string) => {
      res.send({
        success: false
      });
    });
});

router.use(verifyToken());

router.post('/protected', (req: Request, res: Response) => {
  res.send({
    success: true
  });
});

module.exports = router;
