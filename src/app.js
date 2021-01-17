import express from "express";

import { router as users } from './routes/users';
import { router as paths } from "./routes/paths";

export const app = express();
app.use(express.json());
app.get("/", function (req, res) {
  res.send("Trilha da vida!");
});
app.use('/users', users);
app.use("/paths", paths);
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).send();
  }
});