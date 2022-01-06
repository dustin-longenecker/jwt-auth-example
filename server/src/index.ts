import { createAccessToken, createRefreshToken } from './auth';
import 'dotenv/config';
import "reflect-metadata";
// import {createConnection} from "typeorm";
import express from "express";
// import {User} from "./entity/User";
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './UserResolver';
import { createConnection } from "typeorm";
import cookieParser from 'cookie-parser'; 
import { verify } from 'jsonwebtoken';
import { User } from './entity/User';
import { sendRefreshToken } from './sendRefreshToken';

(async () => {
  const app = express();
  app.use(cookieParser());

  //req / res at '/'
  app.get('/', (_req, res) => res.send('hello'));
  //handle refresh token
  app.post('/refresh_token', async (req, res) => {
    //console.log(req.cookies);
    const token = req.cookies.jid;
    if(!token){
      return res.send({ ok: false, accessToken: '' })
    }
    let payload: any = null;

    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!)
    } catch(err) {
      console.log(err);
      return res.send({ ok: false, accessToken: '' })
    }
    //token is vallid and can send back access token
    const user = await User.findOne({ id: payload.userId });

    //check if user exists
    if(!user) {
      return res.send({ ok: false, accessToken: '' })
    }
    if(user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: '' })
    }
    //if user exists
    //create new refresh token
    sendRefreshToken(res, createRefreshToken(user));
    //return access token
    return res.send({ ok: true, accessToken: createAccessToken(user) })

  });
  // console.log(process.env.ACCESS_TOKEN_SECRET);
  // console.log(process.env.REFRESH_TOKEN_SECRET);
  await createConnection();

  //apollo server
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver]
    }),
    context: ({ req, res }) => ({ req, res })
  });
  await apolloServer.start();

  //apply middleware to apollo server
  apolloServer.applyMiddleware({ app });

  //listening port
  app.listen(4000, () => {
    console.log("express server started")
  });
})();
// createConnection().then(async connection => {

//     console.log("Inserting a new user into the database...");
//     const user = new User();
//     user.firstName = "Timber";
//     user.lastName = "Saw";
//     user.age = 25;
//     await connection.manager.save(user);
//     console.log("Saved a new user with id: " + user.id);

//     console.log("Loading users from the database...");
//     const users = await connection.manager.find(User);
//     console.log("Loaded users: ", users);

//     console.log("Here you can setup and run express/koa/any other framework.");

// }).catch(error => console.log(error));
