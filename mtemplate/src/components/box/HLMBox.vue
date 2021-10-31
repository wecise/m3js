<template>
    <FlexBox class="ovo-hlm-box">
        <slot></slot>
	</FlexBox>
</template>
<script>
import FlexBox from './FlexBox.vue'
export default {components: { FlexBox }}
</script>
<style>
/* items horizontal - align left */
.ovo-hlm-box {
	flex-flow: row;
	justify-content: flex-start;
	align-items: center;
}
</style>