import { json } from '@sveltejs/kit';
import { dbconf } from '../../../../services/db';
import mysql from "mysql2/promise.js";
import { setCookie } from '../../../../services/cookie';
import  jwt  from "jsonwebtoken";

export async function POST({request,cookies}){
    
    let result = {msg:'no'}
    let status = 400
    const db = await mysql.createConnection(dbconf);
    const secret = "work6forever";
    
    let body =  await request.json();

    
    try{

        const[rows,fileds] = await db.execute("select id from w_estimate where id=? and guestPassword=? limit 1",[body.id,body.password]);
        

        if(rows[0].id){

            let guestToken = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 15),
                data: {password:body.password}
            }, secret);

            setCookie(cookies,'guest_token',guestToken,(60*15));

            result = {msg:'ok'}
            status = 200;

        }

    }catch(error){

    }

    db.end();
    return json(result,{status:status})
}