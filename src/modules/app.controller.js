
import { connectionDB } from "../DB/connectionDB.js";
import { globalErrorHandling } from "../middleware/globalErrorHandling.js";
import messageRouter from "./messages/message.controller.js";
import userRouter from "./users/user.controller.js";



const bootstrap = ({ app, express }) => {
connectionDB();
  app.use(express.json());
  app.use("/users", userRouter);
  app.use("/messages", messageRouter);
  app.use("{/*demo}", (req, res, next) => {
throw new Error(`URL Not Found ${req.originalUrl} `, {cause: 404})
  });

  app.use(globalErrorHandling)
};

export default bootstrap;