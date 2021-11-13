import { Arg, Ctx, Field, InputType, Query, registerEnumType, Resolver } from "type-graphql";
import { Context } from "..";
import { Link } from "../grpahql-schema-classes";



enum Sort{
    asc,
    desc
}

registerEnumType(Sort, {
    name : "Sort"
})

@InputType()
class LinkOrderInputType{
    @Field(type => Sort)
    description : Sort;
    @Field(type => Sort)
    url : Sort;
    @Field(type => Sort)
    createdAt : Sort;
}

@Resolver()
class queryResolver{

    

    @Query(retunrs => String)
    info(){
        return 'test query';
    }

    @Query(returns => [Link])
    async feed(
        @Ctx() ctx : Context, 
        @Arg('filter', {nullable : true}) filter : string,
        @Arg('skip', {nullable : false}) skip : number,
        @Arg('take', {nullable : false}) take : number,
        @Arg('orderBy', {nullable : false}) orderBy : LinkOrderInputType
    ){
        return await ctx.prisma.link.findMany({
            where : filter ? {
                OR : [
                    {description : {contains : filter}},
                    {url : {contains : filter}}
                ]
            } : {},
            skip : skip,
            take : take
        })
        // return links;
    }
    
}

export {queryResolver};