import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { Context } from "..";
import { Link, User, Vote } from "../grpahql-schema-classes";

@Resolver(of => User)
export class UserResolver{

    @FieldResolver(returns => [Link])
    async links(@Ctx() ctx : Context, @Root() parent : User){
        return await ctx.prisma.user.findUnique({where : {id : parent.id}}).links()
    }
    @FieldResolver(returns => [Vote])
    async votes(@Root() parent : User, @Ctx() ctx : Context){
        return await ctx.prisma.user.findUnique({
            where : {
                id : parent.id
            }
        }).votes()
    }

}

@Resolver(of => Link)
export class LinkResolver{
    
    @FieldResolver(returns => [User])
    async postedBy(@Ctx() ctx : Context, @Root() parent : Link){
        // console.log('here')
        // console.log(ctx)
        let t = await ctx.prisma.link.findUnique({
            where : {
                id : parent.id
            }
        }).postedBy()
        // console.log(t)
        
        return t
    }

    @FieldResolver(returns => [Vote])
    async votes(@Root() parent : Link, @Ctx() ctx : Context){
        return await ctx.prisma.link.findUnique({
            where : {
                id : parent.id
            }
        }).votes()
    }
}

@Resolver(of => Vote)
export class VoteResolver{
    @FieldResolver(returns => User)
    async user(@Root() parent : Vote, @Ctx() ctx : Context){
        return await ctx.prisma.vote.findUnique({
            where : {
                id : parent.id
            }
        }).user()
    }
    @FieldResolver(returns => Link)
    async link(@Root() parent : Vote, @Ctx() ctx : Context){
        return await ctx.prisma.vote.findUnique({
            where : {
                id : parent.id
            }
        }).link()
    }
}
