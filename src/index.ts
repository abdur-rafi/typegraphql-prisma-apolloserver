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
import { getUserId } from './utility';
import { LinkResolver, UserResolver } from './resolvers/fieldResolvers';
import { authChecker } from './authChecker';

interface Context {
    prisma : PrismaClient,
    userId : number | null | undefined
}

buildSchema({
    resolvers : [queryResolver, mutationResolver, UserResolver, LinkResolver],
    authChecker : authChecker
    
})
.then(schema =>{
    const prisma = new PrismaClient();
    const server = new ApolloServer({
        schema : schema,
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
        context : ({req}) : Context =>{
            return({
                prisma : prisma,
                userId : req && req.headers.authorization ? getUserId(req) : null
            })
        }
    })
    server.listen().then(({url})=>{
        console.log(url);
    })
})

export {Context};