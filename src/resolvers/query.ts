import { Ctx, Query, Resolver } from "type-graphql";
import { Context } from "..";
import { Link } from "../grpahql-schema-classes";

@Resolver()
class queryResolver{
    
    @Query(retunrs => String)
    info(){
        return 'test query';
    }

    @Query(returns => [Link])
    async feed(@Ctx() ctx : Context){
        return await ctx.prisma.link.findMany()
        // return links;
    }
    
}

export {queryResolver};