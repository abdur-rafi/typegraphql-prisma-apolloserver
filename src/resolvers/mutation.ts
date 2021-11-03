import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { Context } from "..";
import { AuthPayLoad, Link, User } from "../grpahql-schema-classes";
import bcrpypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { APP_SECRET } from "../utility";

interface jwtPayLoad{
    userId : number
}

@Resolver()
class mutationResolver{
    
    @Mutation(returns => Link)
    postLink(@Arg("url") url : string, @Arg("description") description : string, @Ctx() ctx : Context){
        return ctx.prisma.link.create({
            data : {
                description : description,
                url : url
            }
        })
    }

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
        let u = await ctx.prisma.link.update({
            where : {
                id : id
            },
            data : {
                ...data
            }
        })
        return u;
    }
    @Mutation(returns => Link , {nullable : true})
    async deleteLink(@Ctx() ctx : Context, @Arg('id') id : number){
        let data : {
            description? : string,
            url? : string
        } = {}
        return await ctx.prisma.link.delete({
            where : {
                id : id
            } 
        })
    }
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