import path from "path"
import dotenv from "dotenv"
dotenv.config({path:path.resolve("src/config/.env")})
import express from "express";
import bootstrap from "./src/modules/app.controller.js";


const app = express();
const port = process.env.PORT || 5000;

bootstrap({ app, express });
app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));