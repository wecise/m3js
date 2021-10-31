<template>
    <FlexBox class="ovo-vcm-box">
        <slot></slot>
	</FlexBox>
</template>
<script>
import FlexBox from './FlexBox.vue'
export default {components: { FlexBox }}
</script>
<style>
/* items vertical - align middle */
.ovo-vcm-box {
	flex-flow: column;
	justify-content: center;
	align-items: center;
}
</style>