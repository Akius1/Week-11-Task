import User, {
  IUser,
  encrypt,
  compare,
  createToken,
  showToken,
} from "../models/user";
import Joi from "joi";
import controller from "../controller/organizations";

async function CreateUser(body: any) {
  const { error, value } = validateUser(body);

  if (error) {
    return error;
  }
  const hash = await encrypt(value.password).then((res) => res);
  //console.log(hash);
  if (hash) {
    let user = new User({
      email: value.email,
      firstName: value.firstName,
      lastName: value.lastName,
      password: hash,
    });
    return await user.save();
  }
}
async function getAllUsers() {
  const users = await User.find({}).exec();
  return users;
}
async function getUser(arg: any) {
  const { email, password } = arg;
  return await User.find({ email: email })
    .exec()
    .then(async (result) => {
      return await compare(password, result[0].password).then((match) => {
        if (match) {
          return result[0];
        } else {
          return "Email or Password does not match";
        }
      });
    })
    .catch((error) => error);
}

const validateUser = (value: any) => {
  const schema = Joi.object({
    firstName: Joi.string().alphanum().min(3).max(30).required(),
    lastName: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  });
  return schema.validate(value, {
    abortEarly: false,
  });
};

export default {
  CreateUser,
  validateUser,
  getAllUsers,
  getUser,
};
