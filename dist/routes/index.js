"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
// import Users from "../schema/schema";
const user_1 = __importStar(require("../models/user"));
//import controller from "../controller/user";
dotenv_1.default.config();
async function verifyToken(req) {
    const email = "andrewurom@gmail.com";
    const findUser = await user_1.default.findOne({ email: email });
    if (findUser === null) {
        throw new Error("Wrong Auth");
    }
    const token = user_1.createToken(findUser);
    findUser["token"] = token;
    req.headers.authorization = token;
    if (token === undefined) {
        throw new Error("failed to generate token at this time");
    }
    return req;
}
exports.verifyToken = verifyToken;
