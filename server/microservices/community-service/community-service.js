import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { parse } from "graphql";

import typeDefs from "./graphql/typeDefs.js";
import resolvers from "./graphql/resolvers.js";
import connectDB from "./config/mongoose.js";
import { config } from "./config/config.js";

// Connect DB
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

await server.start();

app.use(
  "/graphql",
  expressMiddleware(server, {
    context: async ({ req, res }) => ({ req, res }),
  })
);

app.listen(config.port, () => {
  console.log(
    `🚀 Community Service running at http://localhost:${config.port}/graphql`
  );
});