"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importDefault(require("mongoose"));
var dsaProblemRouter_1 = __importDefault(require("./routers/dsaProblemRouter"));
var userRouter_1 = __importDefault(require("./routers/userRouter"));
var cors = require('cors');
dotenv_1.default.config();
var mongoDbUrI = (_a = process.env.MONGODB_URI) !== null && _a !== void 0 ? _a : '';
mongoose_1.default
    .connect(mongoDbUrI)
    .then(function () {
    console.log('---connected to MongoDB---');
})
    .catch(function (err) {
    console.log('mongo db connection error :', err.message);
});
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(cors());
var port = process.env.PORT || 5000;
app.listen(port, function (err) {
    if (err) {
        throw err;
    }
    console.log("server started on : ".concat(port));
});
app.get('/', function (req, res) {
    res.send('healthy');
});
app.get('/ping', function (req, res) {
    res.send('pong....');
});
app.use('/api/users', userRouter_1.default);
app.use('/api/problems', dsaProblemRouter_1.default);
app.use(function (err, req, res, next) {
    res.status(500).send({ error: err.message });
});
