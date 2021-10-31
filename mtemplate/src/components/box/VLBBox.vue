<template>
    <FlexBox class="ovo-vlb-box">
        <slot></slot>
	</FlexBox>
</template>
<script>
import FlexBox from './FlexBox.vue'
export default {components: { FlexBox }}
</script>
<style>
/* items vertical - align top */
.ovo-vlb-box {
	flex-flow: column;
	justify-content: flex-end;
	align-items: flex-start;
}
</style>