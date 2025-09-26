import { Router } from "express";
import * as UC from "./user.service.js";
import { authentication } from "../../middleware/authentication.js";
import { validation } from "../../middleware/validation.js";
import * as UV from "./user.validation.js"

const userRouter = Router();
userRouter.post("/signup", validation(UV.signUpSchema), UC.signUp);
userRouter.post("/signin", validation(UV.signInSchema), UC.signIn);
userRouter.get("/confirmEmail/:token", UC.confirmEmail);
userRouter.get("/profile", authentication, UC.getProfile);
userRouter.post("/signout", authentication, UC.signOut);


export default userRouter;