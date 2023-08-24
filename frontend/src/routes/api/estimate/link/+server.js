import { json } from '@sveltejs/kit';
import { dbconf } from '../../../../services/db';
import mysql from "mysql2/promise.js";

export async function POST({request,cookies}){
    
    let result = {msg:'no'}
    let status = 400
    let guestPassword = '';
    const db = await mysql.createConnection(dbconf);

    for (let i = 0; i < 6; i++) {
        guestPassword += Math.floor(Math.random() * 10)
    }

    try{

        const body = await request.json();

        const [rows,fileds] = await db.execute("select * from w_estimate where id=? and memberIdx=?",[body.number,body.user.idx]);
        


        if(rows[0].id==body.number){
            if(rows[0].guestPassword==''){
                await db.execute("update w_estimate set guestPassword=? where id=?",[guestPassword,body.number]);
                
            }else{
                guestPassword = rows[0].guestPassword;
            }
        }
        
        

        result = {msg:'ok',guestPassword:guestPassword}
        status = 200;

    }catch(error){

    }

    db.end();
    return json(result,{status:status})
}