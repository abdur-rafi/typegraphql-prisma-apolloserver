import { Arg, Authorized, Ctx, Mutation, PubSub, Resolver } from "type-graphql";
import { Context } from "..";
import { AuthPayLoad, Link, User } from "../grpahql-schema-classes";
import bcrpypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { APP_SECRET } from "../utility";
import { PubSubEngine } from "graphql-subscriptions";

interface jwtPayLoad{
    userId : number
}

@Resolver()
class mutationResolver{
    
    @Authorized()
    @Mutation(returns => Link)
    async postLink(@Arg("url") url : string, @Arg("description") description : string, @Ctx() ctx : Context, @PubSub() pb : PubSubEngine){
        let t = await ctx.prisma.link.create({
            data : {
                description : description,
                url : url,
                postedById : ctx.userId
            }
        })
        pb.publish('NEW_LINK', t)
        return t;
    }

    @Authorized()
    @Mutation(returns => Link , {nullable : true})
    async updateLink(@Ctx() ctx : Context, @Arg('id') id : number, @Arg('description', {
        nullable : true
    }) description? : string, @Arg('url', {
        nullable : true
    }) url? : string){

        let data : {
            description? : string,
            url? : string
        } = {}
        if(description) data.description = description;
        if(url) data.url = url;

        let link = await ctx.prisma.link.findUnique({
            where : {
                id : id
            }
        })
        
        if(!link){
            throw new Error("Link does not exist")
        }
        if(link.postedById !== ctx.userId){
            throw new Error("Unauthorized")
        }
        let updatedLink = await ctx.prisma.link.update({
            where : {
                id : link.id
            },
            data:{
                ...data
            }
        })
        
        return updatedLink;
    }

    @Authorized()
    @Mutation(returns => Link , {nullable : true})
    async deleteLink(@Ctx() ctx : Context, @Arg('id') id : number){
        let data : {
            description? : string,
            url? : string
        } = {}
        let link = await ctx.prisma.link.findUnique({
            where : {id : id}
        })
        if(!link){
            throw new Error("Link does not exist")
        }
        if(link.postedById !== ctx.userId){
            throw new Error("Unauthorized")
        }
        await ctx.prisma.link.delete({
            where : {
                id : link.id
            }
        })
        return link;

    }

    @Authorized()
    @Mutation(returns => AuthPayLoad)
    async signup(@Arg("name") name : string, @Arg("email") email : string, @Arg("password") pass : string, @Ctx() ctx : Context){
        let hashed = await bcrpypt.hash(pass, 10);
        let user = await ctx.prisma.user.create({
            data : {
                email : email,
                name : name,
                password : hashed
            }
        })
        
        let token = jwt.sign({
            userId : user.id
        }, APP_SECRET);
        

        return({
            user : user,
            token : token
        })
    }

    @Authorized()
    @Mutation(returns => AuthPayLoad)
    async login(@Arg('email') email : string, @Arg('pass') pass : string, @Ctx() ctx : Context){
        let user = await ctx.prisma.user.findUnique({
            where : {
                email : email
            }
        })
        if(!user){
            throw new Error("user not found");
        }
        let valid = await bcrpypt.compare(pass, user.password);
        if(!valid){
            throw new Error("Invalid password");
        }
        let token = jwt.sign({
            userId : user.id
        }, APP_SECRET);
        return {
            user : user,
            token : token

        }
    }


}

export {mutationResolver, jwtPayLoad}