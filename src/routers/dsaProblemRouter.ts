import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { AuthenticatedRequest, editProblemsUtil, getLatestProblemsList, isAuth } from '../utils';
import { Request, Response, NextFunction } from 'express';
import { UserProblemList, Problem } from '../models/ProblemListModel';

const dsaProblemRouter = express.Router();

dsaProblemRouter.post(
  '/add',
  isAuth,
  expressAsyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { _id: userObjectId } = req.userInfo;
    const { problems } = req.body;
    const modifiedProblems = problems.map((problem: any) => {
      if (!problem.difficultyLevel) {
        return { ...problem, difficultyLevel: 'Medium' };
      }
    });
    const savedProblemsData = problems.filter((problem: any) => !problem._id);
    const toBeEditedProblemsData = modifiedProblems.filter((problem: any) => problem._id);
    const savedProblems = await Problem.insertMany(savedProblemsData);
    const newProblemIds: any = savedProblems.map((savedProblem: any) => savedProblem._id);
    const userProblems: any = await UserProblemList.findOne({ user: userObjectId });

    if (userProblems) {
      userProblems?.problems.push(...newProblemIds);
      await userProblems.save();
    } else {
      const firstTimeUserProblemList = new UserProblemList({ user: userObjectId, problems: [...newProblemIds] });
      await firstTimeUserProblemList.save();
    }

    const response: any =
      (await editProblemsUtil({ userId: userObjectId, updateRecords: toBeEditedProblemsData })) || '';

    if (response.error) {
      res.status(401).send({ error: response.error });
      return;
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
        res.status(401).send({ error: `Cannot edit problem '${record.title}' as it doesn't exist for the user.` });
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

dsaProblemRouter.post(
  '/delete',
  isAuth,
  expressAsyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { problemIds } = req.body;
    const { _id: userObjectId } = req.userInfo;

    await Problem.deleteMany({ _id: { $in: problemIds } });

    // Delete problems from UserProblemList collection
    await UserProblemList.updateMany({}, { $pull: { problems: { $in: problemIds } } });
    const allProblems = await getLatestProblemsList(userObjectId);
    res.status(202).send({ problems: allProblems });
  })
);

dsaProblemRouter.post(
  '/picker',
  isAuth,
  expressAsyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { _id: userObjectId } = req.userInfo;
    const { difficultyLevel } = req.body;

    // Fetch the user's problem list
    const userProblemList: any = await getLatestProblemsList(userObjectId);

    //filter is completed ones
    const finalProblemList: any = userProblemList.filter((problem: any) => !problem.isCompleted);

    if (!userProblemList?.length) {
      res.status(401).send({ error: 'no problems found' });
    }
    // Filter the problems based on your criteria (e.g., unsolved, difficulty level)
    const unsolvedProblems = finalProblemList.filter((problem: any) => !problem.isSolved);
    if (unsolvedProblems.length > 0) {
      let filteredProblems;

      if (difficultyLevel && difficultyLevel !== '') {
        // If the desired difficulty level is provided, prioritize unsolved problems from that level
        filteredProblems = unsolvedProblems.filter((problem: any) => problem.difficultyLevel === difficultyLevel);
      } else {
        // If no difficulty level is specified, select randomly from all difficulty levels
        const difficultyLevels = ['Easy', 'Medium', 'Hard'];
        const selectedDifficultyLevel = difficultyLevels[Math.floor(Math.random() * difficultyLevels.length)];
        filteredProblems = unsolvedProblems.filter(
          (problem: any) => problem.difficultyLevel === selectedDifficultyLevel
        );
      }
      // Retrieve the first problem from the filtered list (problem picker)
      const problemPicker = filteredProblems[0];

      res.status(200).send({ problems: problemPicker });
    } else {
      // If all problems are solved, prioritize the oldest solved problem
      const sortedProblems = finalProblemList.sort((a: any, b: any) => {
        // Sort based on last time solved (ascending)
        const dateA = new Date(a.lastTimeSolved);
        const dateB = new Date(b.lastTimeSolved);
        return dateA.getTime() - dateB.getTime();
      });

      // Retrieve the first problem from the sorted list (problem picker)
      const problemPicker = sortedProblems[0];
      res.status(200).send({ problems: problemPicker });
    }
  })
);

export default dsaProblemRouter;
