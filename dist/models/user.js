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
exports.showToken = exports.createToken = exports.compare = exports.encrypt = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: 1, trim: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
});
exports.encrypt = async (password) => {
    const salt = await bcrypt_1.default.genSalt(12);
    const hash = await bcrypt_1.default.hash(password, salt);
    return hash;
};
async function compare(password, userpassword) {
    //fetch user from db
    const compare = await bcrypt_1.default.compare(password, userpassword);
    return compare;
}
exports.compare = compare;
function createToken(useremail) {
    const secret = "secret to be in .env file";
    const email = { email: useremail };
    const dataToTokenise = jsonwebtoken_1.default.sign(email, secret, { expiresIn: "7d" });
    return dataToTokenise;
}
exports.createToken = createToken;
function showToken(token) {
    const secret = "secret to be in .env file";
    const getdetails = jsonwebtoken_1.default.verify(token, secret);
    return getdetails;
}
exports.showToken = showToken;
exports.default = mongoose_1.default.model("User", UserSchema);
