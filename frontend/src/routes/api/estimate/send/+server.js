import { json } from '@sveltejs/kit';
import { nodeMailer } from '../../../../services/nodemailer';
import { dbconf } from '../../../../services/db';
import mysql from "mysql2/promise.js";


export async function POST({request,cookies}){
    
    let result = {msg:'no'}
    let status = 400
    const db = await mysql.createConnection(dbconf);
    const domain = 'https://epyeonhan.com';
    
    let body  = await request.json();

    try{
        const[rows,fileds] = await db.execute("select * from w_estimate where id=? and memberIdx=?",[body.number,body.user.idx]);    
        
        
        if(rows[0].id == body.number){

            rows[0].data = JSON.parse(rows[0].data);

            if(rows[0].guestPassword!=''){
                
                const subject = '[e편한 견적] '+rows[0].data.sender.name+'님께서 '+rows[0].data.receiver.name+'님께 견적서를 보내셨습니다.';
                const content = rows[0].data.receiver.name+'님 안녕하세요. 전자 견적서 서비스 <a href="'+domain+'" target="_blank">e편한 견적</a> 입니다.<br/>'+rows[0].data.sender.name+'님께서 '+rows[0].data.receiver.name+'님께 견적서를 보내셨습니다.<br/><br/>견적서 : <a href="'+domain+'/estimate/'+rows[0].id+'" target="_blank">'+domain+'/estimate/'+rows[0].id+'</a><br/>비밀번호 : '+rows[0].guestPassword;
                // rows[0].data.receiver.email = "kjw@work6.kr";
                nodeMailer(rows[0].data.receiver.email,subject,content);
                result = {msg:'ok'}
                status = 200;
            }
        }

    } catch(error){

    }

    db.end();
    return json(result,{status:status})
}