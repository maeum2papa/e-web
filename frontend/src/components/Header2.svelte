<script>
	import { onMount } from "svelte";
	import { user } from "../stores/store";
	
	export let handleBack;

	let sticky = "";

	onMount(()=>{
		window.addEventListener('scroll', () => { 
			if(window.scrollY==0){
				sticky = "";
			}else{
				sticky = "sticky";
			}
		});
	});

</script>


<header class={sticky}>
	<div><a href="/" on:click|preventDefault={handleBack}><img src="/arrow.svg" alt="" ></a></div>
	<div>
		{#if $user==undefined }
		<a href="/login" on:click|preventDefault={()=>{location.href='/login';}}>로그인</a>
		{:else}
		<a href="/estimate"on:click|preventDefault={()=>{location.href='/estimate';}}>견적서내역</a>
		{/if}
	</div>
</header>

<style lang="scss">
    header{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top:16px;
		padding-left:24px;
		padding-right:24px;
        transform: translateY(-1px);
		position: sticky;
		top:0;
		z-index: 10;
		background: rgba(255,255,255,0.98);
		padding-bottom: 10px;

		a{
			color:var(--blue-gray);
			font-size:var(--font-size2);
		}


		&.sticky{
			box-shadow: 0px 0px 10px rgba(100,100,100, 0.3);
		}
	}
</style>