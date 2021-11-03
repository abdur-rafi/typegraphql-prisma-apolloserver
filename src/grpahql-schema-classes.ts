import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
class User{
    @Field()
    id : string;

    @Field()
    name : string;
    
    @Field()
    email : string;
    
    @Field(type => [Link])
    links : Link[]
}


@ObjectType({description : 'news links'})
class Link{
    @Field(type => ID)
    id : number;
    
    @Field()
    description : string;
    
    @Field()
    url : string;

    @Field(type => User)
    postedBy : User

}


class AuthPayLoad{
    @Field()
    token : string;

    @Field(type => User)
    user : User;
}

export {Link, User, AuthPayLoad}