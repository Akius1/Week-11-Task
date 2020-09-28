import dotenv from "dotenv";
// import Users from "../schema/schema";
import User, { IUser, createToken } from "../models/user";
//import controller from "../controller/user";
dotenv.config();

export async function verifyToken(req: any) {
  const email = "andrewurom@gmail.com";

  const findUser: any = await User.findOne({ email: email });
  if (findUser === null) {
    throw new Error("Wrong Auth");
  }

  const token = createToken(findUser);
  findUser["token"] = token;
  req.headers.authorization = token;

  if (token === undefined) {
    throw new Error("failed to generate token at this time");
  }
  return req;
}
