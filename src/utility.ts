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

function getUserId(req : Request, authToken : string){
    
    const authHeader = req.headers.authorization;
    if(authHeader){
        const token = authHeader.replace('Bearer ', '');
        const t = getTokenPayLoad(token);
        if(!t){
            throw new Error('Unauthorized');
        }
        return t.userId;
    }
    throw new Error('Unauthorized');
}


export {APP_SECRET, getUserId};