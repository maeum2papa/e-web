import { writable } from 'svelte/store';

// export const count = writable(0);

const cAlert = writable({
    flag:false,
    msg:'',
    feedback:()=>{
        
    }
})

const user = writable('');

const step = writable(1);

export{
    cAlert,
    user,
    step
}