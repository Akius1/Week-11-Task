import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: 1, trim: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
});

export const encrypt = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export async function compare(
  password: string,
  userpassword: string
): Promise<boolean> {
  //fetch user from db
  const compare = await bcrypt.compare(password, userpassword);
  return compare;
}

export function createToken(useremail: IUser): string {
  const secret = "secret to be in .env file";
  const email = { email: useremail };
  const dataToTokenise = jwt.sign(email, secret, { expiresIn: "7d" });
  return dataToTokenise;
}

export function showToken(token: string): { email: string } {
  const secret = "secret to be in .env file";
  const getdetails = jwt.verify(token, secret) as { email: string };
  return getdetails;
}

export default mongoose.model<IUser>("User", UserSchema);
