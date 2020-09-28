import mongoose, { Schema, Document } from "mongoose";

export interface ICompany extends Document {
  organization: string;
  createdAt: Date;
  updatedAt: Date;
  products: string[];
  marketValue: string;
  address: string;
  ceo: string;
  //id: string;
  country: string;
  noOfEmployees: number;
  employees: string[];
}

const OrganizationsSchema: Schema = new Schema({
  organization: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  products: [String],
  marketValue: { type: String, required: true },
  address: { type: String, required: true },
  ceo: { type: String },
  //id: { type: String },
  country: { type: String },
  noOfEmployees: { type: Number },
  employees: [String],
});

export default mongoose.model<ICompany>("Organization", OrganizationsSchema);
