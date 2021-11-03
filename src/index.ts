// import { buildSchema } from "graphql";
import {Arg, buildSchema, Ctx, Field, ID, Mutation, ObjectType} from 'type-graphql'
import "reflect-metadata";
import { Query, Resolver } from "type-graphql";
import { ApolloServer } from 'apollo-server';
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import {PrismaClient} from '@prisma/client'
import { Link } from './grpahql-schema-classes';
import { queryResolver } from './resolvers/query';
import { mutationResolver } from './resolvers/mutation';

interface Context {
    prisma : PrismaClient
}

buildSchema({
    resolvers : [queryResolver, mutationResolver],
    
})
.then(schema =>{
    const prisma = new PrismaClient();
    const server = new ApolloServer({
        schema : schema,
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
        context : () : Context =>({prisma})
    })
    server.listen().then(({url})=>{
        console.log(url);
    })
})

export {Context};