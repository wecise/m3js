<template>
    <FlexBox class="ovo-vrt-box">
        <slot></slot>
	</FlexBox>
</template>
<script>
import FlexBox from './FlexBox.vue'
export default {components: { FlexBox }}
</script>
<style>
/* items vertical - align bottom */
.ovo-vrt-box {
	flex-flow: column;
	justify-content: flex-start;
	align-items: flex-end;
}
</style>