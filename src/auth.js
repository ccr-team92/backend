import ejwt from "express-jwt";

export const midjwt = ejwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ["HS256"],
});
