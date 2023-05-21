"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
var bcryptjs_1 = __importDefault(require("bcryptjs"));
exports.data = {
    users: [
        {
            userName: 'sai',
            email: 'bhaskarpotala@gmail.com',
            password: bcryptjs_1.default.hashSync('dsaRevision@9440319767', 8),
            isAdmin: true,
        },
        {
            userName: 'test',
            email: 'test@gmail.com',
            password: bcryptjs_1.default.hashSync('test@9440319767', 8),
        },
    ],
};
