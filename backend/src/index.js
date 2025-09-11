import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import accountRoutes from './routes/accountRoutes.js'
import { typeDefs, resolvers } from "./graphql/schema.js";
import { authMiddleware } from "./middleware/auth.js";
import loanRoutes from './routes/loanRoutes.js';
dotenv.config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(`Mongo DB connected successfully`))
  .catch((err) => console.log(err));

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  await server.start();
  app.use("/api/accounts", accountRoutes) //integrationg REST API routes
  app.use('/api/loans', loanRoutes);
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => {
        authMiddleware(req, null, () => {});
        return { user: req.user };
      },
    })
  );

  app.use(cors());

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}/graphql`);
  });
};

startServer();
