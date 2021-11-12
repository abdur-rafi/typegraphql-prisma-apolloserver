import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
class User{
    @Field()
    id : number;

    @Field()
    name : string;
    
    @Field()
    email : string;
    
    @Field(type => [Link])
    links : Link[] 

    @Field(type => [Vote])
    votes : Vote[]

    
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

    postedById : number;

    
    @Field(type => [Vote])
    votes : Vote[]


}

@ObjectType()
class AuthPayLoad{
    @Field()
    token : string;

    @Field(type => User)
    user : User;
}

@ObjectType()
class Vote{
    @Field()
    id : number;

    @Field(type => User)
    user : User;

    @Field(type => Link)
    link : Link;

}

export {Link, User, AuthPayLoad, Vote}