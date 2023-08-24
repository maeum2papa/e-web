<script>
    export let data;
</script>

<div class="toast" style="bottom:{data.bottom}px; width:{data.width}px;">
    <div><img src="/icon_document.svg" alt=""></div>
    <div><p>{data.text}</p></div>
</div>

<style lang="scss">
    
    .toast{
        background: black;
        display: flex;
        justify-content: center;
        align-items: center;
        padding:8px;
        position: fixed;
        border-radius: 17px;
        z-index: 300;
        left:50%;
        transform: translateX(-50%);

        &::after{
            content: '1';
            position: absolute;
            left:50%;
            bottom:-7px;
            width:13px;
            height:13px;
            background: black;
            transform: rotate(45deg) translateX(-50%);
            z-index: -1;
            border:0;
        }

        img{
            margin-right:6px;
        }

        p{
            color:#fff;
            display: inline-block;
            padding-right:6px;
        }
    }
</style>