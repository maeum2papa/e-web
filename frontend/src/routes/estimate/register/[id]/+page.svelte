<script>
    import { onMount } from 'svelte';
    import { user,step } from '../../../../stores/store';
    import { auth } from '../../../../services/auth';

    import Header2 from '../../../../components/Header2.svelte';
    import Estimate from '../../../../components/Estimate.svelte';
    import SubHeader1 from "../../../../components/SubHeader1.svelte";
    import SubHeader2 from "../../../../components/SubHeader2.svelte";
    import SubHeader3 from "../../../../components/SubHeader3.svelte";
    import SubHeader4 from "../../../../components/SubHeader4.svelte";

    

    const handleBack = ()=>{
        if($step>1){
            $step = $step - 1;
        }else{
            setTimeout(()=>{
                history.go(-1);
            },10)
        }
    }

    onMount(async()=>{
        $user = await auth();
        
        if($user==undefined){
            location.replace('/login');
        }
        
    })
</script>    

<Header2 {handleBack}/>

{#if $step==1}
<SubHeader1></SubHeader1>
{:else if $step==2}
<SubHeader2></SubHeader2>
{:else if $step==3}
<SubHeader3></SubHeader3>
{:else if $step==4}
<SubHeader4></SubHeader4>
{/if}

<Estimate/>