<div class="wrap">
    <section>
        <div>
            <h1>내가 작성한
                견적서에요
            </h1>
            <p>문서번호를 누르면
                다시 볼 수 있어요.</p>
        </div>
        <div>
            <div>
                <img src="/email.svg" alt=''>
                <img class="email-left" src="/email_left.svg" alt="">
                <img class="email-right" src="/email_right.svg" alt="">
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
            width: 50%;
            position: relative;

            &:first-of-type{
                font-family: var(--spoqa);
            }

            &:last-of-type{
                text-align: right;
                padding-right:6px;

            }
        }

        
    }

    h1{
        font-size:var(--font-size6);
        font-weight: bold;
        white-space: pre-line;
        line-height: 36px;
        transform: translateY(-10px);
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



</style>