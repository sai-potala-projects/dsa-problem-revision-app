"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var data_1 = require("../data");
var userModel_1 = __importDefault(require("../models/userModel"));
var express_async_handler_1 = __importDefault(require("express-async-handler"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var utils_1 = require("../utils");
var userRouter = express_1.default.Router();
userRouter.get('/seed', (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var createdUsers;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, userModel_1.default.insertMany(data_1.data.users)];
            case 1:
                createdUsers = _a.sent();
                res.send({ createdUsers: createdUsers });
                return [2 /*return*/];
        }
    });
}); }));
userRouter.post('/signin', (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, userModel_1.default.findOne({ email: req.body.email })];
            case 1:
                user = _a.sent();
                if (user) {
                    if (bcryptjs_1.default.compareSync(req.body.password, user.password)) {
                        res.send({
                            _id: user._id,
                            userName: user.userName,
                            email: user.email,
                            isAdmin: user.isAdmin,
                            token: (0, utils_1.generateToken)(user),
                        });
                        return [2 /*return*/];
                    }
                    res.status(401).send({ error: 'invalid email or password' });
                }
                else {
                    res.status(401).send({ error: 'email id dosent exist' });
                }
                return [2 /*return*/];
        }
    });
}); }));
userRouter.post('/register', (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userName, email, password, hashedPassword, isEmailIdExist, newUser, createdUser;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, userName = _a.userName, email = _a.email, password = _a.password;
                return [4 /*yield*/, bcryptjs_1.default.hash(password, 10)];
            case 1:
                hashedPassword = _b.sent();
                return [4 /*yield*/, userModel_1.default.findOne({ email: email })];
            case 2:
                isEmailIdExist = _b.sent();
                if (!isEmailIdExist) return [3 /*break*/, 3];
                res.status(401).send({ error: 'email id already exist' });
                return [3 /*break*/, 5];
            case 3:
                newUser = new userModel_1.default({ userName: userName, email: email, password: hashedPassword });
                return [4 /*yield*/, newUser.save()];
            case 4:
                createdUser = _b.sent();
                res.status(200).send({
                    _id: createdUser._id,
                    userName: createdUser.userName,
                    email: createdUser.email,
                    token: (0, utils_1.generateToken)(createdUser),
                });
                _b.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); }));
exports.default = userRouter;
