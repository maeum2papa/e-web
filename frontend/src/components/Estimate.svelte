<script>

    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { cAlert } from '../stores/store';
    import { user,step } from '../stores/store';
    import { postApi } from '../services/api'
    import { auth } from '../services/auth';
    import { won } from '../services/format';
    import Toast from './Toast.svelte';
    

    const id = $page.params.id; 

    export let registFlag = true;
    let toastFlag = false;
    let toastFlag2 = false;


    let inputs = {
        title:{},
        receiver : {
            name : {},
            email : {},
        },
        sender : {
            name : {},
            email : {}
        }
    };

    let itemSum = 0;
    let allItemSum = 0;

    $: data= {
        number : '',
        title : '',
        expire : '',
        sender : {
            name : '',
            inumber : '',
            type : '',
            business : '',
            ceo : '',
            address : '',
            tel : '',
            email : '',
            stamp : ''
        },
        receiver : {
            name : '',
            email : '',
        },
        items : [
            {
                name : '',
                unit : '',
                price : 0,
                ea : 0,
                sumPrice : 0,
                memo : ''
            }
        ],
        addItems : [
            {
                name : '소계',
                memo : '',
                price : 0
            }
        ],
        totalPrice : 0,
        tax : 0,
        lastPrice : 0,
        memo : ''
    }

    

    const handleBack = ()=>{
        history.go(-1);
    }

    const handleSave = async()=>{

        if(data.title==''){
            $cAlert = {flag:true,msg:'견적서명을 입력해 주세요.',feedback:()=>{
                inputs.title.focus()
            }}
            return false;
        }

        if(data.receiver.name==''){
            $cAlert = {flag:true,msg:'받는 사람을 입력해 주세요.',feedback:()=>{
                inputs.receiver.name.focus()
            }}
            return false;
        }

        if(data.receiver.email==''){
            $cAlert = {flag:true,msg:'받는 사람 이메일을 입력해 주세요.',feedback:()=>{
                inputs.receiver.email.focus()
            }}
            return false;
        }

        if(data.sender.name==''){
            $cAlert = {flag:true,msg:'보내는 사람을 입력해 주세요.',feedback:()=>{
                inputs.sender.name.focus()
            }}
            return false;
        }

        if(data.sender.email==''){
            $cAlert = {flag:true,msg:'보낸는 사람 이메일을 입력해 주세요.',feedback:()=>{
                inputs.sender.email.focus()
            }}
            return false;
        }

        if(data.lastPrice==0){
            $cAlert = {flag:true,msg:'견적이 0원 입니다.',feedback:()=>{}}
            return false;
        }
        
        $user = await auth();
        
        const res = await postApi({
            path:'/api/estimate/save',
            data:{data:data,user:$user}
        });

        if(res.msg=='ok'){
            location.href='/estimate/'+res.id;
        }

    }

    const handleItemAdd = () =>{
        data.items = [...data.items,{
            name: '',
            unit: '',
            price: 0,
            ea: 0,
            sumPrice: 0,
            memo: ''}]
    }

    const handleAddItemAdd = () =>{
        data.addItems = [...data.addItems,{
            name : '',
            memo : '',
            price : 0
        }]
    }

    $:{
        itemSum = 0;
        data.items.map((item,i)=>{
            item.sumPrice = item.ea * item.price;
            itemSum = itemSum + item.sumPrice;
        });

        data.addItems[0].price = itemSum;

        allItemSum = 0;

        data.addItems.map((item)=>{
            allItemSum = allItemSum + (item.price*1);
        })

        data.totalPrice = allItemSum;
        data.tax = allItemSum*0.1;
        data.lastPrice = data.totalPrice + data.tax;

        
        if(data.sender.stamp!=''){
            
        }
    }


    const handleNextStep = () =>{

        if(data.number==''){
            if($step==1){
                toastFlag = true;
            }else if($step==2){
                toastFlag2 = true;
            }

            setTimeout(()=>{
                toastFlag = false;
                toastFlag2 = false;

                $step = $step + 1;
                
                setTimeout(()=>{
                    document.querySelector("header").scrollIntoView();
                },100);
                
            },1500)

            return false;
        }

        if($step<4){
            $step = $step + 1;
            
            setTimeout(()=>{
                document.querySelector("header").scrollIntoView();
            },100);
        }
    }



    const handelItemDelte = (e)=>{

        if(data.items.length==1){
            $cAlert = {flag:true,msg:'1개는 남겨주세요.',feedback:()=>{}};
            return false;
        }

        data.items.splice(e.target.getAttribute('idx'),1);
        data.items = data.items;
    }


    const handelAddItemDelte = (e)=>{
        data.addItems.splice(e.target.getAttribute('idx'),1);
        data.addItems = data.addItems;
    }
    


    onMount(async()=>{

        $user = await auth();

        let now = new Date();
        
        if(id==undefined){

            data.sender.email = $user.email;

            data.title = '견적서';
            data.expire = new Date(now.setDate(now.getDate() + 7)).toISOString().split('T')[0];


            const res2 = await postApi({
                path:'/api/estimate/quick',
                data:$user
            });

            if(res2.msg=='ok'){
                data.sender = res2.sender;
            }


            registFlag = true;
        }else{

            const res = await postApi({
                path:'/api/estimate/'+id,
                data:$user
            })
            
            if(res.msg=='ok'){
                data = res.data;
                registFlag = false;
            }
        }
        
    });

    


