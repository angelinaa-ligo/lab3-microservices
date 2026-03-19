import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { parse } from "graphql";

import { config } from "./config/config.js";
import connectDB from "./config/mongoose.js";
import typeDefs from "./graphql/typeDefs.js";
import resolvers from "./graphql/resolvers.js";

console.log("🔍 JWT_SECRET in Auth Service:", config.JWT_SECRET);

await connectDB();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:4000",
      "http://localhost:4173",
      "https://studio.apollographql.com",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const schema = buildSubgraphSchema([
  {
    typeDefs: parse(typeDefs),
    resolvers,
  },
]);

const server = new ApolloServer({
  schema,
  introspection: true,
});

async function startServer() {
  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        console.log("🔍 Auth Service Cookies:", req.cookies);

        const token =
          req.cookies?.token ||
          req.headers.authorization?.split(" ")[1];

        let user = null;

        if (token) {
          try {
            const decoded = jwt.verify(token, config.JWT_SECRET);

            user = {
              id: decoded.id,
              username: decoded.username,
              role: decoded.role,
            };

            console.log("✅ Authenticated User:", user);
          } catch (err) {
            console.error("🚨 JWT verification failed:", err.message);
          }
        }

        return { user, req, res };
      },
    })
  );

  app.listen(config.port, () =>
    console.log(
      `🚀 Auth Microservice running at http://localhost:${config.port}/graphql`
    )
  );
}

startServer();