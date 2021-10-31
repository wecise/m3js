<template>
    <FlexBox class="ovo-vct-box">
        <slot></slot>
	</FlexBox>
</template>
<script>
import FlexBox from './FlexBox.vue'
export default {components: { FlexBox }}
</script>
<style>
/* items vertical - align middle */
.ovo-vct-box {
	flex-flow: column;
	justify-content: flex-start;
	align-items: center;
}
</style>