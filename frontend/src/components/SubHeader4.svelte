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
            <h1>견적서 작성이
                완료되었습니다.
            </h1>
            <p>작성된 견적서의 최종 비용이
                계산 되었어요.
            </p>
            <div class="step">
                <span on:click={handleStepClick}>1</span>
                <span on:click={handleStepClick}>2</span>
                <span on:click={handleStepClick}>3</span>
                <span class="on">4</span>
            </div>
        </div>
        <div>
            <div>
                <img src="/calculator.svg" alt=''>
            </div>
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

                div{
                    height:94px;
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


    p{
        font-size: var(--font-size);
        color:var(--gray);
        white-space: pre-line;
        line-height: 18px;
    }


    .step{
        margin-top:16px;
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