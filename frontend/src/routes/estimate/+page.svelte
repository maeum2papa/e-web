<script>

    import { onMount } from 'svelte';
    import { postApi } from '../../services/api';
    import { auth } from "../../services/auth";
    import { user } from '../../stores/store';
    import { won,timeToDate } from '../../services/format';

    import Header3 from '../../components/Header3.svelte';
    import SubHeader from '../../components/SubHeader.svelte';
    import { compute_rest_props } from 'svelte/internal';

    let list = [];

    const handleEstimate = ()=>{
        location.href="/estimate/register";
    }

    const handleBack = () =>{
        setTimeout(()=>{
            history.go(-1);
        },10)
    }

    const handleView = (id) =>{
        location.href = "/estimate/"+id;
    }

    onMount(async()=>{
        
        $user = await auth();
        
        if($user==undefined){
            location.replace('/login');
        }
        
		const res = await postApi({
			path:'/api/estimate',
            data:$user
		});
        
        if(res.msg=='ok'){
            list = res.list;
        }
	})

</script>    


<Header3 {handleBack}/>

<SubHeader></SubHeader>


<div class="wrap">

    

    {#if list.length>0}

        {#each list as item}
        <div class="item"  on:click={handleView(item.id)}>
            <h2>문서번호 {item.id}</h2>
            <div class="box">
                <div>
                    <div>견적서명</div>
                    <div>{item.data.title}</div>
                </div>
                <div>
                    <div>받는분</div>
                    <div>{item.data.receiver.name}</div>
                </div>
                <div>
                    <div>견적일</div>
                    <div>{timeToDate(item.insdt)}</div>
                </div>
                <div>
                    <div>만료일</div>
                    <div>{item.data.expire}</div>
                </div>
                <div>
                    <div>공급가</div>
                    <div>{won(item.data.totalPrice)} 원</div>
                </div>
                <div>
                    <div>부가세</div>
                    <div>{won(item.data.tax)} 원</div>
                </div>

                <div class="price">
                    <div>최종 견적</div>
                    <div>{won(item.lastPrice)} 원</div>
                </div>
            </div>
            
        </div>
        {/each}
    {:else}
        <div class="nodata">
            작성된 견적서가 없습니다.
        </div>
    {/if}

</div>


<button type="button" class="main-button" on:click={handleEstimate}>견적서 만들기</button>


<style lang="scss">
    .wrap{
        padding-bottom:94px;
    }

    .nodata{
        text-align: center;
        color:var(--gray);
        margin-top:10vh;
    }

    .item{

        margin-top:40px;

        &:first-of-type{
            margin-top:0px;
        }

        h2{
            font-size:var(--font-size4);
            font-weight: bold;
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
    }

</style>