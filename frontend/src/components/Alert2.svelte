<script>
    import { cAlert } from '../stores/store'

    function closeAlert(){
        $cAlert.flag = false;
    }
</script>

{#if $cAlert.flag}
<div class="alert">
    <div>{$cAlert.msg}</div>
    <button type="button" on:click={()=>{ closeAlert(); $cAlert.feedback(); }}>확인</button>
</div>

<div class="mask"></div>
{/if}


<style lang="scss">
.alert{
    position:fixed;
    width:90%;
    max-width: 400px;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
    background: #fff;
    z-index: 2001;
    border-radius: 4px;
    text-align: center;
    div{
        font-size:var(--font-size4);
        padding:20px;
        padding-bottom:0;
    }
}
.mask{
    position: fixed;
    width:100vw;
    height: 100vh;
    background: rgba(1,1,1,0.9);
    z-index: 2000;
    top:0;
    left:0;
}
button{
    margin-top:20px;
    width:100%;
    border:0;
    background:var(--yellow);
    border:0;
    font-size:var(--font-size4);
    font-weight: bold;
    width:100%;
    padding-top:18px;
    padding-bottom:17px;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
}

</style>