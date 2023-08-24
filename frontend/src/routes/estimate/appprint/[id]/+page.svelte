<script>

    import { page } from '$app/stores';
    import { auth } from '../../../../services/auth';
    import { user } from '../../../../stores/store';
    import { onMount } from 'svelte';
    import { postApi } from '../../../../services/api';
    import { won } from '../../../../services/format';
    import "../../../../css/print.min.css";

    const id = $page.params.id;
    let data = undefined;

    

    onMount(async()=>{

        $user = await auth();
        
        const res = await postApi({
            path:'/api/estimate/'+id,
            data:$user
        });
        
        
        if(res.msg=='ok'){
            
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
            
            setTimeout(()=>{
                document.title = data.title;
                
                const styleCode = "<style>:root{--font-size:12px;--font-size2:13px;--font-size3:14px;--font-size4:16px;--font-size5:18px;--font-size6:24px;--font-size7:28px;--yellow:#F7D264;--gray:#A0A0A0;--blue-gray:#8E919A;--bg:#E9EAEA;--border-color:rgb(187,187,187)}table{border-collapse:collapse;border-spacing:0}.wrap{margin:0 auto}.document{width:calc(100vw - 2px);margin:0 auto;border:1px solid var(--border-color);transform-origin:top left}.document .document-number{margin:10px}.document h1{font-size:var(--font-size6);text-align:center;margin:30px 10px}.document h2{font-size:var(--font-size4);font-weight:500}.document .info{display:flex;justify-content:space-between}.document .info>div:first-of-type{width:40%;padding:0 10px}.document .info>div:first-of-type>div{margin-top:10px}.document .info>div:last-of-type{width:60%}.document .info table td:last-of-type{border-right:0}.document table{width:100%}.document table th,.document table td{font-weight:400;border:1px solid var(--border-color);padding:5px;word-break:keep-all}.document table th>div{display:flex;justify-content:space-between}.document .item{margin-top:5px}.document .item th:first-of-type{border-left:0}.document .item th:last-of-type{border-right:0}.document .item td:first-of-type{border-left:0}.document .item td:last-of-type{border-right:0}.document .item tr td:nth-of-type(2),.document .item tr td:nth-of-type(4){text-align:center}.document .item tr td:nth-of-type(2){width:60px}.document .item tr td:nth-of-type(4){width:40px}.document .item tr td:nth-of-type(3),.document .item tr td:nth-of-type(5){text-align:right;width:80px}.document .item tr td:nth-of-type(6){width:80px}.document .additem{margin-top:5px}.document .additem th:first-of-type{border-left:0}.document .additem th:last-of-type{border-right:0}.document .additem td:first-of-type{border-left:0}.document .additem td:last-of-type{border-right:0}.document .additem tr td:nth-of-type(1){width:190px}.document .additem tr td:nth-of-type(3){width:171px;text-align:right}.document .calculate{margin-top:5px}.document .calculate th:first-of-type{border-left:0}.document .calculate td:last-of-type{border-right:0}.document .calculate tr th:nth-of-type(1){width:190px}.document .calculate tr td{text-align:right}.document .etc{margin-top:5px;border-top:1px solid var(--border-color)}.document .etc>div{padding:5px;border-bottom:1px solid var(--border-color)}.document .etc P{padding:5px;min-height:80px;line-height:16px}.document .last b{font-size:var(--font-size3)}</style>";
                // window.ReactNativeWebView.postMessage(document.documentElement.outerHTML);
                window.ReactNativeWebView.postMessage(styleCode+document.querySelector('.wrap').outerHTML);
            },60);

            setTimeout(()=>{
                location.href="/estimate/"+id;
            },100);
           
        }

    })

</script>    


{#if data}

<div class="wrap special" >

    <div class="document-container" >
        <div class="document">

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
                <p>{data.memo}<br>- e편한 견적에서 작성된 전자 견적서 입니다.</p>
            </div>
            
        </div>
    </div>

       

</div>

{/if}


<style lang="scss">
    :root{
        --border-color:rgb(187,187,187);
    }


    .wrap{
        margin:0 auto;
    }

    .document{
        width:calc(100vw - 2px);
        margin:0 auto;
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


</style>