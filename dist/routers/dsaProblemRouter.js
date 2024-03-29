"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var express_async_handler_1 = __importDefault(require("express-async-handler"));
var utils_1 = require("../utils");
var ProblemListModel_1 = require("../models/ProblemListModel");
var dsaProblemRouter = express_1.default.Router();
dsaProblemRouter.post('/add', utils_1.isAuth, (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userObjectId, collectionName, problems, modifiedProblems, savedProblemsData, toBeEditedProblemsData, savedProblems, newProblemIds, userProblems, isCollectionNamePresent, firstTimeUserProblemList, response, _a, allProblems, collections;
    var _b;
    var _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                userObjectId = req.userInfo._id;
                collectionName = (req.body || '').collectionName;
                problems = req.body.problems;
                modifiedProblems = problems.map(function (problem) {
                    if (!problem.difficultyLevel) {
                        return __assign(__assign({}, problem), { difficultyLevel: 'Medium' });
                    }
                    return problem;
                });
                savedProblemsData = problems.filter(function (problem) { return !problem._id; });
                toBeEditedProblemsData = modifiedProblems.filter(function (problem) { return problem._id; });
                return [4 /*yield*/, ProblemListModel_1.Problem.insertMany(savedProblemsData)];
            case 1:
                savedProblems = _e.sent();
                newProblemIds = savedProblems.map(function (savedProblem) { return savedProblem._id; });
                return [4 /*yield*/, ProblemListModel_1.UserProblemList.findOne({ user: userObjectId })];
            case 2:
                userProblems = _e.sent();
                isCollectionNamePresent = (_c = userProblems === null || userProblems === void 0 ? void 0 : userProblems.collections) === null || _c === void 0 ? void 0 : _c.includes(collectionName);
                if (!userProblems) return [3 /*break*/, 4];
                userProblems === null || userProblems === void 0 ? void 0 : (_b = userProblems.problems).push.apply(_b, newProblemIds);
                !isCollectionNamePresent && ((_d = userProblems === null || userProblems === void 0 ? void 0 : userProblems.collections) === null || _d === void 0 ? void 0 : _d.push(collectionName));
                return [4 /*yield*/, userProblems.save()];
            case 3:
                _e.sent();
                return [3 /*break*/, 6];
            case 4:
                firstTimeUserProblemList = !isCollectionNamePresent
                    ? new ProblemListModel_1.UserProblemList({ user: userObjectId, problems: __spreadArray([], newProblemIds, true), collections: [collectionName] })
                    : new ProblemListModel_1.UserProblemList({ user: userObjectId, problems: __spreadArray([], newProblemIds, true) });
                return [4 /*yield*/, firstTimeUserProblemList.save()];
            case 5:
                _e.sent();
                _e.label = 6;
            case 6: return [4 /*yield*/, (0, utils_1.editProblemsUtil)({ userId: userObjectId, updateRecords: toBeEditedProblemsData })];
            case 7:
                response = (_e.sent()) || '';
                if (response.error) {
                    res.status(401).send({ error: response.error });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, (0, utils_1.getLatestProblemsList)(userObjectId, collectionName)];
            case 8:
                _a = _e.sent(), allProblems = _a.problems, collections = _a.collections;
                res.status(202).send({ problems: allProblems, collections: collections });
                return [2 /*return*/];
        }
    });
}); }));
dsaProblemRouter.post('/edit', utils_1.isAuth, (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userObjectId, _a, updateRecords, collectionName, _i, updateRecords_1, record, isUserRecordFound, updatePromises, result, _b, allProblems, collections;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                userObjectId = req.userInfo._id;
                _a = req.body, updateRecords = _a.problems, collectionName = _a.collectionName;
                _i = 0, updateRecords_1 = updateRecords;
                _c.label = 1;
            case 1:
                if (!(_i < updateRecords_1.length)) return [3 /*break*/, 4];
                record = updateRecords_1[_i];
                return [4 /*yield*/, ProblemListModel_1.UserProblemList.findOne({
                        user: userObjectId,
                        'problems._id': record._id,
                    })];
            case 2:
                isUserRecordFound = _c.sent();
                if (!isUserRecordFound) {
                    res.status(401).send({ error: "Cannot edit problem '".concat(record.title, "' as it doesn't exist for the user.") });
                    return [2 /*return*/];
                }
                _c.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4:
                updatePromises = updateRecords.map(function (record) { return __awaiter(void 0, void 0, void 0, function () {
                    var filter;
                    return __generator(this, function (_a) {
                        filter = { _id: record._id };
                        return [2 /*return*/, ProblemListModel_1.Problem.updateOne(filter, { $set: record })];
                    });
                }); });
                return [4 /*yield*/, Promise.all(updatePromises)];
            case 5:
                result = _c.sent();
                return [4 /*yield*/, (0, utils_1.getLatestProblemsList)(userObjectId, collectionName)];
            case 6:
                _b = _c.sent(), allProblems = _b.problems, collections = _b.collections;
                res.status(202).send({ problems: allProblems, collections: collections });
                return [2 /*return*/];
        }
    });
}); }));
dsaProblemRouter.post('/get', utils_1.isAuth, (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userObjectId, collectionName, _a, allProblems, collections;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userObjectId = req.userInfo._id;
                collectionName = req.body.collectionName;
                return [4 /*yield*/, (0, utils_1.getLatestProblemsList)(userObjectId, collectionName)];
            case 1:
                _a = _b.sent(), allProblems = _a.problems, collections = _a.collections;
                res.status(202).send({ problems: allProblems, collections: collections });
                return [2 /*return*/];
        }
    });
}); }));
dsaProblemRouter.post('/collections/get', utils_1.isAuth, (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userObjectId, collections;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userObjectId = req.userInfo._id;
                return [4 /*yield*/, (0, utils_1.getUserCollections)(userObjectId)];
            case 1:
                collections = (_a.sent()).collections;
                res.status(202).send({ collections: collections });
                return [2 /*return*/];
        }
    });
}); }));
dsaProblemRouter.post('/delete', utils_1.isAuth, (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, problemIds, collectionName, userObjectId, _b, allProblems, collections;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, problemIds = _a.problemIds, collectionName = _a.collectionName;
                userObjectId = req.userInfo._id;
                return [4 /*yield*/, ProblemListModel_1.Problem.deleteMany({ _id: { $in: problemIds } })];
            case 1:
                _c.sent();
                // Delete problems from UserProblemList collection
                return [4 /*yield*/, ProblemListModel_1.UserProblemList.updateMany({}, { $pull: { problems: { $in: problemIds } } })];
            case 2:
                // Delete problems from UserProblemList collection
                _c.sent();
                return [4 /*yield*/, (0, utils_1.getLatestProblemsList)(userObjectId, collectionName)];
            case 3:
                _b = _c.sent(), allProblems = _b.problems, collections = _b.collections;
                res.status(202).send({ problems: allProblems, collections: collections });
                return [2 /*return*/];
        }
    });
}); }));
dsaProblemRouter.post('/picker', utils_1.isAuth, (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userObjectId, _a, difficultyLevel, collectionName, userProblemList, finalProblemList, unsolvedProblems, filteredProblems, difficultyLevels, selectedDifficultyLevel_1, problemPicker, sortedProblems, problemPicker;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userObjectId = req.userInfo._id;
                _a = req.body, difficultyLevel = _a.difficultyLevel, collectionName = _a.collectionName;
                return [4 /*yield*/, (0, utils_1.getLatestProblemsList)(userObjectId, collectionName)];
            case 1:
                userProblemList = (_b.sent()).problems;
                finalProblemList = userProblemList.filter(function (problem) { return !problem.isCompleted; });
                if (!(userProblemList === null || userProblemList === void 0 ? void 0 : userProblemList.length)) {
                    res.status(401).send({ error: 'no problems found' });
                }
                unsolvedProblems = finalProblemList.filter(function (problem) { return !problem.isSolved; });
                if (unsolvedProblems.length > 0) {
                    filteredProblems = void 0;
                    if (difficultyLevel && difficultyLevel !== '') {
                        // If the desired difficulty level is provided, prioritize unsolved problems from that level
                        filteredProblems = unsolvedProblems.filter(function (problem) { return problem.difficultyLevel === difficultyLevel; });
                    }
                    else {
                        difficultyLevels = ['Easy', 'Medium', 'Hard'];
                        selectedDifficultyLevel_1 = difficultyLevels[Math.floor(Math.random() * difficultyLevels.length)];
                        filteredProblems = unsolvedProblems.filter(function (problem) { return problem.difficultyLevel === selectedDifficultyLevel_1; });
                    }
                    problemPicker = filteredProblems[0];
                    res.status(200).send({ problems: problemPicker });
                }
                else {
                    sortedProblems = finalProblemList.sort(function (a, b) {
                        // Sort based on last time solved (ascending)
                        var dateA = new Date(a.lastTimeSolved);
                        var dateB = new Date(b.lastTimeSolved);
                        return dateA.getTime() - dateB.getTime();
                    });
                    problemPicker = sortedProblems[0];
                    res.status(200).send({ problems: problemPicker });
                }
                return [2 /*return*/];
        }
    });
}); }));
exports.default = dsaProblemRouter;
