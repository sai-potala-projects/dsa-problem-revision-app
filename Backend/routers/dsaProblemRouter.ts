import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { AuthenticatedRequest, getLatestProblemsList, isAuth } from '../utils';
import { Request, Response, NextFunction } from 'express';
import { UserProblemList, Problem } from '../models/ProblemListModel';

const dsaProblemRouter = express.Router();

dsaProblemRouter.post(
  '/add',
  isAuth,
  expressAsyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { _id: userObjectId } = req.userInfo;
    const { problems } = req.body;
    const savedProblems = await Problem.insertMany(problems);
    const newProblemIds: any = savedProblems.map((savedProblem: any) => savedProblem._id);
    const userProblems: any = await UserProblemList.findOne({ user: userObjectId });

    if (userProblems) {
      userProblems?.problems.push(...newProblemIds);
      await userProblems.save();
    } else {
      const firstTimeUserProblemList = new UserProblemList({ user: userObjectId, problems: [...newProblemIds] });
      await firstTimeUserProblemList.save();
    }

    const allProblems = await getLatestProblemsList(userObjectId);
    res.status(202).send({ problems: allProblems });
  })
);

dsaProblemRouter.post(
  '/edit',
  isAuth,
  expressAsyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { _id: userObjectId } = req.userInfo;
    const { problems: updateRecords } = req.body;

    for (const record of updateRecords) {
      const isUserRecordFound = await UserProblemList.findOne({
        user: userObjectId,
        'problems._id': record._id,
      });
      if (!isUserRecordFound) {
        res.status(500).send({ error: `Cannot edit problem '${record.title}' as it doesn't exist for the user.` });
        return;
      }
    }

    const updatePromises = updateRecords.map(async (record: any) => {
      const filter = { _id: record._id };
      return Problem.updateOne(filter, { $set: record });
    });

    const result = await Promise.all(updatePromises);
    const allProblems = await getLatestProblemsList(userObjectId);

    res.status(202).send({ problems: allProblems });
  })
);

dsaProblemRouter.post(
  '/get',
  isAuth,
  expressAsyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { _id: userObjectId } = req.userInfo;
    const allProblems = await getLatestProblemsList(userObjectId);
    res.status(202).send({ problems: allProblems });
  })
);

export default dsaProblemRouter;
