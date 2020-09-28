import Organization, { ICompany } from "../models/organization";
import Joi from "joi";
//import { error } from "console";

async function CreateOrganization(body: any) {
  const { error, value } = validateOrganization(body);
  if (error) {
    return error;
  }
  let organization = new Organization(value);
  return await organization.save();
}
async function getAllOrganizations() {
  const companies = await Organization.find({}).exec();
  return companies;
}

async function getOrganization(arg: ICompany) {
  const companyOne = await Organization.findById(arg);
  if (!companyOne) {
    return "User Id not Found";
  }
  return companyOne;
}

async function UpdateOrganization(id: any, other: any) {
  let company = await Organization.findByIdAndUpdate({ _id: id }, other, {
    new: true,
  });
  return company;
}

async function DeleteOrganization(id: any) {
  const check = await Organization.findById(id);
  if (!check) {
    return "There was a problem deleting the user. User Id not Found";
  }
  Organization.findByIdAndRemove({ _id: id }, (err, company) => {
    if (err) {
      console.log(err);
    }
    console.log("Company: " + company?.organization + " was deleted.");
  });
}
const validateOrganization = (value: any) => {
  const schema = Joi.object({
    organization: Joi.string().alphanum().min(5).max(30).required(),
    products: Joi.array().items(Joi.string()),
    marketValue: Joi.number().integer().min(1).max(100).required(),
    address: Joi.string().min(10).max(50).required(),
    ceo: Joi.string().alphanum().min(5).max(20).required(),
    country: Joi.string().alphanum().min(2).max(30).required(),
    noOfEmployees: Joi.number().integer().min(1).max(2000),
    employees: Joi.array().items(Joi.string()),
  });
  return schema.validate(value, {
    abortEarly: false,
  });
};
export default {
  CreateOrganization,
  getAllOrganizations,
  getOrganization,
  UpdateOrganization,
  DeleteOrganization,
  validateOrganization,
};
