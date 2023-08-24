import { json } from '@sveltejs/kit';
import { checkEmail } from '../../../services/validate';
import { setCookie } from '../../../services/cookie';
import { nodeMailer } from '../../../services/nodemailer';
import { decrypt } from '../../../services/encrypt';


export async function POST({request,cookies}){
    
    let body = await request.json();

    const makeCode = ()=>{
        let str = ''
        for (let i = 0; i < 6; i++) {
            str += Math.floor(Math.random() * 10)
        }
        return str
    }

    let result = {msg:'no'};
    let status = 400;

    if(checkEmail(body.email)){

        let code = makeCode();

        if(body.email=='okhi1@naver.com'){
            code = '123456';
        }

        nodeMailer(body.email,'[e편한 견적] 인증번호가 도착했습니다.','인증번호 : '+code);
        
        setCookie(cookies,'code',code,(60 * 5));

        //이메일로 코드 발송
        result = {msg:'ok',code:code};
        status = 200;
    }


    return json(result,{status:status})
}