"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const organization_1 = __importDefault(require("../models/organization"));
const joi_1 = __importDefault(require("joi"));
//import { error } from "console";
async function CreateOrganization(body) {
    const { error, value } = validateOrganization(body);
    if (error) {
        return error;
    }
    let organization = new organization_1.default(value);
    return await organization.save();
}
async function getAllOrganizations() {
    const companies = await organization_1.default.find({}).exec();
    return companies;
}
async function getOrganization(arg) {
    const companyOne = await organization_1.default.findById(arg);
    if (!companyOne) {
        return "User Id not Found";
    }
    return companyOne;
}
async function UpdateOrganization(id, other) {
    let company = await organization_1.default.findByIdAndUpdate({ _id: id }, other, {
        new: true,
    });
    return company;
}
async function DeleteOrganization(id) {
    const check = await organization_1.default.findById(id);
    if (!check) {
        return "There was a problem deleting the user. User Id not Found";
    }
    organization_1.default.findByIdAndRemove({ _id: id }, (err, company) => {
        if (err) {
            console.log(err);
        }
        console.log("Company: " + (company === null || company === void 0 ? void 0 : company.organization) + " was deleted.");
    });
}
const validateOrganization = (value) => {
    const schema = joi_1.default.object({
        organization: joi_1.default.string().alphanum().min(5).max(30).required(),
        products: joi_1.default.array().items(joi_1.default.string()),
        marketValue: joi_1.default.number().integer().min(1).max(100).required(),
        address: joi_1.default.string().min(10).max(50).required(),
        ceo: joi_1.default.string().alphanum().min(5).max(20).required(),
        country: joi_1.default.string().alphanum().min(2).max(30).required(),
        noOfEmployees: joi_1.default.number().integer().min(1).max(2000),
        employees: joi_1.default.array().items(joi_1.default.string()),
    });
    return schema.validate(value, {
        abortEarly: false,
    });
};
exports.default = {
    CreateOrganization,
    getAllOrganizations,
    getOrganization,
    UpdateOrganization,
    DeleteOrganization,
    validateOrganization,
};
