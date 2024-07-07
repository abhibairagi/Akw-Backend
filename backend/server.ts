import express from "express";
import mongoose from "mongoose";
import cors from "cors";
require("dotenv").config();
import { json } from "body-parser";
import userRoutes from "./Routes/user";
import permissionRoutes from "./Routes/permission";

import entryRoutes from "./Routes/entry";

import Uploads from "./upload";

const app = express();

app.use(json());
app.use(cors());
app.use("/storage", express.static("storage"));

app.use("/users", userRoutes);
app.use("/permission", permissionRoutes);
app.use("/entry", entryRoutes);
app.use("/upload", Uploads);

const start = async () => {
  try {
    // console.log(process.env.MONGO_URI, "process.env.MONGO_URI");
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Database Connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}!`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();
