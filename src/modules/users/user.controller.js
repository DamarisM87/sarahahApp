import { Router } from "express";
import * as US from "./user.service.js";
import { authentication } from "../../middleware/authentication.js";
import { validation } from "../../middleware/validation.js";
import * as UV from "./user.validation.js"

const userRouter = Router();
userRouter.post("/signup", validation(UV.signUpSchema), US.signUp);
userRouter.post("/signin", validation(UV.signInSchema), US.signIn);
userRouter.get("/confirmEmail/:token", US.confirmEmail);
userRouter.get("/profile", authentication, US.getProfile);
userRouter.post("/signout", authentication, US.signOut);
userRouter.post("/refreshToken", US.refreshToken);

export default userRouter;