<template>
    <FlexBox class="ovo-vlm-box">
        <slot></slot>
	</FlexBox>
</template>
<script>
import FlexBox from './FlexBox.vue'
export default {components: { FlexBox }}
</script>
<style>
/* items vertical - align top */
.ovo-vlm-box {
	flex-flow: column;
	justify-content: center;
	align-items: flex-start;
}
</style>