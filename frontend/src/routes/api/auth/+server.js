import { json } from '@sveltejs/kit';
import { getCookie,setCookie } from '../../../services/cookie';
import jwt from "jsonwebtoken";
 
export async function POST({request,cookies}){
    
    let result = {msg:'no'}
    let status = 400
    const secret = "work6forever";

    let accessToken = getCookie(cookies,'access_token');
    let refreshToken = getCookie(cookies,'refresh_token');

    try{

        const decode = jwt.verify(accessToken,secret);
        
        if(decode.data.email){
            result = {msg:'ok',idx:decode.data.idx,email:decode.data.email}
            status = 200;
        }

    } catch(error){


        try{

            const decode2 = jwt.verify(refreshToken,secret);

            if(decode2.data.email){
                accessToken = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 15),
                    data: {idx:decode2.data.idx,email:decode2.data.email}
                }, secret);

                setCookie(cookies,'access_token',accessToken,(60 * 15));

                result = {msg:'ok',idx:decode2.data.idx,email:decode2.data.email}
                status = 200;
            }

        } catch(error){

        }
    }
    
    
    return json(result,{status:status});
}