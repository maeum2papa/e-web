import { postApi } from "./api";

const auth = async()=>{
    
    const res = await postApi({
        path:"/api/auth"
    });
    
    if(res.email!=undefined && res.idx!=undefined && res.idx!='' && res.idx!=''){
        // userEmail = res.email;
        return res;
    }else{
        return undefined;
    }

}

export{
    auth
}