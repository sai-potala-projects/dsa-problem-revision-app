import jwt, { VerifyErrors, JwtPayload, VerifyCallback } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from './models/globalModel';
import { v4 as uuidv4 } from 'uuid';
import { UserProblemList } from './models/ProblemListModel';

export interface AuthenticatedRequest extends Request {
  userInfo?: any;
}

export const generateToken = (user: User) => {
  return jwt.sign({ ...user }, process.env.JWT_SECRET ?? '', {
    expiresIn: '1d',
  });
};

export const isAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  if (token) {
    const onlyToken = token.slice(7);

    jwt.verify(onlyToken, process.env.JWT_SECRET ?? '', (err: any, decoded: any) => {
      if (err) {
        return res.status(401).send({ message: 'Invalid Token' });
      }
      const { _doc: userInfo } = decoded;
      req.userInfo = userInfo;
      next();
    });
  } else {
    return res.status(401).send({ message: 'Token is not supplied.' });
  }
};

export const generateUniqueDataToken = () => {
  return uuidv4();
};

export const getLatestProblemsList = async (userId: any) => {
  const { problems }: any = await UserProblemList.findOne({ user: userId })
    .populate('problems')
    .select({ problems: 1, _id: 0 });

  return problems;
};