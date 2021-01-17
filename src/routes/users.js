import express from "express";
import { body, validationResult as validation } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { midjwt } from "../auth";

export const router = express.Router();

router.get("/", midjwt, async function (req, res) {
  const conn = await db();
  res.send({
    users: await conn.collection("users").find({}).toArray(),
  });
});
router.post(
  "/register",
  body("username").isLength({ min: 3 }).isAlphanumeric().isAscii(),
  body("name").isLength({ min: 3 }),
  body("email").isEmail(),
  body("age").isNumeric(),
  body("email").custom(async (value) => {
    const conn = await db();
    const emailCount = await conn
      .collection("users")
      .countDocuments({ email: value });
    if (emailCount > 0) {
      throw new Error("E-mail already registered");
    }
    return true;
  }),
  body("password")
    .isLength({ min: 8 })
    .custom((value, { req }) => {
      if (value !== req.body.password_confirm) {
        throw new Error("Password does not match");
      }
      return true;
    }),
  async function (req, res) {
    const errors = validation(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { body } = req;
    const conn = await db();

    const hash = bcrypt.hashSync(body.password, 10);

    const inserted = await conn.collection("users").insertOne({
      username: body.username,
      name: body.name,
      email: body.email,
      age: body.age,
      hash,
    });

    res.send({
      user: inserted.insertedId,
    });
  }
);

router.post(
  "/login",
  body("user").isLength({ min: 3 }),
  body("password").isLength({ min: 3 }),
  async function (req, res) {
    const errors = validation(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { body } = req;
    const conn = await db();
    const user = await conn.collection("users").findOne({
      $or: [{ username: body.user }, { email: body.user }],
    });
    if (!user) {
      res.send(401);
    } else {
      if (bcrypt.compareSync(body.password, user.hash)) {
        res.send({
          token: jwt.sign(
            { username: user.username },
            process.env.TOKEN_SECRET,
            {
              expiresIn: "30 days",
            }
          ),
        });
      } else {
        res.send(401);
      }
    }
  }
);
