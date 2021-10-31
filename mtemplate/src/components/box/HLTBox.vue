<template>
    <FlexBox class="ovo-hlt-box">
        <slot></slot>
	</FlexBox>
</template>
<script>
import FlexBox from './FlexBox.vue'
export default {components: { FlexBox }}
</script>
<style>
/* items horizontal - align left */
.ovo-hlt-box {
	flex-flow: row;
	justify-content: flex-start;
	align-items: flex-start;
}
</style>