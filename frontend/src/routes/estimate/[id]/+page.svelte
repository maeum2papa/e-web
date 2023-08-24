<script>

    import { page } from '$app/stores';
    import { auth } from '../../../services/auth';
    import { user,cAlert } from '../../../stores/store';
    import { onMount } from 'svelte';
    import EstimatePassword from '../../../components/EstimatePassword.svelte';
    import { postApi } from '../../../services/api';
    import { won } from '../../../services/format';
    import Header2 from '../../../components/Header2.svelte';
    import Header from '../../../components/Header.svelte';
    import ClipboardJS from 'clipboard';

    const id = $page.params.id;
    
    const domain = "https://epyeonhan.com";

    let sendFlag = false;
    let sendData = {}

    let copyLink = false;

    let printSrc='';
    
    let data;

    let guestPassword = '';
    let guestFlag = false;

    let documentContinerStyle = "";
    let documentStyle = "";
    let wrap = undefined;
    let documentEle = undefined;
    const documentPaper = 595;
    let appFlag = false;

    const sendSubmit = async ()=>{

        const res = await postApi({
            path:"/api/estimate/send",
            data:{
                number:data.number,
                user:$user
            }
        });

        if(res.msg=='ok'){
            $cAlert = {flag:true,msg:'이메일로 견적서가 전송되었습니다.',feedback:()=>{
                sendFlag=false;
            }}
        }else{

        }
    }

    const handleModify = () => {
        location.href = '/estimate/register/'+$page.params.id;
    }

    const handleSend = async() => {
        sendData = data;
        sendFlag = true;

        const res = await postApi({
            path:"/api/estimate/link",
            data:{
                number:data.number,
                user:$user
            }
        });

        if(res.msg!='ok'){
            $cAlert = {flag:true,msg:'네트워크 오류가 발생했습니다. 잠시후 다시 시도해 주세요.',feedback:()=>{}}
            return false;
        }else{
            guestPassword = res.guestPassword;
        }
    }

    const handleEmailSend = () => {
        sendData.sendType='email';
        sendSubmit();
    }

    const handleCancle = () => {
        sendFlag = false;
        copyLink = false;
    }

    const handlePrint = ()=>{

        printSrc = '';

        setTimeout(()=>{
            //window.open("/estimate/print/"+data.number);    

            if(appFlag){
                location.href="/estimate/appprint/"+data.number;
            }else{
                printSrc = "/estimate/print/"+data.number;
            }
        },60);

    }

    const handleCopyLink = async()=>{

        copyLink= true;
        
        const res = await postApi({
            path:"/api/estimate/link",
            data:{
                number:data.number,
                user:$user
            }
        });

        if(res.msg!='ok'){
            $cAlert = {flag:true,msg:'네트워크 오류가 발생했습니다. 잠시후 다시 시도해 주세요.',feedback:()=>{}}
            return false;
        }else{
            guestPassword = res.guestPassword;
        }

    }

    const handleBack = () =>{
        setTimeout(()=>{
            location.href='/estimate';
        },10)
    }

    const linkCopy = ()=>{

        new ClipboardJS('.copyButton');

        $cAlert = {flag:true,msg:'견적서 주소가 복사되었어요.',feedback:()=>{
            copyLink = false;
        }};
    }

    const appFlagUpdate = (data) =>{
        appFlag = data;
    }

    onMount(async()=>{

        const userAgent = navigator.userAgent;

        if(window.ReactNativeWebView){
            appFlagUpdate(true);
           
        }

        

        $user = await auth();
        
        const res = await postApi({
            path:'/api/estimate/'+id,
            data:$user
        });
        
        if(res.msg=='ok'){

            if(res.guest==1){
                guestFlag = true;
            }
            
            if(res.data.items.length<10){
                let tmpItems = [];
                for(let i=0; i<(10-res.data.items.length); i++){
                    tmpItems.push({
                        ea:0,
                        memo:"",
                        name:"",
                        price:0,
                        sumPrice:0,
                        unit:""
                    });
                }
                res.data.items.push(...tmpItems);
            }
            
            data = res.data;
            
            if(window.innerWidth<768){
                setTimeout(()=>{
                    const rate = (wrap.offsetWidth / documentPaper);
                    documentStyle = "transform:scale("+(Math.floor(rate * 100) / 100)+")";
                    documentContinerStyle = "overflow:hidden; height:"+((documentEle.offsetHeight*rate)+2)+"px;";
                },100);
            }
            
        }

    })

