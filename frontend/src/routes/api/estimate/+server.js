import { json } from '@sveltejs/kit';
import { dbconf } from '../../../services/db';
import mysql from "mysql2/promise.js";

export async function POST({request,cookies}){
    
    let result = {msg:'no'};
    let status = 400;
    const db = await mysql.createConnection(dbconf);
    
    try{

        const param = await request.json();
        
        const[rows,fileds] = await db.execute("select * from w_estimate where memberIdx=? order by id desc",[param.idx]);

        rows.forEach((e,i)=>{
            rows[i].data = JSON.parse(e.data);
        });
        
        result = {msg:'ok',list:rows};
        status = 200;

    } catch(error){
        
    }
    
    db.end();
    return json(result,{status:status})
}