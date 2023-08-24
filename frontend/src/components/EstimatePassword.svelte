<script>

    import { cAlert } from '../stores/store';
    import { postApi } from '../services/api';
    import { onMount } from 'svelte';

    export let id;
    
    let data = {
        id:id,
        password:''
    }
 
    let inputs = {
        password:{}
    }

    const handleClick = async() =>{
        if(data.password==''){
            $cAlert = {flag:true,msg:'비밀번호를 입력해 주세요.',feedback:()=>{inputs.password.select();}}
            return false;
        } 

        const res = await postApi({
            path:'/api/guest/login',
            data:data
        });
        
        if(res.msg=='ok'){
            location.reload();
        }else{
            $cAlert = {flag:true,msg:'비밀번호를 다시 확인해 주세요.',feedback:()=>{inputs.password.select();}}
            return false;
        }
    }


    onMount(()=>{
        inputs.password.focus();
    })
    
</script>

<div class="container">

    <div class="desc">비밀번호를 입력하고 견적서를 확인 하세요.</div>
    <input type='text' placeholder="비밀번호" bind:value={data.password} bind:this={inputs.password}/>

</div>

<button type="button" class="main-button" on:click={handleClick}>확인</button>

<style lang="scss">
    .container{
        margin-top: calc(50vh - 214px);
    }
</style>