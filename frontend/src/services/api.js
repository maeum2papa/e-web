import { decrypt, encrypt } from '../services/encrypt';

const commonHeader = {
    "Content-Type": "application/json;charset=UTF-8",
    "Accept" : "application/json",
}

const getApi = async ({path="",auth=''} = {})=>{
    
    try{
        const response = await fetch(path);

        result = await response.json();
        
        return result;
        
    }catch(err){
        // throw err
    }

}


const postApi = async ({path="",data={},auth=''} = {})=>{
    
    try{

        let result = {};
        
        const response = await fetch(path,{
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            headers: commonHeader,
            body:JSON.stringify(data)
        });

        return await response.json();
        
    }catch(err){
        // throw err
    }
    
}

const getServerApi = async ({path="",auth=''} = {})=>{
    
}


export{
    getApi,
    postApi,
    getServerApi
}