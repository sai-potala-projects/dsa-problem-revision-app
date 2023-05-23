import mongoose from 'mongoose';
import { generateUniqueDataToken } from '../utils';

const problemSchema = new mongoose.Schema(
  {
    problemTitle: { type: String, required: true, minLength: 5, maxlength: 300 },
    problemStatement: { type: String, default: '' },
    difficultyLevel: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    url: { type: String, default: '' },
    isSolved: { type: Boolean, default: false },
    timesSolved: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

const userProblemListSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    problems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true, unique: true }],
  },
  { timestamps: true }
);

export const Problem = mongoose.model('Problem', problemSchema);
export const UserProblemList = mongoose.model('UserProblemList', userProblemListSchema);
