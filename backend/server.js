import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
dotenv.config();
app.use(cors());

app.use("/api", routes);

app.listen(5000, () => {
  console.log("Server running at 5000 port...");
});