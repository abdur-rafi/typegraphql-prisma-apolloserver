import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { Context } from "..";
import { Link, User } from "../grpahql-schema-classes";

@Resolver(of => User)
export class UserResolver{

    @FieldResolver(returns => [Link])
    async links(@Ctx() ctx : Context, @Root() parent : User){
        return await ctx.prisma.user.findUnique({where : {id : parent.id}}).links()
    }

}

@Resolver(of => Link)
export class LinkResolver{
    
    @FieldResolver(returns => [User])
    async postedBy(@Ctx() ctx : Context, @Root() parent : Link){
        return await ctx.prisma.link.findUnique({
            where : {
                id : parent.id
            }
        }).postedBy()
    }
}