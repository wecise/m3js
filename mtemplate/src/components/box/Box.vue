<template>
    <div class="ovo-box">
        <slot></slot>
    </div>
</template>
<style>
.ovo-box {
	order: 0;
	flex: 1 1 auto;
	align-self: auto;
	position: static;
	display: block;
	border: 0px solid transparent;
	padding: 0px 0px 0px 0px;
	margin: 0px 0px 0px 0px;
	width: 100%;
	height: 100%;
	overflow: visible;
}
</style>