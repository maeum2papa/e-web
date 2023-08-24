import { json } from '@sveltejs/kit';
import { dbconf } from '../../../../services/db';
import mysql from "mysql2/promise.js";

export async function POST({request,cookies}){
    
    let result = {msg:'no'}
    let status = 400
    const db = await mysql.createConnection(dbconf);

    const body = await request.json();


    try{
        if(body.idx){

            const[rows,fileds] = await db.execute("select * from w_estimate where memberIdx=? order by insdt desc limit 1",[body.idx]);
            
    
            rows[0].data = JSON.parse(rows[0].data);
    
            if(rows[0].data.sender){
            
                result = {msg:'ok',sender:rows[0].data.sender}
                status = 200;
            }
    
        }
    }catch(error){

    }
    db.end();
    return json(result,{status:status})
}