</script>

{#if $step==1}
<div class="step step1">
    <div class="wrap">
        <h2>기본 정보</h2>
        <div class="desc">견적서 이름은 어떻게 할까요?<span class="star">*</span></div>
        <input type="text" bind:value={data.title} bind:this={inputs.title}/>
        <div class="desc">이 견적서는 언제까지 유효한가요?</div>
        <input type="date" bind:value={data.expire} >
    </div>

    <div class="wrap">
        <h2>받는 분</h2>
        <div class="desc">견적서를 누가 요청하셨나요?<span class="star">*</span></div>
        <input type="text" bind:value={data.receiver.name} bind:this={inputs.receiver.name} placeholder="회사명 또는 이름"/>
        <div class="desc">받는 분 이메일 주소는요?<span class="star">*</span></div>
        <input type="text" bind:value={data.receiver.email} bind:this={inputs.receiver.email} placeholder="email@email.com"/>
    </div>

    <div class="wrap">
        <h2>보내는 분</h2>
        <div class="desc">작성자는 누구신가요?<span class="star">*</span></div>
        <input type="text" bind:value={data.sender.name} bind:this={inputs.sender.name} placeholder="회사명 또는 이름"/>
        
        <div class="desc">이메일 주소는 이게 맞나요?<span class="star">*</span></div>
        <input type="text" bind:value={data.sender.email} bind:this={inputs.sender.email} placeholder="email@email.com">

        <div class="desc">사업자등록번호가 어떻게 되세요?</div>
        <input type="text" bind:value={data.sender.inumber} placeholder="000-00-00000"/>

        <div class="desc">사업자등록증에 업태 및 업종은요?</div>
        <input type="text" bind:value={data.sender.type} placeholder="업태"/>
        <input type="text" bind:value={data.sender.business} placeholder="업종"/>

        <div class="desc">사업자 대표님은 누구세요?</div>
        <input type="text" bind:value={data.sender.ceo} placeholder="홍길동"/>

        <div class="desc">사업장 주소는요?</div>
        <input type="text" bind:value={data.sender.address} placeholder="입력해 주세요"/>

        <div class="desc">받는 분에게 알려주고 싶은 연락처는요?</div>
        <input type="text" bind:value={data.sender.tel} placeholder="입력해 주세요"/>
    </div>

</div>
{:else if $step==2}
<div class="step step2">
    {#each data.items as item,i}
    <div class="wrap">
        <h2>
            <div>견적 항목 {(i+1)}</div>
            <div><button type="button" class="itemDelete" on:click={handelItemDelte} idx={i}></button></div>
        </h2>
        <div class="desc">항목명</div>
        <input type="text" bind:value={item.name} placeholder="누수공사"/>

        <div class="desc">단위</div>
        <input type="text" bind:value={item.unit} placeholder="시간"/>

        <div class="desc">단가{#if item.unit!=''}({item.unit}당 가격, 부가세 빼고){/if}</div>
        <input type="number" bind:value={item.price} />

        <div class="desc">수량</div>
        <input type="number" bind:value={item.ea} />

        <div class="desc">비고 또는 메모</div>
        <input type="text" bind:value={item.memo} placeholder="메모를 입력해 주세요."/>

        <div class="itemSum">
            <div>합계</div>
            <div>{won(item.sumPrice)} <span>원</span></div>
        </div>

    </div>
    {/each}

    <button type="button" class="gray" on:click={handleItemAdd}>항목추가</button>
</div>
{:else if $step==3}
<div class="step step3">

    {#each data.addItems as item,i}
    <div class="wrap lists">
        <h2>
            <div>추가 항목 {(i+1)}</div>
            <div>{#if i!=0}<button type="button" class="itemDelete" on:click={handelAddItemDelte} idx={i}></button>{/if}</div>
        </h2>

        <div class="desc">항목명</div>
        <input type="text" bind:value={item.name} placeholder="항목명을 입력해 주세요."/>

        <div class="desc">계산식 또는 메모</div>
        <input type="text" bind:value={item.memo} placeholder="메모를 입력해 주세요."/>


        <div class="desc">가격</div>
        {#if i==0}
        <input type="text" bind:value={item.price} readonly/>
        {:else}
        <input type="text" bind:value={item.price}/>
        {/if}

    </div>
    {/each}

    <button type="button" class="gray" on:click={handleAddItemAdd}>항목추가</button>

    <div class="wrap">
        <h2>특이사항</h2>
        <div class="desc">지급방식, 계좌번호 등 견적 특이사항을 입력해 주세요.</div>
        <textarea bind:value={data.memo} rows={4} placeholder="입력해 주세요."></textarea>
    </div>
</div>
{:else if $step==4}
<div class="step step4">

    <div class="wrap">
        <h2>최종 계산</h2>
        <div class="box">
            <div>
                <div>공급가</div>
                <div>{won(data.totalPrice)} 원</div>
            </div>
            <div>
                <div>부가세</div>
                <div>{won(data.tax)} 원</div>
            </div>
            <div class="price">
                <div>최종 견적</div>
                <div>{won(data.lastPrice)} 원</div>
            </div>
        </div>
    </div>
</div>
{/if}


{#if $step<=2}
<button type="button" class="main-button" on:click={handleNextStep}>다음</button>
{:else if $step==3}
<button type="button" class="main-button" on:click={handleNextStep}>작성 완료</button>
{:else if $step==4}
<button type="button" class="main-button" on:click={handleSave}>{#if data.number==''}저장하고 미리보기{:else}수정하고 미리보기{/if}</button>
{/if}

{#if toastFlag}
<Toast data={{bottom:64,width:210,text:'다음번에 보내는 분 이대로 불러올게요!'}}/>
{/if}


{#if toastFlag2}
<Toast data={{bottom:64,width:210,text:'견적서 작성이 거의 완료 되었어요!'}}/>
{/if}



<style lang="scss">
    h2{
        font-size:var(--font-size4);
        font-weight: bold;
    }

    .desc{
        margin-top:24px;
    }

    .wrap{
        margin-top:40px;
        .desc{
            &:first-of-type{
                margin-top:20px;
            }
        }
    }

    .step{
        padding-bottom: 86px;
        .wrap{
            &:first-of-type{
                margin-top:0;
            }
        }
    }

    .itemSum{
        background:rgba(233,234,234,0.5);
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top:24px;
        border-radius: 8px;
        padding:24px 20px;
        
        div{
            font-size:15px;
            font-weight: bold;
            span{
                font-size: var(--font-size3);
                font-family: var(--spoqa);
            }
        }

    }


    button.gray{
        background: #fff;
        font-size:var(--font-size3);
        font-family: var(--spoqa);
        border:1px solid rgba(56,57,60,0.3);
        color:var(--blue-gray);
        font-weight: bold;
        padding:13px 0px;
        border-radius: 4px;
        margin:0 auto;
        margin-top:16px;
        width:calc(100% - 64px);
        display: block;
        position: relative;

        &::before{
            content: "";
            display: inline-block;
            width:10px;
            height:1.3px;
            background: var(--blue-gray);
            margin-right:6px;
            top:50%;
            transform: translateY(-4.3px);
        }

        &::after{
            content: "";
            position: absolute;
            display: inline-block;
            width:1.3px;
            height:10px;
            background: var(--blue-gray);
            top:50%;
            left:50%;
            transform: translate(-29.3px,-50%);
        }
    }

    .box{
        margin-top:16px;
        background:rgba(233,234,234,0.5);
        border-radius: 8px;
        padding:24px 20px;
        
        *{
            font-size:var(--font-size2);
            color:var(--gray);
            font-family: var(--spoqa);
        }

        & > div{
            display: flex;
            justify-content: space-between;
            margin-bottom: 16px;

            & > div{
                &:first-of-type{
                    font-weight: 500;
                }

                &:last-of-type{
                    font-weight: 400;
                    color:black;
                }
            }

            &.price{
                margin-bottom: 0;
                border-top:1px dashed rgba(56,57,60,0.2);
                padding-top: 16px;
                *{
                    color:black;
                    font-size:15px;
                    font-weight: bold !important;
                }
            }
        }
    }

    .step2,.step3 .lists{
        h2{
            display: flex;
            justify-content: space-between;
            align-items: center;
            div{
                &:first-of-type{
                    font-size:var(--font-size4);
                    font-weight: bold;
                }

                button{
                    border:0;
                    border-radius: 50%;
                    width:16px;
                    height:16px;
                    padding:10px;
                    position:relative;
                    opacity: 0.5;
                    
                    &::before{
                        content: '';
                        position: absolute;
                        width:12px;
                        height:1px;
                        background:var(--blue-gray);
                        left:50%;
                        top:50%;
                        transform: translate(-50%,-50%) rotate(-45deg);
                    }

                    &::after{
                        content: '';
                        position: absolute;
                        width:12px;
                        height:1px;
                        background:var(--blue-gray);
                        left:50%;
                        top:50%;
                        transform: translate(-50%,-50%) rotate(45deg);
                    }
                }
            }
        }
    }

</style>