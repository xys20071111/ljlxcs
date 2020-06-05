<template>
	<div id="app">
		<router-view />
	</div>
</template>

<script>

export default {
	name: 'App'
}
</script>

<style>
html,body{height:100%;overflow:hidden}
#app {
	font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
	position: absolute;
	left:0;top:0;right:0;bottom:0;
}
</style>



// WEBPACK FOOTER //
// src/App.vue
