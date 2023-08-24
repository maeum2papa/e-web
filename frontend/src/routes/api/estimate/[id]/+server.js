import { json } from '@sveltejs/kit';
import { dbconf } from '../../../../services/db';
import mysql from "mysql2/promise.js";
import { getCookie } from '../../../../services/cookie';
import jwt from 'jsonwebtoken';


export async function POST({params,request,cookies}){
    

    let result = {msg:'no'};
    let status = 400;
    let guestToken = '';
    const secret = "work6forever";
    const db = await mysql.createConnection(dbconf);
    
    const body = await request.json();

    try{


        if(body.idx!=undefined){

            const[rows,fileds] = await db.execute("select * from w_estimate where memberIdx=? and id=?",[body.idx,params.id]);
            
            if(rows.length>0){
    
                let res = rows[0];
                res.data = JSON.parse(res.data);
                
                res.msg = 'ok';
    
                result = res;
                status = 200;
            }
        }
        
    
        if(status==400){
            guestToken = getCookie(cookies,'guest_token');
            if(guestToken!=''){
                const decode2 = jwt.verify(guestToken,secret);
    
                const[rows,fileds] = await db.execute("select * from w_estimate where guestPassword=? and id=?",[decode2.data.password,params.id]);
                
    
                if(rows[0]){
                    let res = rows[0];
                    res.data = JSON.parse(res.data);
                    
                    res.msg = 'ok';
    
                    res.guest = 1;
    
                    result = res;
                    status = 200;
                }
    
            }
        }
        
    }catch(error){

    }

    
    db.end();
    return json(result,{status:status})
}