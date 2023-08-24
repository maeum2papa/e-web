import { json } from '@sveltejs/kit';
import { dbconf } from '../../../../services/db';
import mysql from "mysql2/promise.js";

export async function POST({request,cookies}){
    
    let result = {msg:'no'}
    let status = 400
    const db = await mysql.createConnection(dbconf);

    const body = await request.json();


    if(body.data.number && body.user.idx){

        await db.execute("update w_estimate set title=?, lastPrice=?, data=?, moddt=now() where memberIdx=? and id=?",[body.data.title,body.data.lastPrice,JSON.stringify(body.data),body.user.idx,body.data.number]);
        

        result = {msg:'ok',id:body.data.number}
        status = 200;

    }else{
        
        const id = new Date().getTime();

        body.data.number = id;
        
        if(body.data.title && body.data.items && body.data.totalPrice>0){
           const addData = await db.execute("insert into w_estimate set id=?, memberIdx=?, title=?, lastPrice=?, data=?, insdt=now()",[id,body.user.idx,body.data.title,body.data.lastPrice,JSON.stringify(body.data)]);
           
        }

        result = {msg:'ok',id:id}
        status = 200;

    }
    
    db.end();
    return json(result,{status:status})
}