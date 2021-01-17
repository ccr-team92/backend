import express from "express";
import { db } from "../db";
import { midjwt } from "../auth";

export const router = express.Router();

router.get("/", midjwt, async function (req, res) {
  const conn = await db();
  res.send({
    paths: await conn.collection("paths").find({}).toArray(),
  });
});
