import { Request } from 'express';
import jwt from 'jsonwebtoken'
import { jwtPayLoad } from './resolvers/mutation';
const APP_SECRET = 'alskdfljasdlfkj';

function getTokenPayLoad(token : string){
    let t : null | jwtPayLoad = null;
    try{
        t = jwt.verify(token, APP_SECRET) as jwtPayLoad;
    }
    catch(err){
        
    }
    return t;
}

function getUserId(req : Request | null, token : string | null){
    if(!req && !token){
        throw new Error("Unauthorized")
    }
    let authString : string | null | undefined = ''
    if(req){
        authString = req.headers.authorization;
    }
    else{
        authString = token
    }
        
    if(authString){
        const token = authString.replace('Bearer ', '');
        if(!token) return null;
        const t = getTokenPayLoad(token);
        if(!t){
            throw new Error('Unauthorized');
        }
        return t.userId;
    }
    else return null;
    // throw new Error('Unauthorized');
}


export {APP_SECRET, getUserId};