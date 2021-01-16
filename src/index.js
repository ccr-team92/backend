import serverless from 'serverless-http';
import express from 'express';
import { body, validationResult as validation } from 'express-validator';
import bcrypt from 'bcrypt';
import ejwt from 'express-jwt';

import { db } from './db';

const app = express();
app.use(express.json());

// @TODO secret from env
const jwt = ejwt({ secret: 'shhhhhhared-secret', algorithms: ['HS256'] });

app.get('/', function (req, res) {
  res.send('Hello World!')
});
app.get('/users', jwt, async function (req, res) {
  const conn = await db();
  res.send({
    users: await conn.collection('users').find({}).toArray()
  });
});
app.post(
  '/users/register',
  [
    body('username').isLength({ min: 3 }).isAlphanumeric().isAscii(),
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('age').isNumeric(),
    body('email').custom(async (value) => {
      const conn = await db();
      const emailCount = await conn.collection('users').count({ email: value });
      if (emailCount > 0) {
        throw new Error('E-mail already registered');
      }
      return true;
    }),
    body('password').isLength({ min: 8 }).custom((value, { req }) => {
      if (value !== req.body.password_confirm) {
        throw new Error('Password does not match');
      }
      return true;
    })
  ],
  async function (req, res) {
    const errors = validation(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { body } = req;
    const conn = await db();

    const hash = bcrypt.hashSync(body.password, 10);

    const inserted = await conn.collection('users').insertOne({
      username: body.username,
      name: body.name,
      email: body.email,
      age: body.age,
      hash,
    })

    res.send({
      user: inserted.insertedId
    });
  }
);

export const handler = serverless(app);