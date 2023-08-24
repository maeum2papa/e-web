<script>
    import { onMount } from "svelte";
    import { checkEmail } from "../../services/validate";
    import { cAlert } from '../../stores/store'
    import { postApi } from "../../services/api";

    import { auth } from "../../services/auth";
    import { user } from '../../stores/store';

    import Header2 from '../../components/Header2.svelte';

    let codeSendFlag = false;
    let disabledFlag = false;
    let buttonTitle = "인증번호 받기";

    let focuss = {
        email:{},
        code:{}
    }

    let data = {
        email:'',
        code:''
    }


    const handleClick = async()=>{
      
        if(!codeSendFlag){

            if(checkEmail(data.email)){
                
                const res = await postApi({
                    path:'/api/code',
                    data:data
                });

                if(res.msg=='ok'){

                    $cAlert = {flag:true,msg:'이메일로 인증번호가 보내졌습니다.',feedback:()=>{}}

                    codeSendFlag = true;

                    disabledFlag = true;

                    buttonTitle = "로그인";

                    setTimeout(()=>{
                        focuss.code.select();
                    },600);
                    
                }else{
                    $cAlert = {flag:true,msg:'네트워크가 불안정합니다. 잠시 후에 다시 시도해 주세요.',feedback:()=>{}}
                    return false;
                }
                
            }else{
                $cAlert = {flag:true,msg:'이메일을 확인해 주세요.',feedback:()=>{focuss.email.select();}}
                return false;
            }

        }else{

            const res = await postApi({
                path:'/api/code/cheacker',
                data:data
            });


            if(res.msg=='ok'){

                const res2 = await postApi({
                    path:'/api/login',
                    data:data
                });
                
                if(res2.msg=='ok'){
                    location.replace('/estimate');
                }
                
            }else{
                $cAlert = {flag:true,msg:'인증코드가 일치하지 않습니다.',feedback:()=>{}}
                return false;
            }

        }
    }

    const handleBack = () =>{
        setTimeout(()=>{
            history.go(-1);
        },10)
    }

    const handleEnter = (e)=>{
        if(e.key=='Enter'){
            handleClick();

        }
    }

    const handleReload = () =>{
        location.reload();
    }


    onMount(async()=>{
        
        $user = await auth();
        
        if($user!=undefined){
            location.replace('/estimate');
        }else{
            focuss.email.focus()
        }
    })

</script>

<svelte:head>
	<title>e편한 견적</title>
	<meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=no,maximum-scale=1.0,minimum-scale=1.0">
</svelte:head>

<Header2 {handleBack}/>

<div class="wrap">

    <div class="desc">이메일 인증만으로 바로 이용해보세요.</div>
    <input type="text" bind:value={data.email} placeholder="이메일" bind:this={focuss.email} readonly={disabledFlag} on:keyup={handleEnter}>
    {#if codeSendFlag}
    <input type="text" bind:value={data.code} placeholder="인증번호" bind:this={focuss.code} on:keyup={handleEnter}>
    {:else}
    <input type="text" disabled={true} placeholder="인증번호" >
    {/if}
    <div class="reload"><a href="/login" on:click|preventDefault={handleReload}>인증번호 재전송</a></div>
</div>

<button type="button" class="main-button" on:click={handleClick}>{buttonTitle}</button>


<style lang="scss">
    .wrap{
        margin-top:calc(50vh - 214px);
        // margin-bottom:calc(50vh - 54px);
    }
    .reload{
        margin-top:10px;
        color:var(--gray);
    }
</style>
