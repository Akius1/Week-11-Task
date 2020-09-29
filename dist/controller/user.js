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
const user_1 = __importStar(require("../models/user"));
const joi_1 = __importDefault(require("joi"));
async function CreateUser(body) {
    const { error, value } = validateUser(body);
    if (error) {
        return error;
    }
    const hash = await user_1.encrypt(value.password).then((res) => res);
    //console.log(hash);
    if (hash) {
        let user = new user_1.default({
            email: value.email,
            firstName: value.firstName,
            lastName: value.lastName,
            password: hash,
        });
        return await user.save();
    }
}
async function getAllUsers() {
    const users = await user_1.default.find({}).exec();
    return users;
}
async function getUser(arg) {
    const { email, password } = arg;
    return await user_1.default.find({ email: email })
        .exec()
        .then(async (result) => {
        return await user_1.compare(password, result[0].password).then((match) => {
            if (match) {
                return result[0];
            }
            else {
                return "Email or Password does not match";
            }
        });
    })
        .catch((error) => error);
}
const validateUser = (value) => {
    const schema = joi_1.default.object({
        firstName: joi_1.default.string().alphanum().min(3).max(30).required(),
        lastName: joi_1.default.string().alphanum().min(3).max(30).required(),
        email: joi_1.default.string().email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "net"] },
        }),
        password: joi_1.default.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    });
    return schema.validate(value, {
        abortEarly: false,
    });
};
exports.default = {
    CreateUser,
    validateUser,
    getAllUsers,
    getUser,
};
