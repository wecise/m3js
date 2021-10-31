<template>
    <Box class="ovo-flex-box">
        <slot></slot>
    </Box>
</template>
<script>
import Box from './Box.vue'
export default {components: { Box }}
</script>
<style>
.ovo-flex-box {
	position: relative;
	display: flex;
	flex-flow: row nowrap;
	justify-content: flex-start;
	align-items: flex-start;
	align-content: flex-start;
}
</style>