</script>    

{#if data==undefined}
<Header/>
{:else}

    {#if guestFlag}
        <Header/>
    {:else}
        <Header2 {handleBack}/>
    {/if}
{/if}

<div class="wrap special" bind:this={wrap}>

    {#if data==undefined}
        <EstimatePassword {id}/>
    {:else}

    <div class="document-container" style={documentContinerStyle}>
        <div class="document" style={documentStyle} bind:this={documentEle}>

            <div class="document-number">문서번호 : {data.number}</div>

            <h1>
                {data.title}
            </h1>

            <div class="info">
                <div>
                    <h2>{data.receiver.name} 귀하</h2>
                    <div>아래와 같이 견적합니다.</div>
                    <div>견적 만료일 : {data.expire}</div>
                    <div>(단위 : 원)</div>
                </div>
                <div>

                    <table>
                        <tr>
                            <th>
                                <div>
                                    <i>회</i>
                                    <i>사</i>
                                    <i>명</i>
                                </div>
                            </th>
                            <td colspan=3>{data.sender.name}</td>
                        </tr>
                        <tr>
                            <th>
                                <div>
                                    <i>사</i>
                                    <i>업</i>
                                    <i>자</i>
                                    <i>등</i>
                                    <i>록</i>
                                    <i>번</i>
                                    <i>호</i>
                                </div>
                            </th>
                            <td colspan=3>{data.sender.inumber}</td>
                        </tr>
                        <tr>
                            <th>
                                <div>
                                    <i>업</i>
                                    <i>태</i>
                                </div>
                            </th>
                            <td>{data.sender.type}</td>
                            <th>
                                <div>
                                    <i>업</i>
                                    <i>종</i>
                                </div>
                            </th>
                            <td>{data.sender.business}</td>
                        </tr>
                        <tr>
                            <th>
                                <div>
                                    <i>사</i>
                                    <i>업</i>
                                    <i>장</i>
                                    <i>주</i>
                                    <i>소</i>
                                </div>
                            </th>
                            <td colspan=3>{data.sender.address}</td>
                        </tr>
                        <tr>
                            <th>
                                <div>
                                    <i>연</i>
                                    <i>락</i>
                                    <i>처</i>
                                </div>
                            </th>
                            <td colspan=3>{data.sender.tel}</td>
                        </tr>
                        <tr>
                            <th>
                                <div>
                                    <i>이</i>
                                    <i>메</i>
                                    <i>일</i>
                                </div>
                            </th>
                            <td colspan=3>{data.sender.email}</td>
                        </tr>
                    </table>
                </div>
            </div>


            <div class="item">
                <table>
                    <tr>
                        <th><i>항 목</i></th>
                        <th><i>단 위</i></th>
                        <th><i>단 가</i></th>
                        <th><i>수 량</i></th>
                        <th><i>합 계</i></th>
                        <th><i>비 고</i></th>
                    </tr>

                    {#each data.items as item}
                    <tr>
                        <td>{item.name}</td>
                        <td>{item.unit}</td>
                        <td>{item.price>0?won(item.price):' '}</td>
                        <td>{item.ea>0?won(item.ea):' '}</td>
                        <td>{item.sumPrice>0?won(item.sumPrice):' '}</td>
                        <td>{#if item.memo}{item.memo}{:else}&nbsp;{/if}</td>
                    </tr>
                    {/each}

                </table>
            </div>

            <div class="additem">
                <table>
                    <tr>
                        <th><i>추 가 항 목</i></th>
                        <th><i>메 모</i></th>
                        <th><i>단 가</i></th>
                    </tr>
                    {#each data.addItems as item}
                    <tr>
                        <td>{item.name}</td>
                        <td>{item.memo}</td>
                        <td>{#if item.price!=0}{won(item.price)}{:else}&nbsp;{/if}</td>
                    </tr>
                    {/each}
                </table>
            </div>

            <div class="calculate">

                <table>
                    <tr>
                        <th>
                            <div>
                                <i>공</i>
                                <i>급</i>
                                <i>가</i>
                            </div>
                        </th>
                        <td>{won(data.totalPrice)}</td>
                    </tr>
                    <tr>
                        <th>
                            <div>
                                <i>부</i>
                                <i>가</i>
                                <i>세</i>
                            </div>
                        </th>
                        <td>{won(data.tax)}</td>
                    </tr>
                    <tr>
                        <th>
                            <div>
                                <i><b>최</b></i>
                                <i><b>종</b></i>
                                <i><b>견</b></i>
                                <i><b>적</b></i>
                            </div>
                        </th>
                        <td class="last"><b>{won(data.lastPrice)}</b></td>
                    </tr>
                </table>
            </div>

            <div class="etc">
                <div><i>특 이 사 항</i></div>
                <p>{@html data.memo.replace(/\n/g, '<br>')}<br>- 이편한 견적에서 작성된 전자 견적서 입니다.</p>
            </div>
            
        </div>
    </div>

    {/if}
</div>

{#if data!=undefined && guestFlag}
    <div class="link-area guest">
        <button type="button" on:click={handlePrint}>견적서 프린트</button>
    </div>
{/if}

{#if data!=undefined && !guestFlag}
<div class="link-area">
    <button type="button" class="gray" on:click={handleModify}>수정</button>
    <button type="button" on:click={handlePrint}>프린트</button>
    <button type="button" on:click={handleCopyLink}>공유</button>
    <button type="button" on:click={handleSend}>이메일</button>
</div>
{/if}


{#if copyLink}
<div class="layerPopup">
    <div class="wrap">
        <h3>견적서가 준비 되었어요</h3>
        <div class="desc">{domain}/estimate/{data.number}</div>
        <div class="desc2">견적서 보기 비밀번호 : <b>{guestPassword}</b></div>
    </div>
    <button type="button" class="copyButton" on:click={linkCopy} data-clipboard-text="{domain}/estimate/{data.number}">주소복사</button>
</div>
<div class="mask" on:click={handleCancle}></div>
{/if}

{#if data!=undefined}
    {#if sendFlag}
        <div class="layerPopup">
            <div class="wrap">
                <h3>견적서가 준비 되었어요</h3>
                <div class="desc">받으시는 분 이메일 : {data.receiver.email}</div>
                <div class="desc2">견적서 보기 비밀번호 : <b>{guestPassword}</b></div>
            </div>
            <button type="button" on:click={handleEmailSend}>이메일 보내기</button>
        </div>
        <div class="mask" on:click={handleCancle}></div>
    {/if}
{/if}


<iframe src={printSrc}></iframe>


<style lang="scss">

    @keyframes fadeIn {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }

    :root{
        --border-color:rgb(187,187,187);
    }

    .wrap.special{
        opacity: 0;
        padding-top:47px;
        animation: fadeIn 0.6s ease-in-out forwards;
        animation-delay: 0.6s;
        animation-fill-mode: forwards;
    }


    .document{
        width:595px;
        border:1px solid var(--border-color);
        transform-origin: top left;

        .document-number{
            margin:10px;
        }

        h1{
            font-size:var(--font-size6);
            text-align: center;
            margin:30px 10px;
        }

        h2{
            font-size:var(--font-size4);
            font-weight: 500;
        }

        .info{
            display: flex;
            justify-content: space-between;
            & > div{

                &:first-of-type{
                    width:40%;
                    padding:0 10px;
                    & > div{
                        margin-top:10px;
                    }
                }

                &:last-of-type{
                    width:60%;
                }
            }

            table td:last-of-type{
                border-right:0;
            }
        }

        table{
            width:100%;
            th,td{
                font-weight: 400;
                border:1px solid var(--border-color);
                padding:5px;
                word-break: keep-all;
            }
            th > div{
                display: flex;
                justify-content: space-between;
            }
        }

        .item{
            margin-top:5px;

            th{
                &:first-of-type{
                    border-left:0;
                }
                &:last-of-type{
                    border-right:0;
                }
            }

            td{
                &:first-of-type{
                    border-left:0;
                }
                &:last-of-type{
                    border-right:0;
                }
            }

            tr{
                td:nth-of-type(2),
                td:nth-of-type(4){
                    text-align: center;
                }

                td:nth-of-type(2){
                    width:60px
                }

                td:nth-of-type(4){
                    width:40px
                }

                td:nth-of-type(3),
                td:nth-of-type(5){
                    text-align: right;
                    width: 80px;
                }

                td:nth-of-type(6){
                    width: 80px;
                }
            }
        }

        .additem{
            margin-top:5px;

            th{
                &:first-of-type{
                    border-left:0;
                }
                &:last-of-type{
                    border-right:0;
                }
            }

            td{
                &:first-of-type{
                    border-left:0;
                }
                &:last-of-type{
                    border-right:0;
                }
            }

            tr{
                td:nth-of-type(1){
                    width:190px;
                }

                td:nth-of-type(3){
                    width:171px;
                    text-align: right;
                }
            }


        }

        .calculate{
            margin-top:5px;

            th{
                &:first-of-type{
                    border-left:0;
                }
            }

            td{
                &:last-of-type{
                    border-right:0;
                }
            }

            tr{
                th:nth-of-type(1){
                    width:190px;
                }

                td{
                    text-align: right;
                }
            }
        }

        .etc{
            margin-top:5px;
            border-top:1px solid var(--border-color);
            & > div{
                padding:5px;
                border-bottom:1px solid var(--border-color);
            }


            P{
                padding:5px;
                min-height: 80px;
                line-height: 16px;
            }
        }

        .last b{
            font-size:var(--font-size3);
        }
    }

    .link-area{
        position: fixed;
        bottom:0;
        left:0;
        width:100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top:1px solid var(--bg);
        z-index: 100;

        button{
            width:25%;
            border:0;
            font-size:var(--font-size4);
            font-weight: bold;
            padding-top:18px;
            padding-bottom:17px;
            position: relative;
            background:#fff;

            &::after{
                content: "|";
                font-weight: 200;
                color:var(--bg);
                position: absolute;
                top:50%;
                right:0;
                transform: translateY(-50%);
            }

            &:last-of-type{
                &::after{
                    display: none;
                }
            }
        }

        &.guest{
            button{
                width:100%;
            }
        }
    }

    .layerPopup{
        position: fixed;
        width:100%;
        background:#fff;
        bottom:0;
        left:0;
        z-index: 200;
        border-radius: 16px;
        box-shadow: 0px 2px 16px rgba(105,108,120,.16);
        padding-top:32px;

        .wrap{
            padding-bottom:32px;
        }

        h3{
            font-size:var(--font-size4);
        }

        .desc{
            margin-top:20px;
            font-family: var(--spoqa);
        }
        
        .desc2{
            font-size: var(--font-size3);
            font-weight: 400;
            line-height: 28px;
            margin-top:6px;

            b{
                font-size:var(--font-size3);
                font-family: var(--spoqa);
            }
        }

        button{
            width:100%;
            background:var(--yellow);

            border:0;
            font-size:var(--font-size4);
            font-weight: bold;
            padding-top:18px;
            padding-bottom:17px;
        }
    }

    .mask{
        width:100vw;
        height:100vh;
        background: rgba(0,0,0,0.01);
        top:0;
        left:0;
        position: fixed;
        z-index: 99;
    }


    iframe{
        width:0;
        height:0;
        border:0;
        opacity: 0;
    }

</style>