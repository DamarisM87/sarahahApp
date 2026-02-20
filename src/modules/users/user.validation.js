import joi from "joi"
import { generalRules } from "../../utils/generalRules/index.js";
import { userGender } from "../../DB/models/user.model.js";


export const signUpSchema = {
  body: joi.object({
    name: joi.string().min(3).max(20).required(),
    email: generalRules.email.required(),
    password: generalRules.password.required(),
    cPassword: joi.string().valid(joi.ref("password")).required(),
    age: joi.number().min(18).max(80).required(),
    phone: joi.string().required(),
    gender: joi.string().valid(userGender.male, userGender.female).required(),
    role: joi.string().valid("user", "admin").default("user")
  }).required(),
};

export const signInSchema = {
    body: joi.object({
        email: generalRules.email.required(),
        password: generalRules.password.required(),
       

    }).required(),

   
}


export const updatePasswordSchema = {
    body: joi.object({
      oldPassword: generalRules.password.required(),
      newPassword: generalRules.password.required(),
      cPassword: joi.string().valid(joi.ref("newPassword")).required(),
       

    }).required(),

   
}


