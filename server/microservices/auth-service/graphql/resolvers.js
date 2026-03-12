import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { config } from "../config/config.js";


const createToken = (user) => {
  if (!config.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    config.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

const resolvers = {

  Query: {
    me: async (_, __, { req }) => {
      console.log("🔍 Debugging context (me):", !!req);

      if (!req) {
        throw new Error("Request object missing");
      }

      const token =
        req.cookies?.token ||
        req.headers.authorization?.split(" ")[1];

      if (!token) {
        throw new Error("Not authenticated");
      }

      try {
        console.log("🔐 JWT_SECRET in resolvers:", config.JWT_SECRET);

        const decoded = jwt.verify(token, config.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) {
          throw new Error("User not found");
        }

        return user;
      } catch (error) {
        console.error("🚨 Token verification failed:", error.message);
        throw new Error("Not authenticated");
      }
    },
  },

  
  Mutation: {
    signup: async (_, { username, email, password, role }) => {
      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });

      if (existingUser) {
        throw new Error("Username or email already in use");
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        role,
      });

      const token = createToken(user);

      return {
        token,
        user,
      };
    },

    login: async (_, { email, password }, { res }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Invalid credentials");
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new Error("Invalid credentials");
      }

      const token = createToken(user);

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      console.log("✅ Auth cookie set:", res.getHeaders()["set-cookie"]);

      return {
        token,
        user,
      };
    },

    logout: async (_, __, { res }) => {
      res.clearCookie("token");
      return true;
    },
  },
};

export default resolvers;