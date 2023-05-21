import express from 'express';
import { data } from '../data';
import User from '../models/userModel';
import expressAsyncHandler from 'express-async-handler';
import bycrpt from 'bcryptjs';
import { generateToken } from '../utils';
import { Request, Response, NextFunction } from 'express';

const userRouter = express.Router();

userRouter.get(
  '/seed',
  expressAsyncHandler(async (req: Request, res: Response) => {
    //await User.deleteMany({});
    const createdUsers = await User.insertMany(data.users);
    res.send({ data: createdUsers });
  })
);

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req: Request, res: Response) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bycrpt.compareSync(req.body.password, user.password)) {
        res.send({
          data: {
            _id: user._id,
            userName: user.userName,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user),
          },
        });
        return;
      }
      res.status(401).send({ error: 'invalid email or password' });
    } else {
      res.status(553).send({ error: 'email id dosent exist' });
    }
  })
);

userRouter.post(
  '/register',
  expressAsyncHandler(async (req: Request, res: Response) => {
    const { userName, email, password } = req.body;
    const hashedPassword = await bycrpt.hash(password, 10);
    const isEmailIdExist = await User.findOne({ email });
    if (isEmailIdExist) {
      res.status(409).send({ error: 'user id already exist' });
    } else {
      const newUser = new User({ userName, email, password: hashedPassword });
      const createdUser = await newUser.save();
      res.status(200).send({
        data: {
          _id: createdUser._id,
          userName: createdUser.userName,
          email: createdUser.email,
          token: generateToken(createdUser),
        },
      });
    }
  })
);

export default userRouter;
