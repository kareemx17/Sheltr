import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const secret = process.env.JWT_SECRET;

export const signToken = (data) => jwt.sign(data, secret, { expiresIn: "7d" });

export const setTokenCookie = (token) => {
  cookies().set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
};

export const getUserFromToken = () => {
  const token = cookies().get("token")?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
};
