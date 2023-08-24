import { json } from '@sveltejs/kit';
import { getCookie } from '../../../../services/cookie';
import { decrypt } from '../../../../services/encrypt';

export async function POST({request,cookies}){
    
    let body = await request.json();
    
    let result = {msg:'no'};
    let status = 400;

    let code = getCookie(cookies,'code');
    
    if(body.code == code){
        result = {msg:'ok'};
        status = 200;
    }

    return json(result,{status:status})
}