import mongoose from "mongoose";



export const connectionDB = async () => {
  await mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log("Connection has been established successfully");
    })
    .catch((error) => {
      console.error("Unable to connect to the  database", error);
    });
};