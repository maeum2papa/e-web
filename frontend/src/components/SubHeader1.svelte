<script>
    import { step } from "../stores/store";

    const handleStepClick = (e)=>{
        $step = parseInt(e.target.innerHTML);
        setTimeout(()=>{
            document.querySelector("header").scrollIntoView();
        },100);
    }
</script>
<div class="wrap">
    <section>
        <div>
            <h1>빠르게 견적서를
                만들어 볼까요?
            </h1>
            <p>1분이면 충분해요!</p>
            <div class="step">
                <span class="on">1</span>
                <span on:click={handleStepClick}>2</span>
                <span on:click={handleStepClick}>3</span>
                <span on:click={handleStepClick}>4</span>
            </div>
        </div>
        <div>
            <div>
                <img src="/email.svg" alt=''>
                <img class="email-left" src="/email_left.svg" alt="">
                <img class="email-right" src="/email_right.svg" alt="">
            </div>
            <p><span class="star">*</span>표시는 필수 입력</p>
        </div>
    </section>
</div>

<style lang="scss">

    .wrap{
        padding-bottom:24px;
    }

    section{
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-top:47px;
        
        & > div{
            
            position: relative;

            &:first-of-type{
                width: calc(100% - 100px);
                font-family: var(--spoqa);
            }

            &:last-of-type{
                width: 100px;
                text-align: right;
                padding-right:6px;

                p{
                    margin-top:37px;
                }
            }
        }

        
    }

    h1{
        font-size:var(--font-size6);
        font-weight: bold;
        white-space: pre-line;
        line-height: 36px;
        transform: translateY(-10px);
        letter-spacing: -0.5px;
    }

    img{
        &.email-left,&.email-right{
            position: absolute;
        }

        &.email-left{
            top:63px;   
            right:66px;
        }

        &.email-right{
            top:-10px;
            right:-4px;
        }            
    }

    p{
        font-size: var(--font-size);
        color:var(--gray);
        white-space: pre-line;
        line-height: 18px;
    }


    .step{
        margin-top:34px;
        display: flex;
        position: relative;
        gap:16px;
        span{
            width:22px;
            height:22px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--bg);
            border-radius: 50%;
            position: relative;
            z-index: 1;

            &.on{
                background:var(--yellow);
                color:#fff;
            }
        }
        &::before{
            content: '';
            position: absolute;
            width:136px;
            border-top:1px dashed var(--gray);
            top:11px;
        }
    }

</style>