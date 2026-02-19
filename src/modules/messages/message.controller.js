import { Router } from "express";
import * as MS from "./message.service.js";
import { validation } from "../../middleware/validation.js";
import * as MV from "./message.validation.js"


const messageRouter = Router();

messageRouter.post("/",validation(MV.createMessageSchema), MS.createMessage);


export default messageRouter;