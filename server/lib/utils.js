import jwt from "jsonwebtoken";

export const generateToken = () => {
  const token = jwt.sign({userId}, process.env.JWT_SECRET);
  return token;
};
