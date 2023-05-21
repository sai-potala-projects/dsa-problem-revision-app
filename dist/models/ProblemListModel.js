"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProblemList = exports.Problem = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var problemSchema = new mongoose_1.default.Schema({
    problemTitle: { type: String, required: true, minLength: 5, maxlength: 300, unique: true },
    problemStatement: { type: String, default: '' },
    difficultyLevel: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    url: { type: String, default: '' },
    isSolved: { type: Boolean, default: false },
    timesSolved: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false },
    notes: { type: String, default: '' },
}, { timestamps: true });
var userProblemListSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    problems: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Problem', required: true, unique: true }],
}, { timestamps: true });
exports.Problem = mongoose_1.default.model('Problem', problemSchema);
exports.UserProblemList = mongoose_1.default.model('UserProblemList', userProblemListSchema);
