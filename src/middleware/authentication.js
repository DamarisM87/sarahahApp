import userModel from "../DB/models/user.model.js";
import jwt from "jsonwebtoken"
import { verifyToken } from "../utils/token/index.js";
import revokeTokenModel from "../DB/models/revoke-token.model.js";



export const authentication = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization || req.headers.Authorization;
    if (!authorization) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const parts = authorization.split(" ");
    if (parts.length !== 2) {
      return res.status(401).json({ message: "Invalid authorization format. Use: 'Bearer <token>' or 'Admin <token>'" });
    }

    const [prefixRaw, token] = parts;
    const prefix = prefixRaw.toLowerCase();

    // Read secrets from environment (make sure dotenv.config() ran BEFORE this module is imported)
    const ACCESS_TOKEN_USER = process.env.ACCESS_TOKEN_USER;
    const ACCESS_TOKEN_ADMIN = process.env.ACCESS_TOKEN_ADMIN;

    let signature = "";
    if (prefix === "bearer") {
      signature = ACCESS_TOKEN_USER;
    } else if (prefix === "admin") {
      signature = ACCESS_TOKEN_ADMIN;
    } else {
      return res.status(400).json({ message: "Invalid token prefix. Use 'Bearer' or 'Admin'." });
    }

    if (!signature) {
      // helpful server-side error if env not loaded
      return res.status(500).json({ message: "Server misconfiguration: missing token secret." });
    }

    // verifyToken should throw on invalid/expired token
    const decoded = await verifyToken({ token, SIGNATURE: signature });

    // check if token was revoked
    const revoke = await revokeTokenModel.findOne({ tokenId: decoded.jwtid });
    if (revoke) {
      return res.status(401).json({ message: "Token revoked. Please sign in again." });
    }

    const user = await userModel.findById(decoded.id).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    req.decoded = decoded;
    return next();
  } catch (error) {
    // Proper token errors -> return 401
    if (error && (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError")) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    // let your global error handler handle everything else
    return next(error);
  }
};
    
