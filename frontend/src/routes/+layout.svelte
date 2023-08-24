<script>
    import { onMount } from 'svelte';
	import Alert2 from '../components/Alert2.svelte'
	import '../css/common.min.css';
</script>

<svelte:head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="format-detection" content="telephone=no">
	<title>e편한 견적</title>
	<meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=yes">
</svelte:head>

<div class="app">

	<main>
		<slot></slot>
	</main>
</div>
	
<Alert2/>

<style lang="scss">
	html,body{
		background:#efefef;
	}
	.app{
		max-width:667px;
		width:100%;
		background:#fff;
		box-shadow: 0px 5px 15px rgba(0,0,0,0.3);
		margin:0 auto;
		position: relative;
		// overflow-x: hidden;
	}
	main{
		min-height:100vh;
	}
	footer{
		background:#f9f9f9;
		color:var(--gray-font);
		text-align: center;
		font-size:14px;
		padding: 20px;
		margin-top:160px;
	}
</style>
