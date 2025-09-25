import userModel from "../DB/models/user.model.js";
import jwt from "jsonwebtoken"



export const authentication = async(req, res, next) =>
   {
    try {
      const { authorization } = req.headers;
      const [prefix, token] = authorization.split(" ") || []
      if (!prefix || !token) {
       return res.status(404).json({message: "token doesn't exit"}) 
      }
    let signature =""
      if (prefix == "bearer")
        {
        signature = ACCESS_TOKEN_USER
        }
      else if (prefix == "admin"){
        signature = ACCESS_TOKEN_ADMIN
      }
      else {
        return res.status(400).json({message: "Invalid prefix token "}) 
        
      }
        

          // const decoded = jwt.verify(token,signature ); 
    const decoded = await verifyToken({token, SIGNATURE: signature})

    const user = await userModel.findById(decoded.id).lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user 
    return next()

    } catch (error) {
      if (error.name =="JsonWebTokenError" | error.name ==" TokenExpiredError"){
        return res.status(400).json({ message: "Invalid Token" });
      }
       return res.status(500).json({message: " Server Error ", message: error.message, error})
    }
    
}