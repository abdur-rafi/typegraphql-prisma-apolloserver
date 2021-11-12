// import { buildSchema } from "graphql";
import {Arg, buildSchema, Ctx, Field, ID, Mutation, ObjectType} from 'type-graphql'
import "reflect-metadata";
import { Query, Resolver } from "type-graphql";
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageGraphQLPlayground, ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import {PrismaClient} from '@prisma/client'
import { Link } from './grpahql-schema-classes';
import { queryResolver } from './resolvers/query';
import { mutationResolver } from './resolvers/mutation';
import { getUserId } from './utility';
import { LinkResolver, UserResolver } from './resolvers/fieldResolvers';
import { authChecker } from './authChecker';
import express from 'express';
// import http from 'http';

import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';

import { PubSub } from 'graphql-subscriptions';
import { subscriptionResolver } from './resolvers/subscriptions';

const pubsub = new PubSub();



interface Context {
    prisma : PrismaClient,
    userId : number | null | undefined
}

buildSchema({
    resolvers : [queryResolver, mutationResolver, UserResolver, LinkResolver, subscriptionResolver],
    authChecker : authChecker,
    pubSub : pubsub
    
})
.then(async schema =>{
    const app = express();
    const httpServer = createServer(app);
    const prisma = new PrismaClient();

    const subscriptionServer = SubscriptionServer.create(
        { schema, execute, subscribe },
        { server: httpServer, path: '/' }
      );


    const server = new ApolloServer({
        schema : schema,
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground(), {
            async serverWillStart() {
              return {
                async drainServer() {
                  subscriptionServer.close();
                }
              };
            }
          }],
        context : ({req}) : Context =>{
            return({
                prisma : prisma,
                userId : req && req.headers.authorization ? getUserId(req) : null
            })
        }
    })
    await server.start();

    server.applyMiddleware({
        app,
        path: '/'
    });
    



    // server.listen().then(({url})=>{
    //     console.log(url);
    // })
    httpServer.listen({ port: 4000 }, ()=>{
        console.log('App running at port 4000')
    })

})

export {Context};