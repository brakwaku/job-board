import { ApolloServer } from '@apollo/server';
import { expressMiddleware as apolloExpress } from '@apollo/server/express4';
import cors from 'cors';
import express from 'express';
import { expressjwt } from 'express-jwt';
import { readFile } from 'fs/promises';
import jwt from 'jsonwebtoken';
import { createcompanyLoader, db } from './db.js';
import { resolvers } from './resolvers.js';

const PORT = 9000;
const JWT_SECRET = Buffer.from('Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt', 'base64');

const app = express();
app.use(cors(), express.json(), expressjwt({
  algorithms: ['HS256'],
  credentialsRequired: false,
  secret: JWT_SECRET,
}));

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await db.select().from('users').where('email', email).first();
  if (user && user.password === password) {
    const token = jwt.sign({ sub: user.id }, JWT_SECRET);
    res.json({ token });  
  } else {
    res.sendStatus(401);
  }
});

const typeDefs = await readFile('./schema.graphql', 'utf-8');
const context = async ({ req }) => {
  const companyLoader = createcompanyLoader();
  if (req.auth) {
    const user = await db.select().from('users').where('id', req.auth.sub).first();
    return { companyLoader, user };
  }
  return { companyLoader };
};
const apolloServer = new ApolloServer({ typeDefs, resolvers });
await apolloServer.start();
app.use('/graphql', apolloExpress(apolloServer, { context }));

app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
});
