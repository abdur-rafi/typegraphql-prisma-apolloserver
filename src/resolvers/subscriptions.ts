import { PubSub, PubSubEngine, Resolver, Root, Subscription } from "type-graphql";
import { Link, Vote } from "../grpahql-schema-classes";

@Resolver()
export class subscriptionResolver{

    @Subscription({
        topics : 'NEW_LINK'
    })
    newLink(@Root() link : Link, @PubSub() pb : PubSubEngine) : Link{
        // console.log(link)
        return link
    }

    @Subscription({
        topics : 'NEW_VOTE'
    })
    newVote(@Root() parent : Vote) : Vote{
        return parent
    }

}