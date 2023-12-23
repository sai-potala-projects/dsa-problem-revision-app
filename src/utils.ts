import jwt, { VerifyErrors, JwtPayload, VerifyCallback } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from './models/globalModel';
import { v4 as uuidv4 } from 'uuid';
import { Problem, UserProblemList } from './models/ProblemListModel';

export interface AuthenticatedRequest extends Request {
  userInfo?: any;
  collectionName?: string;
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

export const getLatestProblemsList = async (userId: any, collectionName: string) => {
  const response: any = await UserProblemList.findOne({ user: userId })
    .populate({
      path: 'problems',
      match: { collectionName: collectionName }, // Specify the condition to match the collectionName in the 'problems' array
    })
    .select({ problems: 1, _id: 0, collections: 1 });

  const problems = response?.problems || [];
  const collections = response?.collections;
  return { problems, collections };
};

export const getUserCollections = async (userId: any) => {
  const collectionResponse: any = await UserProblemList.findOne({ user: userId });

  const collections = collectionResponse?.collections || [];
  return { collections };
};

export const editProblemsUtil = async ({ userId, updateRecords }: any) => {
  for (const record of updateRecords) {
    const isUserRecordFound = await UserProblemList.findOne({
      user: userId,
      problems: record._id,
    });

    if (!isUserRecordFound) {
      return { error: `Cannot edit problem '${record.title}' as it doesn't exist for the user.` };
    }
  }

  const updatePromises = updateRecords.map(async (record: any) => {
    const filter = { _id: record._id };
    return Problem.updateOne(filter, { $set: record });
  });

  await Promise.all(updatePromises);
};
