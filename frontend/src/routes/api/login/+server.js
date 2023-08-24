import { setCookie } from '../../../services/cookie'
import { json } from '@sveltejs/kit';
import  jwt  from "jsonwebtoken";
import { dbconf } from '../../../services/db';
import mysql from "mysql2/promise.js";

export async function POST({request,cookies}){
    
    let result = {msg:'no'}
    let status = 400
    const secret = "work6forever";
    const db = await mysql.createConnection(dbconf);
    const body = await request.json();

    const[rows,feilds] = await db.execute("SELECT COUNT(*) as cnt FROM w_member WHERE email=?",[body.email]);
    

    if(rows[0].cnt==0){
        await db.execute("insert into w_member set email=?, insdt=now()",[body.email]);
        
    }

    const[rows2,feilds2] = await db.execute("SELECT idx,email FROM w_member WHERE email=?",[body.email]);
    


    let accessToken = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 15),
        data: {idx:rows2[0].idx,email:body.email}
    }, secret);


    let refreshToken = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30),
        data: {idx:rows2[0].idx,email:body.email}
    }, secret);



    if(accessToken!='' && refreshToken!=''){

        setCookie(cookies,'access_token',accessToken,(60 * 15));
        setCookie(cookies,'refresh_token',refreshToken,(60 * 60 * 24 * 180));

        result = {msg:'ok'}
        status = 200
    }
    
    db.end();
    return json(result,{status:status});
}