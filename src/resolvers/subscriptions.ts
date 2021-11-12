import { Resolver, Root, Subscription } from "type-graphql";
import { Link } from "../grpahql-schema-classes";

@Resolver()
export class subscriptionResolver{

    @Subscription({
        topics : 'NEW_LINK'
    })
    newLink(@Root() link : Link) : Link{
        return link
    }


}