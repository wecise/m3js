<template>
    <FlexBox class="ovo-vcb-box">
        <slot></slot>
	</FlexBox>
</template>
<script>
import FlexBox from './FlexBox.vue'
export default {components: { FlexBox }}
</script>
<style>
/* items vertical - align middle */
.ovo-vcb-box {
	flex-flow: column;
	justify-content: flex-end;
	align-items: center;
}
</style>