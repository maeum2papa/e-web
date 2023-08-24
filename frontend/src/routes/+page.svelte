<script>
    import { onMount } from "svelte";
    import { auth } from "../services/auth";
    import { user } from '../stores/store';
    import Header from '../components/Header.svelte';

    const handleEstimate = ()=>{
        location.href="/estimate/register";
    }

    onMount(async()=>{
        $user = await auth();
    })
</script>

<Header />

<div class="wrap">
    <p>견적서를
    편한 시간에 편한 장소에서,
    컴퓨터 태블릿 모바일
    상관없이,
    MS오피스 한글
    가리지 말고,</p>
</div>
<div class="visual">
    <img class="bg" src="/human.png" alt="">
    <img class="icon ms" src="/micro.svg" alt="">
    <img class="icon do" src="/document.svg" alt="">
    <img class="icon ha" src="/hangle.svg" alt="">
</div>

<div class="desc">
    빠르게 작성하고
    자유롭게 공유하세요!
</div>

<button type="button" class="main-button" on:click={handleEstimate}>1분만에 견적서 만들기</button>

<style lang="scss">


    @keyframes cloud {
        0% {transform: translateY(0);}
        100% {transform: translateY(10px);}
    }


    p{
        white-space: pre-line;
        font-size:var(--font-size7);
        margin-top:66px;
        line-height: 40px;
    }

    .visual{
        position: relative;
        text-align: right;

        .icon{
            position: absolute;
            top:0;
            right:0;

            &.ha{
                top:166px;
                right:7px;
                animation: cloud 2s linear 2s infinite alternate;
            }

            &.do{
                top:108px;
                right:212px;
                animation: cloud 2s linear 1s infinite alternate;
            }

            &.ms{
                top:-66px;
                right:0;
                animation: cloud 2s linear 0s infinite alternate;
            }
        }

        .bg{
            width:326px;
            transform: translate(0px,-12px);
        }
        
    }

    .desc{
        padding-top:37.6px;
        padding-bottom:96px;
        font-size:var(--font-size5);
        white-space: pre-line;
        text-align: center;
        font-weight: 500;
        line-height: 26px;
    }

</style>
<!--
<h1>여기는 메인 페이지</h1> 

<h2>견적서 빠르게 작성하고 쉽게 공유하세요</h2>
<h2>언제 어디서나 견적서 작성 가능</h2>
<h2>Window, Mac, Android, iPhone 어떤 환경에서도 사용할 수 있어요</h2>
<h2>PC, 태블릿, 스마트폰에서 <span>가능</span></h2>
-->
